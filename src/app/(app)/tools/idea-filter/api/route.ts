import { NextRequest, NextResponse } from "next/server"

import { filterIdea } from "@/lib/idea-filter"
import { FilterIdeaRequest, FilterIdeaRequestSchema } from "@/lib/schema"

export async function POST(request: NextRequest) {
    try {
        const filterIdeaRequest = await FilterIdeaRequestSchema.safeParseAsync(
            (await request.json()) as FilterIdeaRequest
        )
        if (filterIdeaRequest.success) {
            const result = await filterIdea(
                filterIdeaRequest.data.text,
                filterIdeaRequest.data.filters
            )

            if (
                result &&
                result.resultFilters &&
                result.resultFilters.length > 0
            ) {
                return NextResponse.json({
                    success: true,
                    result: {
                        filters: result.resultFilters,
                    },
                })
            }

            return NextResponse.json({
                success: false,
                message: "Failed to filter idea",
            })
        }

        return NextResponse.json({
            success: false,
            message: filterIdeaRequest.error.message,
        })
    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { success: false, message: "Internal application error" },
            { status: 500 }
        )
    }
}
