import { groq,mistral } from "./model.llm"
import { contentObj as postContent } from "@workspace/schema/post"
import { contentObj as commentContent } from "@workspace/schema/comment"
import { HumanMessage } from "@langchain/core/messages";
import { RunnableLambda } from "@langchain/core/runnables";

import { postPrompt, commentPrompt, replyPrompt } from "./prompt.llm"
import { agent } from "./agent.llm";


const postOutput = postPrompt.pipe(mistral.withStructuredOutput(postContent));
export const commentChain = commentPrompt.pipe(mistral.withStructuredOutput(commentContent));
export const replyChain = replyPrompt.pipe(mistral.withStructuredOutput(commentContent));

export const postChain = RunnableLambda.from(async ({ topic }: { topic: string }, config) => {
    const humanMessage = new HumanMessage(topic);
    const response = await agent.invoke({ messages: [humanMessage] }, config)
    return await postOutput.invoke({
        topic: [humanMessage, response],
    })

});
