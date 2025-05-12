import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tavily } from "./tool.llm";
import { groq,mistral } from './model.llm';

export const agent = createReactAgent({
    llm: mistral,
    tools: [tavily]
});