import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeImage = async (base64Image) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Gemini expects base64 without the 'data:image/jpeg;base64,' prefix
  const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

  const prompt = `Identify the single primary object in this image.
   Return ONLY a raw JSON object string with these literal keys:
   {
     "label": "Name of the object",
     "category": "One of: Electronic, Plastic, Paper, Glass, Metal, Organic, Other",
     "recyclable": boolean,
     "confidence": "percentage string"
   }`;

  const imagePart = {
    inlineData: {
      data: cleanBase64,
      mimeType: 'image/jpeg'
    }
  };

  try {
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response (Gemini sometimes includes markdown code blocks)
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error('Gemini Detection Error:', err);
    throw new Error('Failed to analyze image with AI');
  }
};
