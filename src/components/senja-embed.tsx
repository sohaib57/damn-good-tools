"use client"

import { useEffect } from "react"

interface SenjaProps {
    widgetId: string
}

export default function SenjaEmbed({ widgetId }: SenjaProps) {
    let lazy = false

    useEffect(() => {
        let script: HTMLScriptElement | null = document.querySelector(
            `script[src="https://static.senja.io/dist/platform.js"]`
        )

        if (script) {
            return
        }

        script = document.createElement("script")
        script.src = "https://static.senja.io/dist/platform.js"
        script.async = true
        script.type = "text/javascript"
        document.body.append(script)

        return () => {
            if (script) {
                document.body.removeChild(script)
            }
        }
    }, [])

    return (
        <div
            className="senja-embed"
            data-lazyload={lazy}
            data-id={widgetId}
        ></div>
    )
}
