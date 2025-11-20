import dotenv from 'dotenv';
import { createConsumer, TOPICS } from '../config/kafka.js';
import { db, collections } from '../config/firebase.js';
import axios from 'axios';

dotenv.config();

/**
 * Price Watch Worker - Kafka Consumer
 * Monitors flight prices and alerts users of price drops
 */

let consumer = null;
let isRunning = false;

/**
 * Mock function to fetch flight prices
 * In production, integrate with real flight API (Amadeus, Skyscanner, etc.)
 */
const fetchFlightPrice = async (watchData) => {
  try {
    console.log(`✈️  Fetching price for ${watchData.origin} → ${watchData.destination}`);
    
    // MOCK: Simulate API call
    // In production, replace with real flight API
    const mockPrice = Math.floor(Math.random() * 500) + 200;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      price: mockPrice,
      currency: 'USD',
      airline: 'Mock Airlines',
      lastUpdated: new Date().toISOString(),
      available: true
    };
    
    /* PRODUCTION EXAMPLE with Amadeus API:
    const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
      headers: {
        Authorization: `Bearer ${process.env.AMADEUS_ACCESS_TOKEN}`
      },
      params: {
        originLocationCode: watchData.origin,
        destinationLocationCode: watchData.destination,
        departureDate: watchData.departureDate,
        adults: watchData.passengers || 1
      }
    });
    
    const offers = response.data.data;
    if (offers && offers.length > 0) {
      const lowestPrice = Math.min(...offers.map(o => parseFloat(o.price.total)));
      return {
        price: lowestPrice,
        currency: offers[0].price.currency,
        airline: offers[0].validatingAirlineCodes[0],
        lastUpdated: new Date().toISOString(),
        available: true
      };
    }
    */
    
  } catch (error) {
    console.error('Flight price fetch error:', error.message);
    return null;
  }
};

/**
 * Check for price drop and send notification
 */
const checkPriceAndNotify = async (watchData, currentPrice) => {
  try {
    const { watchId, priceHistory, userEmail } = watchData;
    
    // Get last price
    const lastPrice = priceHistory.length > 0 
      ? priceHistory[priceHistory.length - 1].price 
      : null;
    
    const priceChanged = lastPrice && currentPrice.price !== lastPrice;
    const priceDrop = lastPrice && currentPrice.price < lastPrice;
    const dropPercentage = lastPrice 
      ? ((lastPrice - currentPrice.price) / lastPrice * 100).toFixed(1)
      : 0;
    
    // Update price history
    const updatedHistory = [
      ...priceHistory,
      {
        price: currentPrice.price,
        currency: currentPrice.currency,
        checkedAt: new Date().toISOString(),
        airline: currentPrice.airline
      }
    ];
    
    // Keep only last 30 price checks
    if (updatedHistory.length > 30) {
      updatedHistory.shift();
    }
    
    // Update Firestore
    await db.collection(collections.PRICE_WATCHES).doc(watchId).update({
      priceHistory: updatedHistory,
      lastChecked: new Date().toISOString(),
      currentPrice: currentPrice.price,
      lastPrice: lastPrice
    });
    
    // Send notification if price dropped
    if (priceDrop) {
      console.log(`🎉 PRICE DROP DETECTED! ${dropPercentage}% decrease`);
      console.log(`   From: $${lastPrice} → To: $${currentPrice.price}`);
      console.log(`   User: ${userEmail}`);
      
      // In production, send email/push notification
      // await sendEmailNotification(userEmail, {
      //   subject: `Price Drop Alert: ${dropPercentage}% off!`,
      //   priceFrom: lastPrice,
      //   priceTo: currentPrice.price,
      //   destination: watchData.destination
      // });
    } else if (priceChanged) {
      console.log(`💹 Price changed: $${lastPrice} → $${currentPrice.price}`);
    } else {
      console.log(`✅ Price stable: $${currentPrice.price}`);
    }
    
    return {
      priceChanged,
      priceDrop,
      dropPercentage
    };
    
  } catch (error) {
    console.error('Price check/notify error:', error);
    return null;
  }
};

/**
 * Process a single price watch request
 */
const processPriceWatch = async (message) => {
  try {
    const watchData = JSON.parse(message.value.toString());
    
    console.log(`\n💼 Processing price watch: ${watchData.watchId}`);
    console.log(`   Route: ${watchData.origin} → ${watchData.destination}`);
    console.log(`   Departure: ${watchData.departureDate}`);
    
    // Fetch current price
    const currentPrice = await fetchFlightPrice(watchData);
    
    if (!currentPrice) {
      console.log('⚠️  Failed to fetch price, will retry later');
      return;
    }
    
    // Check and notify
    await checkPriceAndNotify(watchData, currentPrice);
    
  } catch (error) {
    console.error('Process price watch error:', error);
  }
};

/**
 * Start the worker
 */
const startWorker = async () => {
  try {
    console.log('🚀 Starting Price Watch Worker...\n');
    
    // Create Kafka consumer
    consumer = await createConsumer(process.env.KAFKA_GROUP_ID);
    
    // Subscribe to topic
    await consumer.subscribe({ 
      topic: TOPICS.FLIGHT_WATCH_REQUESTS,
      fromBeginning: false 
    });
    
    console.log(`✅ Subscribed to topic: ${TOPICS.FLIGHT_WATCH_REQUESTS}\n`);
    
    isRunning = true;
    
    // Start consuming
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!isRunning) return;
        
        await processPriceWatch(message);
      },
    });
    
    console.log('👀 Worker is now listening for price watch requests...\n');
    
  } catch (error) {
    console.error('❌ Worker startup failed:', error);
    process.exit(1);
  }
};

/**
 * Graceful shutdown
 */
const shutdown = async () => {
  console.log('\n🛑 Shutting down worker...');
  isRunning = false;
  
  if (consumer) {
    await consumer.disconnect();
    console.log('✅ Kafka consumer disconnected');
  }
  
  process.exit(0);
};

// Handle shutdown signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start the worker
startWorker();

export default {
  startWorker,
  shutdown
};
