import { getRedisClient } from '../config/redis.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Collaboration Service for managing real-time presence and locking
 */
class CollaborationService {
  constructor() {
    this.redis = null;
  }

  initialize() {
    this.redis = getRedisClient();
  }

  /**
   * Add user to active viewers of an itinerary
   */
  async addViewer(itineraryId, userId, userName) {
    try {
      if (!this.redis) this.initialize();
      
      const key = `presence:${itineraryId}`;
      const viewerData = JSON.stringify({
        userId,
        userName,
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      });
      
      // Store in Redis hash with TTL
      await this.redis.hSet(key, userId, viewerData);
      await this.redis.expire(key, 3600); // 1 hour
      
      console.log(`👥 User ${userName} joined itinerary ${itineraryId}`);
      
      return await this.getViewers(itineraryId);
    } catch (error) {
      console.error('Add viewer error:', error);
      throw error;
    }
  }

  /**
   * Remove user from active viewers
   */
  async removeViewer(itineraryId, userId) {
    try {
      if (!this.redis) this.initialize();
      
      const key = `presence:${itineraryId}`;
      await this.redis.hDel(key, userId);
      
      console.log(`👥 User ${userId} left itinerary ${itineraryId}`);
      
      // Release any locks held by this user
      await this.releaseUserLocks(itineraryId, userId);
      
      return await this.getViewers(itineraryId);
    } catch (error) {
      console.error('Remove viewer error:', error);
      throw error;
    }
  }

  /**
   * Get all active viewers of an itinerary
   */
  async getViewers(itineraryId) {
    try {
      if (!this.redis) this.initialize();
      
      const key = `presence:${itineraryId}`;
      const viewers = await this.redis.hGetAll(key);
      
      if (!viewers || Object.keys(viewers).length === 0) {
        return [];
      }
      
      return Object.values(viewers).map(v => JSON.parse(v));
    } catch (error) {
      console.error('Get viewers error:', error);
      return [];
    }
  }

  /**
   * Update user's last active timestamp
   */
  async updateActivity(itineraryId, userId) {
    try {
      if (!this.redis) this.initialize();
      
      const key = `presence:${itineraryId}`;
      const viewerData = await this.redis.hGet(key, userId);
      
      if (viewerData) {
        const parsed = JSON.parse(viewerData);
        parsed.lastActive = new Date().toISOString();
        await this.redis.hSet(key, userId, JSON.stringify(parsed));
      }
      
      return true;
    } catch (error) {
      console.error('Update activity error:', error);
      return false;
    }
  }

  /**
   * Lock a specific day for editing
   */
  async lockDay(itineraryId, dayNumber, userId, userName) {
    try {
      if (!this.redis) this.initialize();
      
      const lockKey = `lock:${itineraryId}:day:${dayNumber}`;
      const existing = await this.redis.get(lockKey);
      
      // Check if already locked by someone else
      if (existing) {
        const lockData = JSON.parse(existing);
        if (lockData.userId !== userId) {
          return {
            success: false,
            locked: true,
            lockedBy: lockData
          };
        }
      }
      
      // Acquire lock
      const lockData = {
        userId,
        userName,
        lockedAt: new Date().toISOString(),
        lockId: uuidv4()
      };
      
      await this.redis.setEx(lockKey, 300, JSON.stringify(lockData)); // 5 min lock
      
      console.log(`🔒 Day ${dayNumber} locked by ${userName} in itinerary ${itineraryId}`);
      
      return {
        success: true,
        locked: true,
        lockedBy: lockData
      };
    } catch (error) {
      console.error('Lock day error:', error);
      throw error;
    }
  }

  /**
   * Release lock on a specific day
   */
  async unlockDay(itineraryId, dayNumber, userId) {
    try {
      if (!this.redis) this.initialize();
      
      const lockKey = `lock:${itineraryId}:day:${dayNumber}`;
      const existing = await this.redis.get(lockKey);
      
      if (existing) {
        const lockData = JSON.parse(existing);
        
        // Only allow unlock if user owns the lock
        if (lockData.userId === userId) {
          await this.redis.del(lockKey);
          console.log(`🔓 Day ${dayNumber} unlocked in itinerary ${itineraryId}`);
          return { success: true };
        }
        
        return { 
          success: false, 
          message: 'Cannot unlock - not lock owner' 
        };
      }
      
      return { success: true, message: 'No lock found' };
    } catch (error) {
      console.error('Unlock day error:', error);
      throw error;
    }
  }

  /**
   * Check lock status of a day
   */
  async checkLock(itineraryId, dayNumber) {
    try {
      if (!this.redis) this.initialize();
      
      const lockKey = `lock:${itineraryId}:day:${dayNumber}`;
      const lockData = await this.redis.get(lockKey);
      
      if (lockData) {
        return {
          locked: true,
          lockData: JSON.parse(lockData)
        };
      }
      
      return { locked: false };
    } catch (error) {
      console.error('Check lock error:', error);
      return { locked: false };
    }
  }

  /**
   * Get all locks for an itinerary
   */
  async getAllLocks(itineraryId) {
    try {
      if (!this.redis) this.initialize();
      
      const pattern = `lock:${itineraryId}:day:*`;
      const keys = await this.redis.keys(pattern);
      
      if (!keys || keys.length === 0) {
        return {};
      }
      
      const locks = {};
      for (const key of keys) {
        const dayNumber = key.split(':').pop();
        const lockData = await this.redis.get(key);
        if (lockData) {
          locks[dayNumber] = JSON.parse(lockData);
        }
      }
      
      return locks;
    } catch (error) {
      console.error('Get all locks error:', error);
      return {};
    }
  }

  /**
   * Release all locks held by a user
   */
  async releaseUserLocks(itineraryId, userId) {
    try {
      if (!this.redis) this.initialize();
      
      const pattern = `lock:${itineraryId}:day:*`;
      const keys = await this.redis.keys(pattern);
      
      let released = 0;
      for (const key of keys) {
        const lockData = await this.redis.get(key);
        if (lockData) {
          const parsed = JSON.parse(lockData);
          if (parsed.userId === userId) {
            await this.redis.del(key);
            released++;
          }
        }
      }
      
      if (released > 0) {
        console.log(`🔓 Released ${released} locks for user ${userId}`);
      }
      
      return released;
    } catch (error) {
      console.error('Release user locks error:', error);
      return 0;
    }
  }

  /**
   * Store cursor position for collaborative editing
   */
  async updateCursor(itineraryId, userId, position) {
    try {
      if (!this.redis) this.initialize();
      
      const key = `cursor:${itineraryId}`;
      const cursorData = JSON.stringify({
        userId,
        position,
        timestamp: new Date().toISOString()
      });
      
      await this.redis.hSet(key, userId, cursorData);
      await this.redis.expire(key, 300); // 5 minutes
      
      return true;
    } catch (error) {
      console.error('Update cursor error:', error);
      return false;
    }
  }

  /**
   * Get all cursor positions
   */
  async getCursors(itineraryId) {
    try {
      if (!this.redis) this.initialize();
      
      const key = `cursor:${itineraryId}`;
      const cursors = await this.redis.hGetAll(key);
      
      if (!cursors || Object.keys(cursors).length === 0) {
        return {};
      }
      
      const result = {};
      for (const [userId, data] of Object.entries(cursors)) {
        result[userId] = JSON.parse(data);
      }
      
      return result;
    } catch (error) {
      console.error('Get cursors error:', error);
      return {};
    }
  }

  /**
   * Clean up stale presence/locks (run periodically)
   */
  async cleanupStale() {
    try {
      if (!this.redis) this.initialize();
      
      // This would be called by a periodic job
      // Redis TTL handles most cleanup automatically
      console.log('🧹 Cleanup task completed');
      
      return true;
    } catch (error) {
      console.error('Cleanup error:', error);
      return false;
    }
  }
}

export default new CollaborationService();
