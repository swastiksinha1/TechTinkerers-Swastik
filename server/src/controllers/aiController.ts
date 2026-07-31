import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface SmartComplaintAnalysis {
  title: string;
  department: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  analysis: string;
}

export const analyzeComplaint = async (text: string, imageBase64?: string): Promise<SmartComplaintAnalysis> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing from environment variables');
  }

  const promptText = `
    You are an intelligent triage assistant for a university campus maintenance system.
    Analyze the following user complaint and extract the core issue.
    If an image is provided, inspect the image to determine the severity and department.
    Categorize the department it belongs to (e.g., Plumbing, Electrical, IT, Carpentry, Cleaning, General).
    Assign a priority (LOW, MEDIUM, HIGH, CRITICAL) based on the severity. Sparking wires, massive leaks, or security issues are CRITICAL.
    Create a concise, professional title for the ticket.
    Provide a brief 1-2 sentence analysis explaining your reasoning.

    Complaint: "${text}"
  `;

  // Construct the contents array for multimodal request
  const contents: any[] = [promptText];

  if (imageBase64) {
    // Determine mime type from base64 string prefix if present, else default to jpeg
    let mimeType = 'image/jpeg';
    let base64Data = imageBase64;
    
    if (imageBase64.startsWith('data:image/')) {
      const parts = imageBase64.split(';');
      mimeType = parts[0].split(':')[1];
      base64Data = parts[1].split(',')[1];
    }

    contents.push({
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A concise professional title for the ticket" },
            department: { type: Type.STRING, description: "The department responsible for fixing this" },
            priority: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
            analysis: { type: Type.STRING, description: "1-2 sentence reasoning for categorization" },
          },
          required: ["title", "department", "priority", "analysis"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('No text returned from Gemini');
    }

    const parsed = JSON.parse(resultText) as SmartComplaintAnalysis;
    return parsed;
  } catch (error) {
    console.error('Error analyzing complaint with AI:', error);
    throw new Error('Failed to analyze complaint');
  }
};
