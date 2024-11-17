import { NextRequest, NextResponse } from "next/server"

import { FixGrammarRequest, FixGrammarRequestSchema } from "@/lib/schema"
import { fixGrammar } from "@/lib/grammar"

export async function POST(request: NextRequest) {
    try {
        const generateRequest = (await request.json()) as FixGrammarRequest
        const result = await FixGrammarRequestSchema.safeParseAsync(
            generateRequest
        )
        if (result.success) {
            const fixedText = await fixGrammar(generateRequest.text)

            if (fixedText && fixedText.length > 0) {
                return NextResponse.json({
                    success: true,
                    result: { text: fixedText, sourceText: generateRequest.text },
                })
            }

            return NextResponse.json({
                success: false,
                message: "Failed to fix grammar",
            })
        }

        return NextResponse.json({
            success: false,
            message: result.error.message,
        })
    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { success: false, message: "Internal application error" },
            { status: 500 }
        )
    }
}
