import { getRedisClient } from '../config/redis.js';
import crypto from 'crypto';

const DEFAULT_TTL = parseInt(process.env.REDIS_TTL) || 604800; // 7 days

/**
 * Generate cache key from parameters
 */
const generateCacheKey = (prefix, params) => {
  const paramString = JSON.stringify(params, Object.keys(params).sort());
  const hash = crypto.createHash('sha256').update(paramString).digest('hex');
  return `${prefix}:${hash}`;
};

/**
 * Cache Service for managing Redis operations
 */
class CacheService {
  constructor() {
    this.redis = null;
  }

  /**
   * Initialize Redis client
   */
  initialize() {
    this.redis = getRedisClient();
  }

  /**
   * Get cached itinerary
   */
  async getItinerary(params) {
    try {
      if (!this.redis) this.initialize();
      
      const key = generateCacheKey('itinerary', params);
      const cached = await this.redis.get(key);
      
      if (cached) {
        console.log(`✅ Cache HIT for key: ${key}`);
        return JSON.parse(cached);
      }
      
      console.log(`❌ Cache MISS for key: ${key}`);
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null; // Fail gracefully
    }
  }

  /**
   * Set cached itinerary
   */
  async setItinerary(params, data, ttl = DEFAULT_TTL) {
    try {
      if (!this.redis) this.initialize();
      
      const key = generateCacheKey('itinerary', params);
      await this.redis.setEx(key, ttl, JSON.stringify(data));
      
      console.log(`✅ Cached itinerary with key: ${key} (TTL: ${ttl}s)`);
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Cache parsed intent
   */
  async getIntent(userInput) {
    try {
      if (!this.redis) this.initialize();
      
      const key = generateCacheKey('intent', { input: userInput });
      const cached = await this.redis.get(key);
      
      if (cached) {
        console.log(`✅ Intent cache HIT`);
        return JSON.parse(cached);
      }
      
      return null;
    } catch (error) {
      console.error('Intent cache get error:', error);
      return null;
    }
  }

  async setIntent(userInput, data, ttl = 86400) { // 24 hours
    try {
      if (!this.redis) this.initialize();
      
      const key = generateCacheKey('intent', { input: userInput });
      await this.redis.setEx(key, ttl, JSON.stringify(data));
      
      console.log(`✅ Cached intent`);
      return true;
    } catch (error) {
      console.error('Intent cache set error:', error);
      return false;
    }
  }

  /**
   * Invalidate cache for specific parameters
   */
  async invalidateItinerary(params) {
    try {
      if (!this.redis) this.initialize();
      
      const key = generateCacheKey('itinerary', params);
      await this.redis.del(key);
      
      console.log(`✅ Invalidated cache for key: ${key}`);
      return true;
    } catch (error) {
      console.error('Cache invalidation error:', error);
      return false;
    }
  }

  /**
   * Get all keys matching a pattern
   */
  async getKeys(pattern) {
    try {
      if (!this.redis) this.initialize();
      return await this.redis.keys(pattern);
    } catch (error) {
      console.error('Get keys error:', error);
      return [];
    }
  }

  /**
   * Clear all cache
   */
  async clearAll() {
    try {
      if (!this.redis) this.initialize();
      await this.redis.flushDb();
      console.log(`✅ Cleared all cache`);
      return true;
    } catch (error) {
      console.error('Clear cache error:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats() {
    try {
      if (!this.redis) this.initialize();
      
      const info = await this.redis.info('stats');
      const keys = await this.redis.dbSize();
      
      return {
        totalKeys: keys,
        info: info
      };
    } catch (error) {
      console.error('Get stats error:', error);
      return null;
    }
  }

  /**
   * Set with custom key
   */
  async set(key, value, ttl = DEFAULT_TTL) {
    try {
      if (!this.redis) this.initialize();
      
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      await this.redis.setEx(key, ttl, serialized);
      
      return true;
    } catch (error) {
      console.error('Set error:', error);
      return false;
    }
  }

  /**
   * Get with custom key
   */
  async get(key, parseJSON = true) {
    try {
      if (!this.redis) this.initialize();
      
      const value = await this.redis.get(key);
      
      if (!value) return null;
      
      return parseJSON ? JSON.parse(value) : value;
    } catch (error) {
      console.error('Get error:', error);
      return null;
    }
  }

  /**
   * Delete with custom key
   */
  async delete(key) {
    try {
      if (!this.redis) this.initialize();
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key) {
    try {
      if (!this.redis) this.initialize();
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Exists check error:', error);
      return false;
    }
  }

  /**
   * Set expiry on existing key
   */
  async expire(key, ttl) {
    try {
      if (!this.redis) this.initialize();
      await this.redis.expire(key, ttl);
      return true;
    } catch (error) {
      console.error('Expire error:', error);
      return false;
    }
  }
}

// Export singleton instance
export default new CacheService();
