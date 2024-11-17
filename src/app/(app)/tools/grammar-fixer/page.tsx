import { PageHeader } from "@/components/page-header"
import { GrammarFixer } from "./GrammarFixer"

export default async function SummarizeAnyURLPage() {
    return (
        <>
            <PageHeader
                heading="Grammar fixer"
                subheading="Fix the grammar of any text in one click."
            />
            <GrammarFixer />
        </>
    )
}
