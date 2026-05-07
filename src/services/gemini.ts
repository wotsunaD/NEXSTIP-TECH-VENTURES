import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const geminiService = {
  async findNearbyTrainers(userLocation: string, trainers: any[]) {
    const prompt = `Given the user's location "${userLocation}" and the following list of trainers/technicians: ${JSON.stringify(trainers)}, 
    recommend the best matches based on proximity and specialty. Return the results in a friendly, helpful tone.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    return response.text;
  },

  async summarizeOpportunities(opportunities: any[]) {
    const prompt = `Summarize the following career opportunities in Africa for a young digital skills learner: ${JSON.stringify(opportunities)}. 
    Highlight the most urgent deadlines and the most prestigious offers.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    return response.text;
  },

  async searchOpportunities(query: string, opportunities: any[]) {
    const prompt = `A user is looking for opportunities with the following interest: "${query}". 
    Based on this list of opportunities: ${JSON.stringify(opportunities)}, 
    identify which ones match their interest best. 
    If there are matches, explain why they are relevant. 
    If there are no direct matches, suggest the closest alternatives or give general advice on how to find what they are looking for.
    Keep the response concise and encouraging.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    return response.text;
  },

  async getForumAdvice(question: string) {
    const prompt = `You are an expert IT mentor on the NEXSTiP forum. A user asks: "${question}". 
    Provide a concise, encouraging, and technically sound answer.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    return response.text;
  }
};
