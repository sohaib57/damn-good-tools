import { AIPluginTool } from "langchain/tools"

let pluginSources: string[] = [];
if (process.env.AI_PLUGINS && process.env.AI_PLUGINS.length > 0) {
    pluginSources = process.env.AI_PLUGINS.split(',')
}

export class AIPluginsInitializer {
    private initialized: boolean
    private plugins: AIPluginTool[]

    constructor() {
        this.initialized = false
        this.plugins = []
    }

    async initialize() {
        if (!this.initialized) {
            this.plugins = await Promise.all(pluginSources.map(pluginUrl => AIPluginTool.fromPluginUrl(pluginUrl)));

            this.initialized = true
        }

        return this.plugins
    }
}

const globalForAIPlugins = global as unknown as {
    aiPlugins: AIPluginsInitializer | undefined
}

const aiPlugins = globalForAIPlugins.aiPlugins ?? new AIPluginsInitializer()

if (process.env.NODE_ENV !== "production")
    globalForAIPlugins.aiPlugins = aiPlugins

export default aiPlugins
