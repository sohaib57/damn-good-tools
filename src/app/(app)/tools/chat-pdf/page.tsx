import { Metadata } from "next"

import { PageHeader } from "@/components/page-header"

import { ChatPDF } from "./ChatPDF"

export const metadata: Metadata = {
    title: "Chat with any PDF",
    description: "Upload a PDF file and ask any questions about it.",
}

export default function ChatWithAnyPDF() {
    return (
        <>
            <PageHeader
                heading="Chat with any PDF"
                subheading="Upload a PDF file and ask any questions about it."
            />
            <ChatPDF />
        </>
    )
}
