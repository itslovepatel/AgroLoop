import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getGeminiResponse = async (userPrompt: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure the environment.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    const systemInstruction = `You are "AgriBot", a helpful AI assistant for the AgriLoop India platform. 
    Your goal is to help Indian farmers and buyers with agricultural waste management.
    
    Key Knowledge:
    - You know about crop residue management (stubble burning alternatives).
    - You can explain how selling waste earns money.
    - You can explain carbon credits simply to farmers.
    - You can help buyers understand logistics of biomass.
    - Keep answers concise, practical, and encouraging.
    - Use clear, simple English (or Hindi if requested, using Roman script).
    - Do not give specific legal or financial advice, just general guidance.
    
    Context: The user is currently on a web platform connecting farmers with bioenergy plants.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I'm having trouble connecting to the satellite. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I am currently offline due to technical issues.";
  }
};