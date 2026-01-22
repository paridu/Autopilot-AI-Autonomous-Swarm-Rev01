
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateIdeation(marketContext: string, treasury: number, risk: number) {
    const riskLevel = risk > 0.7 ? "Aggressive/Moonshot" : risk > 0.3 ? "Moderate/Scaling" : "Conservative/Lean";
    const budgetContext = treasury > 100000 ? "High Liquidity (Invest heavily)" : treasury > 20000 ? "Stable (Moderate investment)" : "Low Capital (Bootstrap/Lean focus)";

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an AI Venture Capitalist managing an autonomous swarm. 
      CURRENT FINANCIAL PROFILE:
      - Treasury: $${treasury.toFixed(2)}
      - Risk Tolerance: ${risk.toFixed(2)} (${riskLevel})
      - Budget Context: ${budgetContext}

      Market Context: ${marketContext}. 

      Propose 3 new high-potential autonomous business goals that are strategically aligned with this profile. 
      If treasury is low, focus on high-margin, low-overhead software automation. 
      If treasury is high and risk is high, propose ambitious, capital-intensive vertical integrations or experimental AI ventures.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              goal: { type: Type.STRING, description: "Short, punchy business goal name" },
              vision: { type: Type.STRING, description: "1-sentence strategic vision" },
              mutation: { type: Type.STRING, description: "The strategic reason this was chosen based on current capital/risk" }
            },
            required: ["goal", "vision", "mutation"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  }

  async evolveBusiness(parentGoal: string, metrics: any) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Evolution Strategist AI. Parent Goal: ${parentGoal}. Metrics: ${JSON.stringify(metrics)}. Generate 2 mutated vertical expansions.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              goal: { type: Type.STRING },
              vision: { type: Type.STRING },
              mutation: { type: Type.STRING }
            },
            required: ["goal", "vision", "mutation"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  }

  async getAgentPerspective(role: string, goal: string, context: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Role: ${role}. Goal: ${goal}. Context: ${context}. Provide a 1-sentence specific action or insight you are taking now.`,
    });
    return response.text.trim();
  }
}

export const gemini = new GeminiService();
