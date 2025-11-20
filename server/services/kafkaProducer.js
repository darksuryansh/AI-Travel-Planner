import { createProducer, TOPICS } from '../config/kafka.js';

let producer = null;

/**
 * Initialize Kafka Producer
 */
export const initializeProducer = async () => {
  try {
    producer = await createProducer();
    return producer;
  } catch (error) {
    console.error('Failed to initialize Kafka producer:', error);
    throw error;
  }
};

/**
 * Send price watch request to Kafka
 */
export const sendPriceWatchRequest = async (watchData) => {
  try {
    if (!producer) {
      await initializeProducer();
    }

    const message = {
      key: watchData.tripId,
      value: JSON.stringify({
        ...watchData,
        timestamp: new Date().toISOString(),
        status: 'pending'
      }),
      headers: {
        'event-type': 'price-watch-request',
        'version': '1.0'
      }
    };

    await producer.send({
      topic: TOPICS.FLIGHT_WATCH_REQUESTS,
      messages: [message]
    });

    console.log(`📤 Price watch request sent for trip: ${watchData.tripId}`);
    
    return {
      success: true,
      message: 'Price watch request queued',
      tripId: watchData.tripId
    };
  } catch (error) {
    console.error('Kafka send error:', error);
    throw new Error(`Failed to queue price watch: ${error.message}`);
  }
};

/**
 * Send itinerary update notification
 */
export const sendItineraryUpdate = async (updateData) => {
  try {
    if (!producer) {
      await initializeProducer();
    }

    const message = {
      key: updateData.itineraryId,
      value: JSON.stringify({
        ...updateData,
        timestamp: new Date().toISOString()
      })
    };

    await producer.send({
      topic: TOPICS.ITINERARY_UPDATES,
      messages: [message]
    });

    console.log(`📤 Itinerary update sent: ${updateData.itineraryId}`);
    
    return { success: true };
  } catch (error) {
    console.error('Kafka update send error:', error);
    // Don't throw - this is non-critical
    return { success: false, error: error.message };
  }
};

/**
 * Gracefully disconnect producer
 */
export const disconnectProducer = async () => {
  try {
    if (producer) {
      await producer.disconnect();
      console.log('✅ Kafka producer disconnected');
    }
  } catch (error) {
    console.error('Producer disconnect error:', error);
  }
};

export default {
  initializeProducer,
  sendPriceWatchRequest,
  sendItineraryUpdate,
  disconnectProducer
};
