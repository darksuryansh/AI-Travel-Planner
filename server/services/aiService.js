import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


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

CRITICAL JSON RULES - FOLLOW EXACTLY:
1. Response must be PURE JSON ONLY - no markdown, no code blocks, no text before or after
2. NO triple backticks (\`\`\`) anywhere in response
3. All strings must use double quotes, properly escaped
4. NO trailing commas before closing brackets
5. All JSON must be valid and parseable
6. String values cannot contain unescaped newlines - use \\n instead
7. String values cannot contain unescaped quotes - use \\" instead

CONTENT RULES:
- Create realistic daily schedules (8 AM - 10 PM typical)
- Include specific venue names and locations when possible
- Balance activities with rest time
- Match activities to user's interests and budget
- Keep descriptions concise (1-2 sentences max per field)

OUTPUT SCHEMA (respond with valid JSON matching this structure):
{
  "title": "string (engaging trip title)",
  "destination": "string",
  "duration": "number (days)",
  "budget": "string",
  "overview": "string (2-3 sentence trip summary)",
  "bestTimeToVisit": "string",
  "destinationInfo": {
    "history": "string (brief 2-3 sentence historical overview)",
    "famousFor": ["array of things destination is known for"],
    "photoSpots": [
      {
        "name": "string (iconic photo location)",
        "description": "string (why it's Instagram-worthy)",
        "bestTime": "string (optimal photo timing)"
      }
    ],
    "culturalTips": ["array of cultural dos and don'ts"],
    "language": {
      "primary": "string",
      "commonPhrases": [
        {"phrase": "Hello", "local": "Bonjour"},
        {"phrase": "Thank you", "local": "Merci"}
      ]
    }
  },
  "travelInfo": {
    "howToReach": {
      "byFlight": {
        "airports": ["array of major airports"],
        "averageFlightTime": "string",
        "bestAirlines": ["array"]
      },
      "byTrain": "string (if applicable)",
      "byBus": "string (if applicable)",
      "byRoad": "string (if applicable)"
    },
    "localTransport": {
      "publicTransport": ["subway", "bus", "tram"],
      "taxiApps": ["Uber", "local apps"],
      "rentalOptions": ["car", "bike", "scooter"]
    },
    "currency": "string",
    "visaRequirements": "string (general info)"
  },
  "faqs": [
    {
      "question": "string",
      "answer": "string"
    }
  ],
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
      "theme": "string (day's focus like 'Arrival & Exploration')",
      "activities": [
        {
          "time": "string (HH:MM AM/PM)",
          "title": "string",
          "description": "string (1-2 sentences)",
          "location": "string (specific venue/address)",
          "category": "string (food/culture/adventure/relaxation/shopping/sightseeing)",
          "estimatedCost": "number (in USD)"
        }
      ]
    }
  ],
  "packingList": ["item1", "item2", "item3"]
}

IMPORTANT: Generate 4-7 activities per day including meals (breakfast/lunch/dinner as food category).
Match content to user interests and budget level.

Now generate the itinerary for:`,

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





// /**
//  * Parse natural language travel intent into structured JSON
//  */
// export const parseIntent = async (userInput) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    
//     const prompt = `${PROMPTS.INTENT_PARSER}\n\nUser Input: "${userInput}"`;
    
//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const text = response.text();
    
//     // Clean response - remove markdown code blocks if present
//     const cleanedText = text
//       .replace(/```json\n?/g, '')
//       .replace(/```\n?/g, '')
//       .trim();
    
//     const parsedIntent = JSON.parse(cleanedText);
    
//     return {
//       success: true,
//       data: parsedIntent
//     };
//   } catch (error) {
//     console.error('Intent parsing error:', error);
//     throw new Error(`Failed to parse intent: ${error.message}`);
//   }
// };





//  Generate detailed travel itinerary with Google Search Grounding

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

   
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 65536, // Supports itineraries up to 30 days with full details
        responseMimeType: "application/json", 
      },
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
    let text = response.text();
    
    console.log('🤖 Raw AI response length:', text.length);
    
    // Clean response - remove markdown code blocks and extra whitespace
    let cleanedText = text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();
    
    // Aggressive JSON cleaning
    // 1. Remove any trailing commas before closing brackets
    cleanedText = cleanedText.replace(/,(\s*[}\]])/g, '$1');
    
    // 2. Fix common escape issues in strings
    cleanedText = cleanedText.replace(/\\n/g, ' ');
    cleanedText = cleanedText.replace(/\n/g, ' ');
    
    // 3. Try to extract valid JSON if response has extra text
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }
    
    console.log('✅ Cleaned response length:', cleanedText.length);
    
    let itinerary;
    try {
      itinerary = JSON.parse(cleanedText);
      console.log('✅ JSON parsed successfully!');
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError.message);
      console.error('📝 First 500 chars:', cleanedText.substring(0, 500));
      console.error('📝 Last 500 chars:', cleanedText.substring(cleanedText.length - 500));
      
      // Try to fix the JSON by finding the error position
      const errorMatch = parseError.message.match(/position (\d+)/);
      if (errorMatch) {
        const errorPos = parseInt(errorMatch[1]);
        console.error('🔍 Error near:', cleanedText.substring(Math.max(0, errorPos - 100), Math.min(cleanedText.length, errorPos + 100)));
      }
      
      // Save the bad JSON to a file for debugging
      console.error('💾 Saving failed JSON to debug-failed-json.txt');
      await import('fs').then(fs => {
        fs.promises.writeFile('debug-failed-json.txt', cleanedText, 'utf8');
      });
      
      throw new Error(`AI returned invalid JSON: ${parseError.message}`);
    }
    
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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
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
  // parseIntent,
  generateItinerary,
  generateVibeEmbedding,
  enhanceItinerary,
  PROMPTS
};
