"use client"

import Link from "next/link"
import { Github, LifeBuoy, LogOut, Zap } from "lucide-react"
import { signOut } from "next-auth/react"

import { generateCheckoutUrl } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Icons } from "./icons"

interface UserAccountNavProps {
    user?: {
        id?: string | null
        premium: boolean
        email?: string | null
    }
}

export function UserAccountNav({ user }: UserAccountNavProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted cursor-pointer">
                    <span className="sr-only">{user?.email}</span>

                    <Icons.user
                        className={`h-4 w-4 ${
                            user?.premium && "text-red-500 dark:text-red-700"
                        }`}
                    />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                {!user?.premium && <DropdownMenuSeparator />}
                {!user?.premium && (
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Link
                                href={generateCheckoutUrl(user?.id, user?.email)}
                                target="_blank"
                                className="flex flex-row gap-2 items-center"
                            >
                                <Zap className="h-4 w-4 text-red-500 dark:text-red-700" />
                                <span>Upgrade to Premium</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link
                            href="https://github.com/krasun/damngood.tools"
                            target="_blank"
                            className="flex flex-row gap-2 items-center"
                        >
                            <Github className="h-4 w-4" />
                            GitHub
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={(event) => {
                            if (user?.email) {
                                $crisp.push([
                                    "set",
                                    "user:email",
                                    [user?.email],
                                ])
                                $crisp.push(["do", "chat:open"])
                            }
                        }}
                    >
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        <span>Support</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(event) => {
                        event.preventDefault()
                        signOut({
                            callbackUrl: `${window.location.origin}/sign-in`,
                        })
                    }}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
