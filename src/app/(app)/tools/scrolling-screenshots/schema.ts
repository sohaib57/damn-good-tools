import { z } from "zod"

import { PremiumProperties } from "@/lib/tools"

export const GenerateScrollingScreenshotRequestSchema = z.object({
    website: z.string().url(),
    device: z.string(),
    format: z.enum(["webp", "mp4", "gif"]),
    duration: z.number().int().min(3).max(30),
    scrollBack: z.boolean(),
    startImmediately: z.boolean(),
    scrollSpeed: z.enum(["slow", "medium", "fast"]),
})

export type GenerateScrollingScreenshotRequest = z.infer<
    typeof GenerateScrollingScreenshotRequestSchema
>

export const premiumProperties: Partial<
    PremiumProperties<GenerateScrollingScreenshotRequest>
> = {
    startImmediately: true,
    scrollSpeed: true,
    scrollBack: true,
    duration: true,
}

export const defaultValues: Partial<GenerateScrollingScreenshotRequest> = {
    duration: 5,
    startImmediately: true,
    scrollSpeed: "medium",
    scrollBack: false,
    format: "mp4",
    device: "Desktop",
}
