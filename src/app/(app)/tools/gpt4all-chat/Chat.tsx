"use client"

import { useEffect, useRef, useState } from "react"
import { Bot, FileQuestion, Loader2 } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface ChatInteraction {
    isBot: boolean
    message: string
}

async function askQuestion(question: string) {
    try {
        const response = await fetch(`/tools/gpt4all-chat/api`, {
            method: "POST",
            body: JSON.stringify({
                prompt: question,
            }),
        })

        if (response.ok) {
            return (await response.json()) as {
                success: boolean
                result?: { text: string }
            }
        }

        return null
    } catch (e) {
        console.error(e)

        return null
    }
}

interface ChatProps {
    model: string | undefined
}

export function Chat({ model }: ChatProps) {
    const { toast } = useToast()
    const [processing, setProcessing] = useState(false)
    const [chatInteractions, setChatInteractions] = useState<ChatInteraction[]>(
        [
            {
                message: `Hey, hey 👋 You are chatting with GPT4All—a free and open-source alternative to many proprietary and commercial GPTs. Try to prompt and see what happens.`,
                isBot: true,
            },
        ]
    )
    const [question, setQuestion] = useState<string>("")

    const onAskQuestion = async () => {
        if (question.length == 0) {
            return
        }

        setChatInteractions((previousInteractions) => [
            ...previousInteractions,
            { isBot: false, message: question },
        ])

        setProcessing(true)
        const result = await askQuestion(question)
        setProcessing(false)

        if (result?.success && result.result) {
            const answer = result.result.text
            setChatInteractions((previousInteractions) => [
                ...previousInteractions,
                { isBot: true, message: answer },
            ])
            setQuestion("")
            
            return
        }

        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
        })
    }

    const interactionsRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (interactionsRef?.current?.lastElementChild) {
            interactionsRef.current.lastElementChild.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "start",
            })
        }
    }, [chatInteractions])

    return (
        <div>
            <p className="text-sm text-muted-foreground">Model: {model}.</p>
            <div className="mt-4 w-full rounded-lg md:w-8/12">
                <div
                    ref={interactionsRef}
                    className="flex h-[450px] flex-col gap-2 overflow-scroll rounded-lg bg-secondary p-2"
                >
                    {chatInteractions.map((i, index) => (
                        <Alert key={index}>
                            {i.isBot ? (
                                <Bot className="h-4 w-4" />
                            ) : (
                                <FileQuestion className="h-4 w-4" />
                            )}
                            <AlertDescription>
                                <div>{i.message}</div>
                            </AlertDescription>
                        </Alert>
                    ))}

                    {processing && (
                        <Alert key="processing" className="animate-pulse">
                            <Bot className="h-4 w-4" />
                            <AlertDescription>...</AlertDescription>
                        </Alert>
                    )}
                </div>
                <form
                    className="mt-2 flex flex-row gap-2"
                    onSubmit={async (e) => {
                        e.preventDefault()
                        await onAskQuestion()
                    }}
                >
                    <Input
                        disabled={processing}
                        type="text"
                        placeholder="Your prompt..."
                        onChange={(e) => setQuestion(e.target.value)}
                        value={question}
                    />
                    <Button
                        type="submit"
                        disabled={processing}
                        className="min-w-[80px]"
                    >
                        {processing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            "Send"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    )
}
