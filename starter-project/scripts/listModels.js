require('dotenv').config();
const axios = require('axios');

async function listModels() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    console.error('❌ GOOGLE_AI_API_KEY is not set in your .env file.');
    return;
  }

  try {
    console.log('🔍 Fetching available models for your API key...');
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    const models = response.data.models;
    if (!models || models.length === 0) {
      console.log('🤷 No models found for this API key.');
      return;
    }

    console.log('✅ Available Models that support "generateContent":');
    let foundSupportedModel = false;
    models.forEach(model => {
      const supportedMethods = model.supportedGenerationMethods;
      if (supportedMethods && supportedMethods.includes('generateContent')) {
        foundSupportedModel = true;
        console.log('---------------------------------');
        console.log(`  ✅ Usable Model Name: ${model.name}`);
        console.log(`     Display Name: ${model.displayName}`);
        console.log(`     Description: ${model.description ? model.description.substring(0, 100) : 'N/A'}...`);
      }
    });

    if (!foundSupportedModel) {
        console.log('\nCould not find any models that support "generateContent". Please check your Google AI project settings.');
    } else {
        console.log('---------------------------------');
        console.log('\n💡 Please copy one of the "Usable Model Name" values (e.g., models/gemini-pro) and set it in your .env file as GOOGLE_AI_MODEL.');
    }


  } catch (error) {
    console.error('❌ Error fetching models:', error.response?.data?.error || error.message);
  }
}

listModels();

