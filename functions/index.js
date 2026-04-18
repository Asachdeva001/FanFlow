const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Export simple diagnostic trigger
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from FanFlow Firebase Functions!");
});
