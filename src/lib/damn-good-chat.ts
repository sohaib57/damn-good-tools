import { initializeAgentExecutorWithOptions } from "langchain/agents"
import { ChatOpenAI } from "langchain/chat_models/openai"
import { RequestsGetTool, RequestsPostTool } from "langchain/tools"

import AIPlugins from "./ai-plugins"

const tools = [new RequestsGetTool(), new RequestsPostTool()]

export async function promptDamnGoodChat(apiKey: string, prompt: string) {
    const allTools = [...tools, ...(await AIPlugins.initialize())]

    const agent = await initializeAgentExecutorWithOptions(
        allTools,
        new ChatOpenAI({
            temperature: 0,
            openAIApiKey: apiKey,
            modelName: "gpt-3.5-turbo",
        }),
        { agentType: "chat-zero-shot-react-description", verbose: false }
    )

    const result = await agent.call({
        input: prompt,
    })

    return result.output ? { text: result.output as string } : null
}
