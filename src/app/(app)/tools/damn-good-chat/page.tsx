import AIPlugins from "@/lib/ai-plugins"
import { Plugin } from "@/lib/shared"
import { PageHeader } from "@/components/page-header"

import { DamnGoodChat } from "./DamnGoodChat"

export default async function DamnGoodChatPage() {
    const plugins: Plugin[] = (await AIPlugins.initialize()).map((aiPlugin) => {
        return {
            name: aiPlugin.name,
            description: aiPlugin.description,
        } as Plugin
    })

    return (
        <>
            <PageHeader
                heading="Damn Good Chat"
                subheading="A better ChatGPT alternative that supports superb ChatGPT plugins."
            />
            <DamnGoodChat plugins={plugins} />
        </>
    )
}
