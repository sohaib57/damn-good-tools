import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

if (!process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL) {
    throw new Error(
        `NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL environment variable is required`
    )
}

const checkoutUrl = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL

export function generateCheckoutUrl(
    userId?: string | null,
    email?: string | null
) {
    if (email && userId) {
        return `${checkoutUrl}?checkout[email]=${email}&checkout[custom][user_id]=${userId}`
    }

    return checkoutUrl
}
