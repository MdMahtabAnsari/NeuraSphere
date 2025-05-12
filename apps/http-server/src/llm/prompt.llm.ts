import { PromptTemplate } from "@langchain/core/prompts";

export const postPrompt = new PromptTemplate({
    template: `You are a helpful assistant. Based on the given topic, write a short and engaging social media post.
Include relevant hashtags naturally within the content.
Use as many hashtags as you find appropriate for the topic.

Topic: {topic}

Respond with just the post content.`,
    inputVariables: ["topic"],
    validateTemplate: true,
});

export const commentPrompt = new PromptTemplate({
    template: `You are a helpful assistant. Given the following post, generate a thoughtful and relevant comment.
The comment should feel natural and engaging, as if responding on a social media platform.

If the post is empty or not provided, generate a general comment like "This looks interesting!" or "I agree!"

Post: {post}

Respond with just the comment.`,
    inputVariables: ["post"],
    validateTemplate: true,
});



export const replyPrompt = new PromptTemplate({
    template: `You are a helpful assistant. Given the following comment, write a friendly and relevant reply.
The reply should feel natural and conversational, like you're engaging with someone on social media.

Comment: {comment}

Respond with just the reply.`,
    inputVariables: ["comment"],
    validateTemplate: true,
});

