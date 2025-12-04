import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key is missing. Gemini features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMonthlyAnalysis = async (
  transactions: Transaction[],
  monthName: string
): Promise<string> => {
  const client = getClient();
  if (!client) return "API Key not configured.";

  const expenses = transactions.filter(t => t.type === 'expense');
  const income = transactions.filter(t => t.type === 'income');
  
  if (expenses.length === 0 && income.length === 0) {
    return "No transactions found for this period to analyze.";
  }

  // Simplify data for the prompt to save tokens
  const simplifiedData = transactions.map(t => ({
    date: t.date.split('T')[0],
    type: t.type,
    category: t.category,
    amount: t.amount,
    note: t.note
  }));

  const prompt = `
    You are a helpful financial assistant. Analyze the following financial transactions for ${monthName}.
    
    Data:
    ${JSON.stringify(simplifiedData, null, 2)}

    Please provide a concise response in Markdown format including:
    1. **Summary**: A brief overview of spending vs income.
    2. **Key Insights**: Identify the largest spending categories or unusual patterns.
    3. **Recommendations**: 3 specific, actionable tips to save money based on these specific habits.
    4. **Tone**: Encouraging and professional.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error analyzing your data. Please try again later.";
  }
};