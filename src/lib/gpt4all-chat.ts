import initializer from "./gpt4all"

export async function prompt(prompt: string) {
    const gpt4all = await initializer.initialize()
    const resultText = await gpt4all.prompt(prompt)

    return {
        text: resultText,
    }
}
