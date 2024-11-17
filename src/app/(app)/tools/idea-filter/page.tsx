import { PageHeader } from "@/components/page-header"

import { Filter } from "./Filter"

export default async function IdeaFilter() {
    return (
        <>
            <PageHeader
                heading="Idea Filter"
                subheading="Define criteria for the ideas you want to work on next. Then, just throw ideas in and see which ideas win."
            />
            <Filter />
        </>
    )
}
