import { NextRequest, NextResponse } from "next/server"

import { prompt } from "@/lib/gpt4all-chat"
import { ChatPrompt } from "@/lib/shared"

export async function POST(request: NextRequest) {
    try {
        const chatPrompt = (await request.json()) as ChatPrompt
        throw new Error('not implemented');
        // const result = await prompt(chatPrompt.prompt)

        // return NextResponse.json({
        //     success: true,
        //     result,
        // })
    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { success: false, message: "Internal application error" },
            { status: 500 }
        )
    }
}
