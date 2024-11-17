import { NextRequest, NextResponse } from "next/server"

import {
    GenerateFullPageScreenshotRequest,
    GenerateFullPageScreenshotRequestSchema,
} from "@/lib/schema"
import { generateFullPageScreenshots } from "@/lib/screenshots"

export async function POST(request: NextRequest) {
    try {
        const generateRequest =
            (await request.json()) as GenerateFullPageScreenshotRequest
        const result =
            await GenerateFullPageScreenshotRequestSchema.safeParseAsync(
                generateRequest
            )
        if (result.success) {
            const screenshots = await generateFullPageScreenshots(
                generateRequest.website,
                [generateRequest.device]
            )

            return NextResponse.json({
                success: screenshots && screenshots?.length > 0,
                screenshots,
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
