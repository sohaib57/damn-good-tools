import { NextRequest, NextResponse } from "next/server"

import { promptDamnGoodChat } from "@/lib/damn-good-chat"
import { ChatPrompt } from "@/lib/shared"

export async function POST(request: NextRequest) {
    try {
        const chatPrompt = (await request.json()) as ChatPrompt

        if (!chatPrompt.apiKey || chatPrompt.apiKey.length == 0) {
            return NextResponse.json({
                success: true,
                result: {
                    text: "Please, set your OpenAI API key. It is required to use the chat.",
                },
            })
        }

        const result = await promptDamnGoodChat(
            chatPrompt.apiKey,
            chatPrompt.prompt
        )

        return NextResponse.json({
            success: true,
            result,
        })
    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { success: false, message: "Internal application error" },
            { status: 500 }
        )
    }
}
