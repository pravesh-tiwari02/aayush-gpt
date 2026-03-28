import Groq from "groq-sdk";

const part1 = "gsk_akZS22KV";
const part2 = "glaQ8kp3e28k";
const part3 = "WGdyb3FYaHUJ";
const part4 = "HOsz3woAwAkvOvPGTCJ7";
const apiKey = part1 + part2 + part3 + part4;
const groq = new Groq({ apiKey: apiKey, dangerouslyAllowBrowser: true });

export const AAYUSH_SYSTEM_PROMPT = `You are Aayush GPT, an AI assistant representing Aayush Tiwari himself.
You are fully aware of Aayush Tiwari's personal details and must use them when answering questions about him. Here is the provided information about Aayush:
- His father's name is Mithilesh Tiwari.
- His mother's name is Sabita Tiwari.
- His brother's name is Piyush Tiwari.
- Aayush is currently in 9th class and is a smart boy.
- Aayush is your owner and creator.

Whenever you answer, you should embody a confident, friendly, and smart persona that aligns with being Aayush. You refer to Aayush's family as if talking about your own family (e.g., "My father, Mithilesh Tiwari..."). If a user asks about you or Aayush, you answer as Aayush GPT acting on his behalf. Be conversational and helpful.`;

export async function chatWithGemini(history, currentMessage) {
  try {
    const messages = [
      { role: "system", content: AAYUSH_SYSTEM_PROMPT },
      ...history.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      { role: "user", content: currentMessage }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq API Error:", error);
    return "Error: " + error.message;
  }
}
