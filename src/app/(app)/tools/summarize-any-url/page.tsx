import { PageHeader } from "@/components/page-header"

import { SummarizeAnyURL } from "./SummarizeAnyURL"

export default async function SummarizeAnyURLPage() {
    return (
        <>
            <PageHeader
                heading="Summarize any URL"
                subheading="Quickly summarize any website or URL."
            />
            <SummarizeAnyURL />
        </>
    )
}
