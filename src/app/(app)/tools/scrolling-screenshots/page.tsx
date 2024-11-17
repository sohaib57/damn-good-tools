import { Metadata } from "next"

import { getCurrentUser } from "@/lib/session"
import { PageHeader } from "@/components/page-header"

import { ScrollingScreenshots } from "./ScrollingScreenshots"
import { tool } from "./tool"

export const metadata: Metadata = {
    title: tool.name,
    description: tool.description,
}

export default async function ScrollingScreenshotsPage() {
    const user = await getCurrentUser()
    return (
        <>
            <PageHeader heading={tool.name} subheading={tool.description} />
            <ScrollingScreenshots isPremium={!!user?.premium} />
        </>
    )
}
