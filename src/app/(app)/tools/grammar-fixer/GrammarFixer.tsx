"use client"

import React, { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@radix-ui/react-label"
import * as Diff from "diff"
import { Clipboard, ClipboardCheck, Loader2 } from "lucide-react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { useForm } from "react-hook-form"

import { FixGrammarRequest, FixGrammarRequestSchema } from "@/lib/schema"
import { GrammarFixResult } from "@/lib/shared"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

const handleNewLines = (text: string) => {
    const items = text.split("\n")
    return items.map((item, key) => {
        return (
            <React.Fragment key={key}>
                {item}
                {key !== items.length - 1 && <br />}
            </React.Fragment>
        )
    })
}

export function GrammarFixer() {
    const { toast } = useToast()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FixGrammarRequest>({
        resolver: zodResolver(FixGrammarRequestSchema),
    })

    const [fixedText, setFixedText] = useState<React.ReactNode>(<></>)
    const [textToCopy, setTextToCopy] = useState<React.ReactNode>("")
    const [copied, setCopied] = useState<boolean>(false)

    useEffect(() => {
        const timer = copied
            ? setTimeout(() => {
                  setCopied(false)
              }, 1000)
            : null

        return () => {
            if (timer) {
                clearTimeout(timer)
            }
        }
    }, [copied])

    const generateDiff = (source, fixed: string) => {
        const diff = Diff.diffWords(fixed, source)

        const fixedTextDiff = diff.map((part, i) => {
            if (part.added) {
                return (
                    <span key={i} className="bg-green-100 dark:bg-green-900">
                        {handleNewLines(part.value)}
                    </span>
                )
            }
            if (part.removed) {
                return (
                    <span key={i} className="bg-red-100 dark:bg-red-900">
                        {handleNewLines(part.value)}
                    </span>
                )
            }

            return <span key={i}>{handleNewLines(part.value)}</span>
        })

        setFixedText(<>{fixedTextDiff}</>)
    }

    const [processing, setProcessing] = useState<boolean>(false)
    const onSubmit = async (data: FixGrammarRequest) => {
        setProcessing(true)

        try {
            const response = await fetch("/tools/grammar-fixer/api", {
                method: "POST",
                body: JSON.stringify(data),
            })
            setProcessing(false)

            if (response.ok) {
                const result = (await response.json()) as {
                    success: boolean
                    result: GrammarFixResult
                }

                if (
                    result.success &&
                    result.result &&
                    result.result.text.length > 0
                ) {
                    setTextToCopy(result.result.text)
                    generateDiff(result.result.text, result.result.sourceText)

                    return
                }
            }

            throw new Error("Failed to fix grammar")
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            })
        }

        setProcessing(false)
    }

    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5 md:col-span-1"
            >
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="website">Your text</Label>
                    <Textarea
                        id="text"
                        rows={10}
                        className="text-md h-[400px]"
                        placeholder="Enter your text here..."
                        {...register("text")}
                    />
                    {errors.text && errors.text?.message && (
                        <p className="text-sm text-destructive">
                            {errors.text?.message}
                        </p>
                    )}
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                        {processing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            "Fix grammar"
                        )}
                    </Button>
                </div>
            </form>
            <div>
                <div>Here is your fixed result:</div>
                <div className="text-md mt-1.5 h-[400px] rounded-lg border px-3 py-2">
                    {fixedText}
                </div>
                <div className="mt-5 flex justify-end">
                    <CopyToClipboard
                        text={textToCopy}
                        onCopy={() => setCopied(true)}
                    >
                        <Button>                            
                            {copied ? (
                                <ClipboardCheck className="mr-2 h-4 w-4" />
                            ) : (
                                <Clipboard className="mr-2 h-4 w-4" />
                            )}
                            Copy
                        </Button>
                    </CopyToClipboard>
                </div>
            </div>
        </div>
    )
}
