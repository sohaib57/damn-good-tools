import Link from "next/link"

import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { usePaywallModalStore } from "./modal-state-store"

export function PaywallModal() {
    const open = usePaywallModalStore((state) => state.open)
    const setOpen = usePaywallModalStore((state) => state.setOpen)

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Unlock Premium Access</AlertDialogTitle>
                    <AlertDialogDescription>
                        <div>
                            Sign up and unlock access to all premium features
                            and tools with only a one-time payment.{" "}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Link href="/sign-up">Sign Up</Link>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
