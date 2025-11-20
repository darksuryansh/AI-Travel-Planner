import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'travel-planner-backend',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

// Kafka Producer
export const createProducer = async () => {
  const producer = kafka.producer();
  await producer.connect();
  console.log('✅ Kafka Producer connected');
  return producer;
};

// Kafka Consumer
export const createConsumer = async (groupId) => {
  const consumer = kafka.consumer({ 
    groupId: groupId || process.env.KAFKA_GROUP_ID 
  });
  await consumer.connect();
  console.log('✅ Kafka Consumer connected');
  return consumer;
};

// Kafka Topics
export const TOPICS = {
  FLIGHT_WATCH_REQUESTS: 'flight-watch-requests',
  FLIGHT_PRICE_UPDATES: 'flight-price-updates',
  ITINERARY_UPDATES: 'itinerary-updates',
};

export default kafka;
