import { loadSummarizationChain } from "langchain/chains"
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio"
import { OpenAI } from "langchain/llms/openai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

const model = new OpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPENAI_API_KEY,
})

export async function generateSummary(url: string) {
    const loader = new CheerioWebBaseLoader(url)

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 4000,
        chunkOverlap: 20,
    })
    let docs = (await textSplitter.splitDocuments(await loader.load())).slice(
        0,
        2
    )

    const chain = loadSummarizationChain(model, { type: "map_reduce" })
    const res = await chain.call({
        input_documents: docs,
    })

    if (res && res.text) {
        return res.text
    }

    return null
}

export async function generateTextSummary(text: string) {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 4000,
        chunkOverlap: 20,
    })

    let docs = await textSplitter.createDocuments([text])

    const chain = loadSummarizationChain(model, { type: "map_reduce" })
    const res = await chain.call({
        input_documents: docs,
    })

    if (res && res.text) {
        return res.text
    }

    return null
}
