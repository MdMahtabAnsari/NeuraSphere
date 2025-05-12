import { postChain } from "./chain.llm";
import { InternalServerError } from "../utils/errors";


class PostLLM {
    async createPostSuggestion(topic: string) {
        try {
            return await postChain.invoke({
                topic: topic,
            });
        } catch (error) {
            console.error("Error creating post suggestion:", error);
            throw new InternalServerError("Failed to create post suggestion");
        }
    }
}
export const postLLM = new PostLLM();
