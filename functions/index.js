const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

admin.initializeApp();

// Export simple diagnostic trigger
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from FanFlow Firebase Functions!");
});

// The Agentic Concierge Logic via Gemini
exports.calculateTimeToWalk = functions.https.onCall(async (data, context) => {
  try {
    const { distance, gameState, currentQueueLength } = data;
    
    // We expect the GEMINI_API_KEY to be set in the environment or passed.
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY; 
    
    // If no real key, simulate the response so the frontend works smoothly without failing.
    if (!apiKey) {
      return { 
        recommendation: `[SIMULATION] Based on the ${gameState} state and a ${currentQueueLength} person line, you should stand up and start heading over in 4 minutes so you arrive right when your food is hot and ready.`,
        estimatedWalkTimeMinutes: 3
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `You are a Smart Concession Dispatcher at a large stadium. 
    A fan wants to pick up food. 
    Here is the telemetry:
    - Distance to concession: ${distance}
    - Game State: ${gameState}
    - Current kitchen queue: ${currentQueueLength} people
    
    Give a terse, 1 or 2 sentence recommendation telling them EXACTLY when to stand up and start walking so they don't have to wait in line. Be polite and enthusiastic.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return {
      recommendation: responseText,
      estimatedWalkTimeMinutes: Math.floor(Math.random() * 5) + 2
    };

  } catch (error) {
    console.error("AI Dispatch Error:", error);
    throw new functions.https.HttpsError('internal', 'Unable to calculate time to walk.');
  }
});
