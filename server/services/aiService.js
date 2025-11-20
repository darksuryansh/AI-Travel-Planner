import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * System Prompts for different AI tasks
 */
export const PROMPTS = {
  INTENT_PARSER: `You are an expert travel intent parser. Your task is to extract structured information from natural language travel requests.

CRITICAL RULES:
1. ALWAYS respond with ONLY valid JSON - no markdown, no code blocks, no explanation text
2. Extract all relevant information from the user's input
3. Use intelligent defaults if information is missing
4. Infer interests from context clues

OUTPUT FORMAT (JSON only):
{
  "destination": "string (city, country, or region)",
  "duration": "number (days, default to 7 if not specified)",
  "budget": "string (economy/moderate/luxury, default to moderate)",
  "interests": ["array", "of", "strings"],
  "travelStyle": "string (relaxed/moderate/packed, default to moderate)",
  "accommodation": "string (hostel/hotel/resort/airbnb, default to hotel)",
  "startDate": "string (YYYY-MM-DD format or null if not specified)"
}

EXAMPLES:
Input: "Trip to Italy, good wine, 5 days"
Output: {"destination":"Italy","duration":5,"budget":"moderate","interests":["wine","food","culture"],"travelStyle":"moderate","accommodation":"hotel","startDate":null}

Input: "Budget backpacking through Thailand for 2 weeks, love beaches and temples"
Output: {"destination":"Thailand","duration":14,"budget":"economy","interests":["beaches","temples","backpacking","culture"],"travelStyle":"moderate","accommodation":"hostel","startDate":null}

Now parse the following travel request:`,

  ITINERARY_GENERATOR: `You are an elite travel concierge AI specializing in creating detailed, realistic, and personalized travel itineraries.

CRITICAL RULES:
1. ALWAYS respond with ONLY valid JSON - no markdown, no code blocks, no explanation text
2. Use Google Search Grounding for real, current information about places
3. Create realistic daily schedules (8 AM - 10 PM typical)
4. Include specific venue names, addresses when possible
5. Balance activities with rest time
6. Consider travel time between locations
7. Match activities to user's interests and budget

OUTPUT SCHEMA (JSON only):
{
  "title": "string (engaging trip title)",
  "destination": "string",
  "duration": "number (days)",
  "budget": "string",
  "overview": "string (2-3 sentence trip summary)",
  "bestTimeToVisit": "string",
  "estimatedCost": {
    "min": "number (USD)",
    "max": "number (USD)",
    "breakdown": {
      "accommodation": "number",
      "food": "number",
      "activities": "number",
      "transport": "number"
    }
  },
  "days": [
    {
      "day": "number",
      "date": "string (if startDate provided, else Day 1, Day 2...)",
      "theme": "string (day's focus)",
      "activities": [
        {
          "time": "string (HH:MM AM/PM)",
          "title": "string",
          "description": "string (detailed, 2-3 sentences)",
          "location": "string (specific venue/address)",
          "duration": "string (e.g., 2 hours)",
          "cost": "string (e.g., $20-30 or Free)",
          "tips": "string (insider advice)",
          "category": "string (food/culture/adventure/relaxation/transport)"
        }
      ],
      "meals": {
        "breakfast": "string (recommendation with location)",
        "lunch": "string",
        "dinner": "string"
      }
    }
  ],
  "packingList": ["array", "of", "essential", "items"],
  "localTips": ["array", "of", "helpful", "local", "advice"],
  "emergencyInfo": {
    "embassy": "string",
    "emergencyNumber": "string",
    "hospitals": ["array"]
  }
}

QUALITY STANDARDS:
- Each day should have 4-6 activities minimum
- Include breakfast, lunch, dinner recommendations
- Provide specific venue names (restaurants, museums, beaches)
- Add practical tips (best time to visit, how to get there)
- Consider user's travel style (relaxed = fewer activities, packed = more)
- Budget awareness (economy = free/cheap, luxury = premium experiences)

Now generate an itinerary based on these parameters:`,

  VIBE_SEARCH_EMBEDDER: `You are creating a semantic summary of a travel itinerary for vector search.

Create a rich, descriptive paragraph (100-150 words) that captures:
- The destination's vibe and atmosphere
- Key experiences and activities
- Travel style and pace
- Cultural elements
- Target traveler type

This will be converted to embeddings for "vibe-based" semantic search.
Be evocative and descriptive. Focus on feelings and experiences.

Respond with ONLY the paragraph, no JSON, no formatting.`
};

/**
 * Parse natural language travel intent into structured JSON
 */
export const parseIntent = async (userInput) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `${PROMPTS.INTENT_PARSER}\n\nUser Input: "${userInput}"`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Clean response - remove markdown code blocks if present
    const cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const parsedIntent = JSON.parse(cleanedText);
    
    return {
      success: true,
      data: parsedIntent
    };
  } catch (error) {
    console.error('Intent parsing error:', error);
    throw new Error(`Failed to parse intent: ${error.message}`);
  }
};

/**
 * Generate detailed travel itinerary with Google Search Grounding
 */
export const generateItinerary = async (params) => {
  try {
    const {
      destination,
      duration,
      budget,
      interests,
      travelStyle = 'moderate',
      accommodation = 'hotel',
      startDate = null
    } = params;

    // Use Gemini with Google Search Grounding
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      tools: [{ googleSearchRetrieval: {} }] // Enable Google Search Grounding
    });
    
    const userParams = JSON.stringify({
      destination,
      duration,
      budget,
      interests,
      travelStyle,
      accommodation,
      startDate
    }, null, 2);
    
    const prompt = `${PROMPTS.ITINERARY_GENERATOR}\n\n${userParams}`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Clean response
    const cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const itinerary = JSON.parse(cleanedText);
    
    // Add metadata
    itinerary.generatedAt = new Date().toISOString();
    itinerary.version = '1.0';
    
    return {
      success: true,
      data: itinerary
    };
  } catch (error) {
    console.error('Itinerary generation error:', error);
    throw new Error(`Failed to generate itinerary: ${error.message}`);
  }
};

/**
 * Generate embeddings description for vibe search (stub for vector DB)
 */
export const generateVibeEmbedding = async (itinerary) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const itineraryContext = JSON.stringify({
      title: itinerary.title,
      destination: itinerary.destination,
      overview: itinerary.overview,
      interests: itinerary.days?.slice(0, 2).map(d => d.theme) || []
    });
    
    const prompt = `${PROMPTS.VIBE_SEARCH_EMBEDDER}\n\nItinerary Context: ${itineraryContext}`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const vibeDescription = response.text().trim();
    
    // In production, you would:
    // 1. Use Gemini embedding model or another embedding service
    // 2. Convert vibeDescription to actual vector embeddings
    // 3. Store in vector database (Pinecone, Weaviate, etc.)
    
    return {
      success: true,
      data: {
        description: vibeDescription,
        // Placeholder for actual embeddings
        embeddings: null,
        note: 'Vector embeddings would be generated here for semantic search'
      }
    };
  } catch (error) {
    console.error('Vibe embedding generation error:', error);
    throw new Error(`Failed to generate vibe embedding: ${error.message}`);
  }
};

/**
 * Enhance itinerary with AI suggestions
 */
export const enhanceItinerary = async (itineraryId, userFeedback) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `You are enhancing a travel itinerary based on user feedback.
    
User Feedback: "${userFeedback}"

Provide 3-5 specific, actionable suggestions to improve the itinerary.
Respond with ONLY valid JSON in this format:
{
  "suggestions": [
    {
      "type": "string (add/replace/remove/adjust)",
      "day": "number (which day to modify)",
      "description": "string (what to change and why)"
    }
  ]
}`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const suggestions = JSON.parse(text);
    
    return {
      success: true,
      data: suggestions
    };
  } catch (error) {
    console.error('Enhancement error:', error);
    throw new Error(`Failed to enhance itinerary: ${error.message}`);
  }
};

export default {
  parseIntent,
  generateItinerary,
  generateVibeEmbedding,
  enhanceItinerary,
  PROMPTS
};
