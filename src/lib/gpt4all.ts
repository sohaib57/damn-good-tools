import { GPT4All } from "gpt4all"

if (!process.env.GPT4ALL_MODEL) {
    throw new Error("Please, specify the `GPT4ALL_MODEL` environment variable")
}
const model = process.env.GPT4ALL_MODEL

export class GPT4AllInitializer {
    private open: boolean
    private gpt4all: GPT4All

    constructor() {
        this.open = false
        this.gpt4all = new GPT4All(model, false)
    }

    async initialize() {
        if (!this.open) {
            await this.gpt4all.init(false)
            await this.gpt4all.open()
            this.open = true
        }

        return this.gpt4all
    }
}

const globalForGPT4All = global as unknown as {
    gpt4all: GPT4AllInitializer | undefined
}

const gpt4all = globalForGPT4All.gpt4all ?? new GPT4AllInitializer()

if (process.env.NODE_ENV !== "production") globalForGPT4All.gpt4all = gpt4all

export default gpt4all
