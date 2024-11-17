import "../load-env"
import { exit } from "process"
import { GPT4All } from "gpt4all"

if (!process.env.GPT4ALL_MODEL) {
    throw new Error("Please, specify the `GPT4ALL_MODEL` environment variable")
}
const model = process.env.GPT4ALL_MODEL

async function main() {
    const gpt4all = new GPT4All(model, false)

    await gpt4all.init(false)
    await gpt4all.open()
    try {
        const response = await gpt4all.prompt("Hello world!")
        console.log(`The model responded with: ${response}`)
    } catch (err) {
        console.error(err)
    }

    await gpt4all.close()
}

main()
    .then(() => {})
    .catch((err) => {
        console.error(err)
        exit(1)
    })
