import "../load-env"
import { exec } from "child_process"
import fs, { promises as fsAsync } from "fs"
import { chmod, chown } from "fs/promises"
import os from "os"
import { exit } from "process"
import { promisify } from "util"
import axios from "axios"
import { GPT4All } from "gpt4all"
import ProgressBar from "progress"

if (!process.env.GPT4ALL_MODEL) {
    throw new Error("Please, specify the `GPT4ALL_MODEL` environment variable")
}
const model = process.env.GPT4ALL_MODEL

async function main() {
    const modelPath = `${os.homedir()}/.nomic/${model}.bin`
    const modelDownloadURL = `https://the-eye.eu/public/AI/models/nomic-ai/gpt4all/${model}.bin`
    const executablePath = `${os.homedir()}/.nomic/gpt4all`
    const executableDownloadURL = await resolveExecutableURL()

    if (await fileExists(modelPath)) {
        console.log(`The model file exists`)
    } else {
        await downloadFile(modelDownloadURL, modelPath)
        console.log(
            `The model has been downloaded successfully and stored at ${modelPath}`
        )
    }

    if (await fileExists(executablePath)) {
        console.log(`The executable file exists`)
    } else {
        await downloadFile(executableDownloadURL, executablePath)
        await chmod(executablePath, 0o755)
        console.log(
            `The executable file has been downloaded successfully and stored at ${executablePath}`
        )
    }

    const gpt4all = new GPT4All(process.env.GPT4ALL_MODEL, false)

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

async function resolveExecutableURL() {
    const platform = os.platform()

    if (platform === "darwin") {
        const { stdout } = await promisify(exec)("uname -m")
        if (stdout.trim() === "arm64") {
            return `https://github.com/nomic-ai/gpt4all/blob/main/gpt4all-training/chat/${model}-OSX-m1?raw=true`
        } else {
            return `https://github.com/nomic-ai/gpt4all/blob/main/gpt4all-training/chat/${model}-OSX-intel?raw=true`
        }
    } else if (platform === "linux") {
        return `https://github.com/nomic-ai/gpt4all/blob/main/gpt4all-training/chat/${model}-linux-x86?raw=true`
    } else if (platform === "win32") {
        return `https://github.com/nomic-ai/gpt4all/blob/main/gpt4all-training/chat/${model}-win64.exe?raw=true`
    }

    throw new Error(
        `Your platform is not supported: ${platform}. Current binaries supported are for OSX (ARM and Intel), Linux and Windows.`
    )
}

async function downloadFile(url: string, destination: string): Promise<void> {
    const { data, headers } = await axios.get(url, { responseType: "stream" })
    const totalSize = parseInt(headers["content-length"], 10)
    const progressBar = new ProgressBar("[:bar] :percent :etas", {
        complete: "=",
        incomplete: " ",
        width: 20,
        total: totalSize,
    })
    const dir = new URL(`file://${os.homedir()}/.nomic/`)
    await fsAsync.mkdir(dir, { recursive: true })

    const writer = fs.createWriteStream(destination)

    data.on("data", (chunk: any) => {
        progressBar.tick(chunk.length)
    })

    data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on("finish", resolve)
        writer.on("error", reject)
    })
}

async function fileExists(path: string) {
    try {
        await fsAsync.access(path, fs.constants.F_OK)

        return true
    } catch (err) {
        return false
    }
}

main()
    .then(() => {})
    .catch((err) => {
        console.error(err)
        exit(1)
    })
