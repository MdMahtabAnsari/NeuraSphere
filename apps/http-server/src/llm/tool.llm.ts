import { TavilySearch } from "@langchain/tavily";
import serverConfig from "../configs/server.config";

class ToolLLM {
    private static tavily: TavilySearch;
    private readonly tavilyInstance: TavilySearch;

    constructor() {
        if (!ToolLLM.tavily) {
            ToolLLM.tavily = new TavilySearch({
                tavilyApiKey: serverConfig.TAVILY_API_KEY,
                maxResults: 5,
                topic: "general",

            });
        }
        this.tavilyInstance = ToolLLM.tavily;
    }

    getTavilyInstance() {
        return this.tavilyInstance;
    }
}

export const toolLLM = new ToolLLM();

export const tavily = toolLLM.getTavilyInstance();