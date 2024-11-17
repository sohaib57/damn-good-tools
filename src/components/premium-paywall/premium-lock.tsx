import { Lock } from "lucide-react"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { Button } from "../ui/button"
import { usePaywallModalStore } from "./modal-state-store"

export function PremiumLock() {
    const showPaywall = usePaywallModalStore((state) => state.show)

    return (
        <TooltipProvider delayDuration={250}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Lock
                        className="text-red-300 dark:text-red-900 w-4 h-4 hover:cursor-pointer"
                        onClick={showPaywall}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>
                        Please,{" "}
                        <Button
                            variant="link"
                            className="px-0 text-red-500 dark:text-red-700"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                showPaywall()
                            }}
                        >
                            upgrade to premium access
                        </Button>{" "}
                        to unlock the feature.
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
