import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient = null;

export const initializeRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      password: process.env.REDIS_PASSWORD || undefined,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('❌ Redis reconnection limit reached');
            return new Error('Redis reconnection failed');
          }
          return retries * 500;
        },
      },
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('🔄 Redis connecting...');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis client ready');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('❌ Redis initialization error:', error.message);
    throw error;
  }
};

export const getRedisClient = () => {
  if (!redisClient || !redisClient.isOpen) {
    throw new Error('Redis client not initialized or connection closed');
  }
  return redisClient;
};

export default redisClient;
