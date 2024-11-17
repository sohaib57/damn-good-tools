"use client"

import { Ref, forwardRef, useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { SelectProps } from "@radix-ui/react-select"
import { ExternalLink, HelpCircle, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"

import {
    Screenshot as ScreenshotData,
    ScrollingScreenshot,
    screenshotDevices,
} from "@/lib/shared"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { PaywallModal } from "@/components/premium-paywall/paywall-modal"
import { PremiumLock } from "@/components/premium-paywall/premium-lock"

import {
    GenerateScrollingScreenshotRequest,
    GenerateScrollingScreenshotRequestSchema,
    defaultValues,
    premiumProperties,
} from "./schema"

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
                        <SelectItem key={d.name} value={d.name}>
                            {d.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        )
    }
)
DeviceSelect.displayName = "DeviceSelect"

const FormatSelect = forwardRef(
    (
        { ...props }: SelectProps & { forwardedRef: Ref<HTMLButtonElement> },
        forwardedRef: Ref<HTMLButtonElement>
    ) => {
        return (
            <Select {...props}>
                <SelectTrigger className="w-full" ref={forwardedRef}>
                    <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem key="mp4" value="mp4">
                        MP4
                    </SelectItem>
                    <SelectItem key="gif" value="gif">
                        GIF
                    </SelectItem>
                    <SelectItem key="webm" value="webm">
                        WebM
                    </SelectItem>
                </SelectContent>
            </Select>
        )
    }
)

FormatSelect.displayName = "FormatSelect"

const SpeedSelect = forwardRef(
    (
        { ...props }: SelectProps & { forwardedRef: Ref<HTMLButtonElement> },
        forwardedRef: Ref<HTMLButtonElement>
    ) => {
        return (
            <Select {...props}>
                <SelectTrigger className="w-full" ref={forwardedRef}>
                    <SelectValue placeholder="Scroll speed" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem key="slow" value="slow">
                        Slow
                    </SelectItem>
                    <SelectItem key="medium" value="medium">
                        Medium
                    </SelectItem>
                    <SelectItem key="fast" value="fast">
                        Fast
                    </SelectItem>
                </SelectContent>
            </Select>
        )
    }
)
SpeedSelect.displayName = "SpeedSelect"

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
    format: string
}

const Screenshot = ({
    viewportWidth,
    viewportHeight,
    device,
    url,
    format,
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
                {format == "mp4" || format == "webm" ? (
                    <Link href={url} target="_black">
                        <video
                            autoPlay
                            loop
                            muted
                            ref={(input) => {
                                if (!input) {
                                    return
                                }

                                const video = input

                                const updateFunc = () => {
                                    setLoaded(true)
                                }
                                video.onloadeddata = updateFunc
                                if (video.readyState >= 2) {
                                    updateFunc()
                                }
                            }}
                        >
                            <source src={url} type={`video/${format}`} />
                        </video>
                    </Link>
                ) : (
                    <></>
                )}
                {!loaded && <ScreenshotPlaceholder />}
                {format == "gif" ? (
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
                ) : (
                    <></>
                )}
            </div>
        </div>
    )
}

export function ScrollingScreenshots({ isPremium }: { isPremium: boolean }) {
    const { toast } = useToast()
    const form = useForm<GenerateScrollingScreenshotRequest>({
        resolver: zodResolver(GenerateScrollingScreenshotRequestSchema),
        defaultValues,
    })

    const [generating, setGenerating] = useState<boolean>(false)
    const [screenshots, setScreenshots] = useState<ScrollingScreenshot[]>([])

    const onSubmit = async (data: GenerateScrollingScreenshotRequest) => {
        setGenerating(true)

        try {
            const response = await fetch("/tools/scrolling-screenshots/api", {
                method: "POST",
                body: JSON.stringify(data),
            })
            setGenerating(false)

            if (response.ok) {
                const result = (await response.json()) as {
                    screenshots: ScrollingScreenshot[]
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
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex max-w-[250px] flex-col gap-5 md:col-span-1"
                >
                    <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your website</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="http://example.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Enter any URL.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="device"
                        render={({
                            field: { onChange, value, ref, ...props },
                        }) => (
                            <FormItem>
                                <FormLabel>Device</FormLabel>
                                <FormControl>
                                    <DeviceSelect
                                        {...props}
                                        onValueChange={onChange}
                                        value={value}
                                        forwardedRef={ref}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="format"
                        render={({
                            field: { onChange, value, ref, ...props },
                        }) => (
                            <FormItem>
                                <FormLabel>Format</FormLabel>
                                <FormControl>
                                    <FormatSelect
                                        {...props}
                                        onValueChange={onChange}
                                        value={value}
                                        forwardedRef={ref}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex flex-row items-center gap-2">
                                    Duration
                                    <TooltipProvider delayDuration={200}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    The resulting generated
                                                    video/animation might be
                                                    much shorter
                                                    <br /> than the set duration
                                                    if the scrolling ends
                                                    earlier.
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </FormLabel>
                                <FormControl>
                                    <div className="flex flex-row gap-2 items-center">
                                        <Input
                                            type="number"
                                            id="duration"
                                            placeholder="5"
                                            disabled={
                                                premiumProperties.duration &&
                                                !isPremium
                                            }
                                            readOnly={
                                                premiumProperties.duration &&
                                                !isPremium
                                            }
                                            max={30}
                                            min={3}
                                            step={1}
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.valueAsNumber
                                                )
                                            }
                                        />
                                        {premiumProperties.duration &&
                                            !isPremium && <PremiumLock />}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="startImmediately"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center gap-2 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={
                                            premiumProperties.startImmediately &&
                                            !isPremium
                                        }
                                    />
                                </FormControl>
                                <div className="flex items-center gap-2">
                                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Start immediately
                                    </FormLabel>
                                    {premiumProperties.startImmediately &&
                                        !isPremium && <PremiumLock />}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="scrollBack"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center gap-2 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={
                                            premiumProperties.scrollBack &&
                                            !isPremium
                                        }
                                    />
                                </FormControl>
                                <div className="flex items-center gap-2">
                                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Scroll back
                                    </FormLabel>
                                    {premiumProperties.scrollBack &&
                                        !isPremium && <PremiumLock />}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="scrollSpeed"
                        render={({
                            field: { onChange, value, ref, ...props },
                        }) => (
                            <FormItem>
                                <FormLabel>Scroll speed</FormLabel>
                                <FormControl>
                                    <div className="flex flex-row items-center gap-2">
                                        <SpeedSelect
                                            {...props}
                                            disabled={
                                                premiumProperties.scrollSpeed &&
                                                !isPremium
                                            }
                                            onValueChange={onChange}
                                            value={value}
                                            forwardedRef={ref}
                                        />
                                        {premiumProperties.scrollSpeed &&
                                            !isPremium && <PremiumLock />}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
            </Form>
            <div className="flex-grow">
                <div className="flex md:mx-auto max-w-[400px] md:max-w-[800px]">
                    {screenshots.map((s) => (
                        <Screenshot
                            key={s.url}
                            url={s.url}
                            viewportWidth={s.viewportWidth}
                            viewportHeight={s.viewportHeight}
                            device={s.device}
                            format={s.format}
                        />
                    ))}
                </div>
            </div>
            <PaywallModal />
        </div>
    )
}
