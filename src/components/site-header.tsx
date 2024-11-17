import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"

import { UserAccountNav } from "./user-account-nav"

interface SiteHeaderProps {
    user?: {
        premium: boolean
        email?: string | null
    }
}

export function SiteHeader({ user }: SiteHeaderProps) {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <MainNav items={siteConfig.mainNav} />
                <div className="flex flex-1 items-center justify-end space-x-4">
                    {user ? (
                        <UserAccountNav user={user} />
                    ) : (
                        <nav className="flex items-center space-x-1">
                            <Link
                                href={siteConfig.links.signIn}
                                className={cn(
                                    buttonVariants({
                                        variant: "secondary",
                                        size: "sm",
                                    }),
                                    "px-4"
                                )}
                            >
                                Sign In
                            </Link>
                        </nav>
                    )}
                </div>
            </div>
        </header>
    )
}
