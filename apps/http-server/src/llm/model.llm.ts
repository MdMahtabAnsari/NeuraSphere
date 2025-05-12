import { ChatGroq } from "@langchain/groq";
import { ChatMistralAI } from "@langchain/mistralai";
import serverConfig from "../configs/server.config";

class Model {
    private static groq: ChatGroq;
    private readonly groqInstance: ChatGroq;
    private static mistral: ChatMistralAI;
    private readonly mistralInstance: ChatMistralAI;
    constructor() {
        if(!Model.groq) {
            Model.groq = new ChatGroq({
                apiKey: serverConfig.GROQ_API_KEY,
                model: "llama-3.3-70b-versatile",
                temperature: 0.7,
                maxTokens: 2000,
            });
        }
        this.groqInstance = Model.groq;

        if(!Model.mistral) {
            Model.mistral = new ChatMistralAI({
                apiKey: serverConfig.MISTRAL_API_KEY,
                model: "mistral-small-latest",
                temperature: 0.8,
                maxTokens: 2000,
            });
        }
        this.mistralInstance = Model.mistral;
    }
    getGroqInstance() {
        return this.groqInstance;
    }
    getMistralInstance() {
        return this.mistralInstance;
    }
}

export const model = new Model();

export const groq = model.getGroqInstance();
export const mistral = model.getMistralInstance();