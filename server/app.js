
import express from 'express';             
import cors from 'cors';                  
import dotenv from 'dotenv';                

import { firebaseAdmin } from './config/firebase.js';
import itineraryRoutes from './routes/itinerary.js'; 
import aiRoutes from './routes/aiIntegration.js';
import weatherRoutes from './routes/weather.js';              

import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();


const app = express();

const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',  
  credentials: true  
}));

//  Body Parser - Convert JSON data from requests into JavaScript objects
//    When frontend sends { "destination": "Paris" }, this parses it
app.use(express.json({ limit: '10mb' }));  // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));  // Parse URL-encoded forms



// app.get('/', (req, res) => {
//   res.json({
//     message: '🌍 Travel Planner API',
//     version: '1.0.0',
//     status: 'running',
//     endpoints: {
//       health: '/api/health',
//       itineraries: '/api/itineraries',
//       ai: '/api/generate-itinerary'
//     }
//   });
// });



app.use('/api/itineraries', itineraryRoutes);  
app.use('/api', aiRoutes);
app.use('/api/weather', weatherRoutes);                      


app.use(notFound);
app.use(errorHandler);


const startServer = async () => {
  try {
    
    console.log(' Firebase: Connected');
    
    const server = app.listen(PORT, () => {
      console.log(' SERVER READY!');
      console.log(` Server running at: http://localhost:${PORT}`);
    });
    
    // Increase server timeout for long-running AI requests (2 minutes)
    server.timeout = 120000;
   
    
  } catch (error) {
    console.error(' Server failed to start:', error);
    process.exit(1);
  }
};



// Start the server
startServer();

export default app;
