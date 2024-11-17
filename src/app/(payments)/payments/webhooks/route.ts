import crypto from "crypto"
import { NextResponse } from "next/server"

import { handleOrder } from "@/lib/payments"

if (!process.env.LEMON_SQUEEZY_SECRET) {
    throw new Error("LEMON_SQUEEZY_SECRET is not set")
}

const signingSecret = process.env.LEMON_SQUEEZY_SECRET

export async function POST(req: Request) {
    if (req.method !== "POST") {
        return NextResponse.json(
            { message: "Method not allowed" },
            { status: 405 }
        )
    }

    try {
        const rawBody = await req.text()
        const hmac = crypto.createHmac("sha256", signingSecret)
        const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf-8")
        const rawSignature = req.headers.get("x-signature")
        if (!rawSignature) {
            return NextResponse.json(
                { message: "Signature is required" },
                { status: 401 }
            )
        }

        const signature = Buffer.from(rawSignature, "utf-8")
        if (!crypto.timingSafeEqual(digest, signature)) {
            return NextResponse.json(
                { message: "Invalid signature" },
                { status: 401 }
            )
        }

        const payload: any = JSON.parse(rawBody)

        if (payload.meta.event_name == "order_created") {
            await handleOrder(payload.data, payload.meta.custom_data)
        }

        return NextResponse.json({ message: "Webhook processed" })
    } catch (e: any) {
        console.error(e)

        return NextResponse.json(
            {
                message: "Internal Application Error",
            },
            { status: 500 }
        )
    }
}
