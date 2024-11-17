import * as screenshotone from "screenshotone-api-sdk"

import {
    Screenshot,
    ScrollingScreenshot,
    screenshotDevices,
    screenshotExampleUrl,
} from "./shared"

const globalForScreenshotOne = global as unknown as {
    screenshotoneClient: screenshotone.Client
}

if (
    process.env.SCREENSHOTONE_ACCESS_KEY === undefined ||
    process.env.SCREENSHOTONE_SECRET_KEY === undefined
) {
    throw new Error(
        `SCREENSHOTONE_ACCESS_KEY and SCREENSHOTONE_SECRET_KEY environment variables are required`
    )
}

const accessKey = process.env.SCREENSHOTONE_ACCESS_KEY
const secretKey = process.env.SCREENSHOTONE_SECRET_KEY

const screenshotoneClient =
    globalForScreenshotOne.screenshotoneClient ||
    new screenshotone.Client(accessKey, secretKey)

if (process.env.NODE_ENV !== "production")
    globalForScreenshotOne.screenshotoneClient = screenshotoneClient

export function screenshotUrl(
    url: string,
    viewportWidth: number,
    viewportHeight: number,
    deviceScaleFactor: number,
    fullPage?: boolean
) {
    const cacheKey =
        url == screenshotExampleUrl
            ? "example"
            : new String(new Date().getTime()).toString()
    const cacheTtl = url == screenshotExampleUrl ? 2592000 : 14400

    const options = screenshotone.TakeOptions.url(url)
        .blockChats(true)
        .blockCookieBanners(true)
        .blockAds(true)
        .cache(true)
        .blockBannersByHeuristics(false)
        .cacheKey(cacheKey)
        .cacheTtl(cacheTtl)
        .reducedMotion(true)
        .viewportWidth(viewportWidth)
        .viewportHeight(viewportHeight)
        .deviceScaleFactor(deviceScaleFactor)
        .fullPage(!!fullPage)

    return screenshotoneClient.generateSignedTakeURL(options)
}

export function scrollingScreenshotUrl(
    url: string,
    viewportWidth: number,
    viewportHeight: number,
    deviceScaleFactor: number,
    format: string,
    duration: number,
    scrollBack: boolean,
    scrollSpeed: "slow" | "medium" | "fast",
    startImmediately: boolean
) {
    const cacheKey =
        url == screenshotExampleUrl
            ? "example"
            : new String(new Date().getTime()).toString()
    const cacheTtl = url == screenshotExampleUrl ? 2592000 : 14400

    let scrollDuration = 1500;
     switch (scrollSpeed) {
        case 'slow': 
            scrollDuration = 3000;
            break;
        case 'medium': 
            scrollDuration = 1500;
            break;
        case 'fast': 
            scrollDuration = 500;
            break;
     }

    const options = screenshotone.AnimateOptions.url(url)
        .blockChats(true)
        .blockCookieBanners(true)
        .blockAds(true)
        .cache(true)
        .blockBannersByHeuristics(false)
        .cacheKey(cacheKey)
        .cacheTtl(cacheTtl)
        .reducedMotion(true)
        .viewportWidth(viewportWidth)
        .viewportHeight(viewportHeight)
        .deviceScaleFactor(deviceScaleFactor)
        .scenario("scroll")
        .duration(duration)
        .scrollStartImmediately(startImmediately)
        .scrollDuration(scrollDuration)
        .scrollBack(scrollBack)
        .format(format)

    return screenshotoneClient.generateSignedAnimateURL(options)
}

export async function generateExampleScreenshots(): Promise<Screenshot[]> {
    return await generateScreenshots(screenshotExampleUrl)
}

export async function generateFullPageScreenshots(
    url: string,
    deviceNames: string[]
): Promise<Screenshot[]> {
    return screenshotDevices
        .filter((d) => deviceNames.includes(d.name))
        .map((d) => {
            return {
                url: screenshotUrl(
                    url,
                    d.viewportWidth,
                    d.viewportHeight,
                    d.deviceScaleFactor,
                    true
                ),
                viewportWidth: d.viewportWidth,
                viewportHeight: d.viewportHeight,
                device: d.name,
            }
        })
}

export async function generateScrollingScreenshots(
    url: string,
    deviceNames: string[],
    format: string,
    duration: number,
    scrollBack: boolean,
    scrollSpeed: "slow" | "medium" | "fast",
    startImmediately: boolean
): Promise<ScrollingScreenshot[]> {
    return screenshotDevices
        .filter((d) => deviceNames.includes(d.name))
        .map((d) => {
            return {
                url: scrollingScreenshotUrl(
                    url,
                    d.viewportWidth,
                    d.viewportHeight,
                    d.deviceScaleFactor,
                    format,
                    duration,
                    scrollBack,
                    scrollSpeed,
                    startImmediately
                ),
                format: format,
                viewportWidth: d.viewportWidth,
                viewportHeight: d.viewportHeight,
                device: d.name,
            }
        })
}

export async function generateScreenshots(url: string): Promise<Screenshot[]> {
    return screenshotDevices.map((d) => {
        return {
            url: screenshotUrl(
                url,
                d.viewportWidth,
                d.viewportHeight,
                d.deviceScaleFactor
            ),
            viewportWidth: d.viewportWidth,
            viewportHeight: d.viewportHeight,
            device: d.name,
        }
    })
}
