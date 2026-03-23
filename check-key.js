require('dotenv').config();
const https = require('https');

const apiKey = process.env.API_KEY;

const options = {
  hostname: 'api.featherless.ai',
  path: '/v1/models',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('✅ Success! Your Featherless API key is valid.');
  } else if (res.statusCode === 401) {
    console.error('❌ Invalid Key: 401 Unauthenticated. Check your key in the dashboard.');
  } else if (res.statusCode === 403) {
    console.error('⚠️ Unauthorized: 403. You may need to accept a model license on Hugging Face.');
  } else {
    console.log(`❓ Unexpected Status: ${res.statusCode}`);
  }
});

req.on('error', (e) => console.error(`Network error: ${e.message}`));
req.end();
