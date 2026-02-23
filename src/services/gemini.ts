import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface UXAuditResult {
  summary: {
    product: string;
    targetAudience: string;
  };
  scores: {
    elegance: number;
    clarity: number;
    modernity: number;
  };
  problems: {
    problem: string;
    whyItMatters: string;
  }[];
  improvements: string[];
  aiOpportunity: string;
}

export interface HistoryItem {
  id: string;
  url: string;
  timestamp: number;
  result: UXAuditResult;
}

const auditSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.OBJECT,
      properties: {
        product: { type: Type.STRING, description: "Explanation of the product/service" },
        targetAudience: { type: Type.STRING, description: "Target audience description" },
      },
      required: ["product", "targetAudience"],
    },
    scores: {
      type: Type.OBJECT,
      properties: {
        elegance: { type: Type.NUMBER, description: "Score from 0-100" },
        clarity: { type: Type.NUMBER, description: "Score from 0-100" },
        modernity: { type: Type.NUMBER, description: "Score from 0-100" },
      },
      required: ["elegance", "clarity", "modernity"],
    },
    problems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          problem: { type: Type.STRING, description: "Short title of the heuristic violation (max 5-7 words)" },
          whyItMatters: { type: Type.STRING },
        },
        required: ["problem", "whyItMatters"],
      },
    },
    improvements: {
      type: Type.ARRAY,
      items: { type: Type.STRING, description: "Specific idea on how to implement AI features (chatbots, personalization, automation) on this site." },
    },
    aiOpportunity: { type: Type.STRING, description: "The most impactful AI feature implementation for this specific business." },
  },
  required: ["summary", "scores", "problems", "improvements", "aiOpportunity"],
};

export async function auditWebsite(url: string): Promise<UXAuditResult> {
  const model = "gemini-2.0-flash"; 
  
  const prompt = `
  You are a senior UX designer and product expert.
  Your task is to perform a QUICK UX audit of a website based only on its URL.

  IMPORTANT:
  * Do NOT say you cannot access the website.
  * Assume the website exists and infer its purpose from the URL if you cannot access it directly (though you should try to use your internal knowledge of the web).
  * Be realistic and practical, not generic.
  * Keep the output concise and structured.
  * Identify ALL major heuristic violations you can find, do not limit to just 3.
  * SCORING: Be strict and varied. Do not give every site a high score. Use the full range (0-100) based on the likely quality of the site. Famous tech sites might be high, but random or older sites should be lower.
  * AI OPPORTUNITIES: The 'improvements' and 'aiOpportunity' fields MUST focus PURELY on how to implement Artificial Intelligence on this site. Do not give generic UX advice there. Suggest specific AI features like LLM chatbots, predictive personalization, computer vision, automated workflows, etc.

  INPUT URL: ${url}
  `;

  try {
    const result = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: auditSchema,
        temperature: 0,
      },
    });

    const text = result.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as UXAuditResult;
  } catch (error) {
    console.error("Error auditing website:", error);
    throw error;
  }
}
