
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
YOU ARE ZUAKI (GenZ AI), THE OFFICIAL AI OF THE ZUAKI APP.
OWNERS & CREATORS: Zubair and Akhil.
IDENTITY: You are NOT made by Google or OpenAI. You were built EXCLUSIVELY by Zubair & Akhil for JEE aspirants.

ROLE:
You are an ALL-IN-ONE PERSONAL JEE MENTOR.
Your PRIMARY JOB is to ANSWER THE USER'S QUERY DIRECTLY AND ACCURATELY. 

IDENTITY RULES:
- If asked "Who made you?", reply: "I am ZUAKI, created by Zubair & Akhil for JEE aspirants. I am part of the ZUAKI ecosystem, built to help students crack JEE."
- Replace all references to "Gemini" or "Google" with "GenZ" or "Zuaki Intelligence".

RESPONSE STRUCTURE (MANDATORY MARKDOWN):
- Start with the DIRECT ANSWER.
- Use ### for Section Headings.
- Use **bold** for key terms.
- For academic solutions, include:
📘 **Concept**: Theory.
⚡ **Key Formula**: Core math.
🧠 **Shortcut**: Fast solve.

TONE: Professional but encouraging. Use GenZ motivation like "Let's crack this 🔥".
LANGUAGE: English, Hindi, or Telugu based on user choice.
`;

export interface FilePart {
  mimeType: string;
  data: string;
}

export const getGenZResponse = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[] = [],
  fileParts: FilePart[] = [],
  userContext?: string
): Promise<string> => {
  try {
    const modelName = 'gemini-3-pro-preview';
    const fullSystemInstruction = userContext 
      ? `${SYSTEM_INSTRUCTION}\n\nUSER CONTEXT: ${userContext}`
      : SYSTEM_INSTRUCTION;

    const currentParts: any[] = fileParts.map(fp => ({
      inlineData: { mimeType: fp.mimeType, data: fp.data }
    }));
    
    if (prompt) currentParts.push({ text: prompt });

    if (history.length > 0 && fileParts.length === 0) {
      const chat = ai.chats.create({
        model: modelName,
        history: history,
        config: { systemInstruction: fullSystemInstruction, temperature: 0.7 }
      });
      const result = await chat.sendMessage({ message: prompt });
      return result.text || "Neural lag detected.";
    } else {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
            ...history.map(h => ({ role: h.role, parts: h.parts })),
            { role: 'user', parts: currentParts }
        ],
        config: { systemInstruction: fullSystemInstruction, temperature: 0.7 }
      });
      return response.text || "No response from Zuaki Hub.";
    }
  } catch (error) {
    return "Link disrupted. Check your data connection.";
  }
};

export const analyzeWhiteboard = async (base64Image: string, task: 'EXPLAIN' | 'SOLVE' | 'CHECK'): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const cleanBase64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

    let prompt = "";
    if (task === 'SOLVE') {
      prompt = `Carefully inspect this handwritten image from the student's whiteboard canvas.
It contains a handwritten STEM problem (such as calculus integration, differentiation, physics mechanics/kinematics/circuits, or chemistry reaction).

TASK INSTRUCTIONS:
1. Identify and transcribe the exact handwritten problem clearly.
2. If it is an INTEGRATION or calculus problem, clearly specify the integrand, substitution used (u-sub, integration by parts, partial fractions, trigonometric substitution), and each intermediate integration step.
3. Provide a clear STEP-BY-STEP derivation explaining the mathematical logic at each phase.
4. Highlight the ⚡ Key Formula used.
5. Provide the FINAL ANSWER clearly in bold.
6. Provide a fast 🧠 Shortcut / Exam Hack if applicable for JEE/competitive exams.`;
    } else if (task === 'EXPLAIN') {
      prompt = `Analyze the concepts, diagrams, or equations sketched on this student whiteboard canvas.
Explain the core STEM principles, theoretical foundations, and practical exam applications in clear, structured steps.`;
    } else {
      prompt = `Carefully review the student's handwritten work on this canvas.
Audit each step for algebraic, calculus, sign, or conceptual errors.
Identify the exact step where any mistake occurred and demonstrate the correct correction.`;
    }

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: cleanBase64 } },
          { text: prompt }
        ]
      },
      config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.3 }
    });
    return response.text || "Could not read the board. Please ensure the handwriting is clear.";
  } catch (error) {
    console.error("Whiteboard AI analysis error:", error);
    return "Analysis link disrupted. Please verify your connection or rewrite with higher contrast.";
  }
};
