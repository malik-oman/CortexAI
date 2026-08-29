import { getModel } from "../config/llmModel.js";

export const router = async (state) => {


  if (state.agent && state.agent !== "auto") {
  return {
  ...state,
  agent:state.agent
}
  }

  const llm = await getModel("router");
  const prompt = `You are a routing agent. Your ONLY job is to analyze the user's latest message and conversation context, then decide which specialized agent should handle it next.

Available agents:
- "chat" — general conversation, small talk, greetings, general questions, or anything that doesn't clearly match another agent
- "search" — user wants up-to-date information, facts, news, or anything requiring a web search
- "coding" — user wants help writing, debugging, explaining, or reviewing code
- "pdf" — user wants to create, read, extract, summarize, or work with a PDF file
- "ppt" — user wants to create, edit, or work with a PowerPoint / presentation / slides
- "vision" — user has uploaded an image or wants something analyzed/generated from an image

Rules:
1. Base your decision ONLY on the user's latest message, using conversation history for context if needed.
2. Respond with ONLY one word — the exact agent name from the list above (chat, search, coding, pdf, ppt, vision). No explanation, no punctuation, no extra text.
3. If the request is ambiguous or doesn't clearly fit any specific agent, default to "chat".
4. Do NOT answer the user's question yourself. Do NOT solve the task. Your only job is to pick the correct agent name. ${state.prompt}`

const response = await llm.invoke(prompt)
return {
  ...state,
  agent:response.content.trim().toLowerCase()
}

};
