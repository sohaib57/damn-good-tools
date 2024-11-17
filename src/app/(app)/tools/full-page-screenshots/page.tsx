import { PageHeader } from "@/components/page-header"

import { FullPageScreenshots } from "./FullPageScreenshots"

export default async function ScreenshotsForDimensions() {
    return (
        <>
            <PageHeader
                heading="Full page screenshots"
                subheading="Render a full-page screenshot of any website."
            />
            <FullPageScreenshots />
        </>
    )
}
