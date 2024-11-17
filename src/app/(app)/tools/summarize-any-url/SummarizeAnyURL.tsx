"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@radix-ui/react-label"
import { Info, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"

import { SummarizeURLRequest, SummarizeURLRequestSchema } from "@/lib/schema"
import { SummarizationResult } from "@/lib/shared"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export function SummarizeAnyURL() {
    const { toast } = useToast()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SummarizeURLRequest>({
        resolver: zodResolver(SummarizeURLRequestSchema),
    })

    const [summary, setSummary] = useState(
        'The "example.com" website is reserved by the Internet Assigned Numbers Authority (IANA) to be used as an example in documentation or for testing purposes.'
    )
    const [processing, setProcessing] = useState<boolean>(false)
    const onSubmit = async (data: SummarizeURLRequest) => {
        setProcessing(true)

        try {
            const response = await fetch("/tools/summarize-any-url/api", {
                method: "POST",
                body: JSON.stringify(data),
            })
            setProcessing(false)

            if (response.ok) {
                const result = (await response.json()) as {
                    success: boolean
                    result: SummarizationResult
                }

                if (
                    result.success &&
                    result.result &&
                    result.result.text.length > 0
                ) {
                    return setSummary(result.result.text)
                }
            }

            throw new Error("Failed to summarize the URL")
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
        <div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex max-w-[250px] flex-col gap-5 md:col-span-1"
            >
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="website">Any URL</Label>
                    <Input
                        type="url"
                        id="website"
                        placeholder="https://example.com"
                        {...register("website")}
                    />
                    {errors.website && errors.website?.message && (
                        <p className="text-sm text-destructive">
                            {errors.website?.message}
                        </p>
                    )}
                </div>
                <Button type="submit" disabled={processing}>
                    {processing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </>
                    ) : (
                        "Generate summary"
                    )}
                </Button>
            </form>
            <div className="mt-10 md:max-w-[700px] ">
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Summary</AlertTitle>
                    <AlertDescription>{summary}</AlertDescription>
                </Alert>
            </div>
        </div>
    )
}
