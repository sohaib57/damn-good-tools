"use client"

import { Ref, forwardRef, useEffect, useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { SelectProps } from "@radix-ui/react-select"
import { ExternalLink, Loader2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import {
    GenerateFullPageScreenshotRequest,
    GenerateFullPageScreenshotRequestSchema,
} from "@/lib/schema"
import { Screenshot as ScreenshotData, screenshotDevices } from "@/lib/shared"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

const DeviceSelect = forwardRef(
    (
        { ...props }: SelectProps & { forwardedRef: Ref<HTMLButtonElement> },
        forwardedRef: Ref<HTMLButtonElement>
    ) => {
        return (
            <Select {...props}>
                <SelectTrigger className="w-full" ref={forwardedRef}>
                    <SelectValue placeholder="Device" />
                </SelectTrigger>
                <SelectContent>
                    {screenshotDevices.map((d) => (
                        <SelectItem value={d.name}>{d.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        )
    }
)
DeviceSelect.displayName = "DeviceSelect"

const ScreenshotPlaceholder = () => {
    return (
        <div className="flex h-[300px] w-[300px]">
            <div className="m-auto flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
    )
}

type ScreenshotProps = {
    viewportWidth: number
    viewportHeight: number
    device: string
    url: string
}

const Screenshot = ({
    viewportWidth,
    viewportHeight,
    device,
    url,
}: ScreenshotProps) => {
    const [loaded, setLoaded] = useState(false)

    return (
        <div>
            <div className="text-md">
                <Link
                    href={url}
                    target="_black"
                    className="flex flex-row items-center justify-center text-muted-foreground"
                >
                    <span>
                        {device} ({viewportWidth}x{viewportHeight})
                    </span>
                    <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
            </div>
            <div className="mt-4 ">
                {!loaded && <ScreenshotPlaceholder />}
                <Link href={url} target="_black">
                    <img
                        ref={(input) => {
                            if (!input) {
                                return
                            }

                            const img = input

                            const updateFunc = () => {
                                setLoaded(true)
                            }
                            img.onload = updateFunc
                            if (img.complete) {
                                updateFunc()
                            }
                        }}
                        src={url}
                        className={`rounded-lg border-muted-foreground ${
                            !loaded && "hidden"
                        }`}
                    />
                </Link>
            </div>
        </div>
    )
}

export function FullPageScreenshots() {
    const { toast } = useToast()
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<GenerateFullPageScreenshotRequest>({
        resolver: zodResolver(GenerateFullPageScreenshotRequestSchema),
    })

    const [generating, setGenerating] = useState<boolean>(false)
    const [screenshots, setScreenshots] = useState<ScreenshotData[]>([])

    const onSubmit = async (data: GenerateFullPageScreenshotRequest) => {
        setGenerating(true)

        try {
            const response = await fetch("/tools/full-page-screenshots/api", {
                method: "POST",
                body: JSON.stringify(data),
            })
            setGenerating(false)

            if (response.ok) {
                const result = (await response.json()) as {
                    screenshots: ScreenshotData[]
                }

                if (result.screenshots && result.screenshots.length > 0) {
                    return setScreenshots(result.screenshots)
                }
            }

            throw new Error("Failed to generate screenshots")
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            })
        }

        setGenerating(false)
    }

    return (
        <div className="flex flex-col md:flex-row gap-20">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex max-w-[250px] flex-col gap-5 md:col-span-1"
            >
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="website">Your website</Label>
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
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="website">Device</Label>
                    <Controller
                        name="device"
                        control={control}
                        render={({
                            field: { onChange, value, ref, ...props },
                        }) => (
                            <DeviceSelect
                                onValueChange={onChange}
                                value={value}
                                forwardedRef={ref}
                            />
                        )}
                    />
                    {errors.device && errors.device?.message && (
                        <p className="text-sm text-destructive">
                            {errors.device?.message}
                        </p>
                    )}
                </div>
                <Button type="submit" disabled={generating}>
                    {generating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </>
                    ) : (
                        "Render"
                    )}
                </Button>
            </form>
            <div className="flex-grow">
                <div className="flex md:mx-auto max-w-[400px] md:max-w-[800px]">
                    {screenshots.map((s) => (
                        <Screenshot
                            key={s.url}
                            url={s.url}
                            viewportWidth={s.viewportWidth}
                            viewportHeight={s.viewportHeight}
                            device={s.device}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
