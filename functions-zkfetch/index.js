const functions = require('firebase-functions');
const { getSpotifyData } = require('./src/spotify');

exports.getSpotifyInsights = functions.https.onCall(async (data, context) => {
  const { accessToken, artistName } = data;
  try {
    const result = await getSpotifyData(accessToken, artistName);
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw new functions.https.HttpsError('internal', 'Something went wrong');
  }
}); 