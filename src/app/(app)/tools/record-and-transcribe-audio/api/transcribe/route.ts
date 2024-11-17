import { Readable } from "node:stream"
import { NextRequest, NextResponse } from "next/server"
import { AxiosError } from "axios"
import * as mimeTypes from "mime-types"

import { openAIApi } from "@/lib/openai"
import { generateTextSummary } from "@/lib/summarize"

export async function POST(request: NextRequest) {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File
    if (!file) {
        return NextResponse.json(
            {
                message: "No file present",
                success: false,
            },
            {
                status: 400,
            }
        )
    }
    try {
        let extension = mimeTypes.extension(file.type) as string
        extension = extension == "weba" ? "webm" : extension
        extension = extension == "m4a" ? "mp4" : extension

        console.log(`Transcribing ${extension} audio...`)

        const fileStream = Readable.from(Buffer.from(await file.arrayBuffer()))
        // @ts-expect-error a workaround to bypass the OpenAI API limitations
        fileStream.path = `audio.${extension}`
        const result = await openAIApi.createTranscription(
            fileStream as unknown as File,
            "whisper-1"
        )

        if (result.data.text) {
            return NextResponse.json({
                success: true,
                text: result.data.text,
                summary: await generateTextSummary(result.data.text),
            })
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: "failed to transcribe audio",
                },
                {
                    status: 500,
                }
            )
        }
    } catch (error) {
        console.error(error)
        if (error.isAxiosError) {
            const axiosError = error as AxiosError
            console.error(axiosError.response?.data)
        }

        return NextResponse.json(
            {
                success: false,
                message: "failed to transcribe audio",
            },
            {
                status: 500,
            }
        )
    }
}
