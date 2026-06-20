import OpenAI from 'openai';

let openaiClient;

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined in environment variables');
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return openaiClient;
};

const formatPreferences = (preferences = []) => {
  if (Array.isArray(preferences)) {
    return preferences.length ? preferences.join(', ') : 'No specific preferences provided';
  }

  return preferences || 'No specific preferences provided';
};

export const generateItinerary = async (trip) => {
  const prompt = `Create a practical trip itinerary with daily activities, travel tips, food suggestions, and budget-conscious recommendations.

Trip details:
- Traveler name: ${trip.name}
- Email: ${trip.email}
- Source: ${trip.source}
- Destination: ${trip.destination}
- Start date: ${new Date(trip.startDate).toISOString().split('T')[0]}
- End date: ${new Date(trip.endDate).toISOString().split('T')[0]}
- Budget: ${trip.budget}
- Travelers: ${trip.travelers}
- Travel type: ${trip.travelType}
- Preferences: ${formatPreferences(trip.preferences)}

Return the itinerary in clear markdown with sections for overview, day-by-day plan, estimated budget split, packing tips, and local travel advice.`;

  const response = await getOpenAIClient().chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert travel planner that creates clear, realistic, and helpful itineraries.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  return response.choices?.[0]?.message?.content?.trim() || '';
};