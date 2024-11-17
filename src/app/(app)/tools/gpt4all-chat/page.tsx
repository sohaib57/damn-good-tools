import { Metadata } from "next"
import Link from "next/link"

import { PageHeader } from "@/components/page-header"

import { Chat } from "./Chat"

export const metadata: Metadata = {
    title: "GPT4All Chat",
    description: "Chat with an open-source and free alternative GPT model.",
}

export default function ChatWithAnyPDF() {
    const model = process.env.GPT4ALL_MODEL

    return (
        <>
            <PageHeader
                heading="GPT4All Chat"
                subheading={
                    <>
                        Chat with an free and open-source alternative GPT model—
                        <Link
                            href="https://gpt4all.io"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            GPT4All
                        </Link>
                        .
                    </>
                }
            />
            <Chat model={model} />
        </>
    )
}
