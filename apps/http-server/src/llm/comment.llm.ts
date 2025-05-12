import { commentChain,replyChain } from "./chain.llm";

import { InternalServerError } from "../utils/errors";

class CommentLLM {
    async createCommentSuggestion(post: string|null) {
        try {
            return await commentChain.invoke({
                post: post ? post : "",
            });
        } catch (error) {
            console.error("Error creating comment suggestion:", error);
            throw new InternalServerError("Failed to create comment suggestion");
        }
    }

    async createReplySuggestion(comment: string) {
        try {
            return await replyChain.invoke({
                comment: comment,
            });
        } catch (error) {
            console.error("Error creating reply suggestion:", error);
            throw new InternalServerError("Failed to create reply suggestion");
        }
    }
}

export const commentLLM = new CommentLLM();