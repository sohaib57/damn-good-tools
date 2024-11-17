import { getCurrentUser } from "@/lib/session"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

interface AppLayoutProps {
    children: React.ReactNode
}

export default async function AppLayout({ children }: AppLayoutProps) {
    const user = await getCurrentUser()

    return (
        <div className="relative flex min-h-screen flex-col">
            <SiteHeader user={user} />
            <div className="flex-1">
                <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
                    {children}
                </section>
            </div>
            <SiteFooter />
        </div>
    )
}
