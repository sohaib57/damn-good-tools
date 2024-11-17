import { NextRequest, NextResponse } from "next/server"

import { SummarizeURLRequest, SummarizeURLRequestSchema } from "@/lib/schema"
import { generateSummary } from "@/lib/summarize"

export async function POST(request: NextRequest) {
    try {
        const generateRequest = (await request.json()) as SummarizeURLRequest
        const result = await SummarizeURLRequestSchema.safeParseAsync(
            generateRequest
        )
        if (result.success) {
            const summary = await generateSummary(generateRequest.website)

            if (summary) {
                return NextResponse.json({
                    success: true,
                    result: { text: summary },
                })
            }

            return NextResponse.json({
                success: false,
                message: "Failed to generate summary",
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
