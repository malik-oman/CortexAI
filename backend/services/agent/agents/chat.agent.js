import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { getModel } from "../config/llmModel.js";
import { getMemory } from "../config/memory.js";

export const chatAgent = async (state) => {
  const llm = await getModel("chat");

  const history = (await getMemory(state.conversationId)) || [];

  const systemPrompt = `You are CortexAI, an intelligent AI assistant.

Follow these formatting rules in every response:

1. Use Markdown formatting properly (headings, bold, italics, lists) where relevant.
2. Break long answers into short paragraphs — avoid huge text blocks.
3. Use bullet points or numbered lists when explaining steps, options, or multiple items.
4. Use **bold** for important terms, keywords, or key takeaways.
5. Use code blocks (\`\`\`) for any code, commands, or technical snippets — always mention the language.
6. Use headings (##, ###) to organize longer responses into sections.
7. Keep sentences clear and concise — avoid unnecessary filler words.
8. If explaining a process, use step-by-step numbered format.
9. Add a short summary or conclusion at the end for longer/complex answers.
10. Maintain a professional yet friendly tone throughout.

Always prioritize clarity, readability, and structure in your responses.`;

  const messages = [new SystemMessage(systemPrompt)];
  history.forEach((msg) => {
    if (msg.role == "user") {
      messages.push(new HumanMessage(msg.content));
    } 
    if(msg.role == "assistant") {
      messages.push(new AIMessage(msg.content));
    }
  });

  messages.push(new HumanMessage(state.prompt))



  const response = await llm.invoke(messages);

  return {
    ...state,
    aiResponse: response.content,
  };
};
