"use client"

import { useRef, useState } from "react"
import { AlertCircle, FileVolume2 } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"

const transcribeAudioRequest = async (audioFile: Blob, type: string) => {
    const formData = new FormData()
    formData.append("file", audioFile, "audio.bin")
    try {
        const response = await fetch(
            "/tools/record-and-transcribe-audio/api/transcribe",
            {
                method: "POST",
                body: formData,
            }
        )
        if (response.ok) {
            const { text, summary, success, message } = await response.json()
            if (success && text && summary) {
                return { success, text, summary }
            } else {
                return { success, message }
            }
        } else {
            return { success: false }
        }
    } catch (error) {
        console.error(error)

        return { success: false }
    }
}

interface Props {
    maxFileSize: number
}

export function Uploader({ maxFileSize }: Props) {
    const [text, setText] = useState("")
    const [summary, setSummary] = useState("")
    const [processing, setProcessing] = useState(false)

    const inputRef = useRef<HTMLInputElement | null>(null)

    const [fileValidationError, setFileValidationError] = useState<
        string | null
    >(null)

    const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.length) {
            return
        }

        setFileValidationError(null)

        const [file] = Array.from(event.target.files)
        if (file && file.size > maxFileSize) {
            setFileValidationError(
                `The file size must not exceed ${
                    Math.round(maxFileSize) / 1_000_000
                } MB.`
            )
            return
        }

        setProcessing(true)
        transcribeAudioRequest(file, file.type)
            .then((result) => {
                setProcessing(false)
                if (result.success) {
                    setText(result.text ? result.text : "")
                    setSummary(result.summary ? result.summary : "")
                }
            })
            .catch((reason) => {
                setProcessing(false)
                console.error(reason)
            })
    }

    return (
        <>
            <div className="flex">
                <div className="mx-auto flex flex-col items-center">
                    <div className="mt-5 text-center">
                        <input
                            ref={inputRef}
                            type="file"
                            name="pdf"
                            accept="audio/webm,audio/mp4,audio/m4a,audio/mp3,audio/ogg"
                            className="hidden"
                            onChange={uploadFile}
                        />
                        {processing ? (
                            <div className="animate-pulse">Transcribing...</div>
                        ) : (
                            <>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        inputRef?.current?.click()
                                    }}
                                >
                                    <FileVolume2 className="mr-2 h-4 w-4" />{" "}
                                    Upload your audio
                                </Button>
                                {!fileValidationError && (
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        Only {Math.round(maxFileSize / 1000000)}{" "}
                                        MB files are allowed.
                                    </div>
                                )}
                                {fileValidationError && (
                                    <Alert
                                        variant="destructive"
                                        className="mt-2 w-[300px]"
                                    >
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            {fileValidationError}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </>
                        )}
                    </div>
                    {(summary || text) && (
                        <Card className="max-w-[550px] mt-10">
                            <CardHeader>
                                {summary && (
                                    <CardDescription>{summary}</CardDescription>
                                )}
                            </CardHeader>
                            {text && (
                                <CardContent>
                                    <p>{text}</p>
                                </CardContent>
                            )}
                        </Card>
                    )}
                </div>
            </div>
        </>
    )
}
