import Link from "next/link"
import { CheckCircle2, Flame, Heart, Zap } from "lucide-react"

import { fontHeading } from "@/lib/fonts"
import { buttonVariants } from "@/components/ui/button"
import SenjaEmbed from "@/components/senja-embed"

export default function PricingPage() {
    const pricingPlans = [
        {
            name: "Free",
            price: "$0",
            href: "/sign-up",
            subtitle: "enjoy basic features",
            highlight: false,
            callToAction: "Get Started",
            features: [
                "Limited, but free access to most of the tools",
                "Email support (48+ hours wait time)",
            ],
        },
        {
            name: "Premium",
            upcomingPrice: "$75",
            price: "$47",
            href: "/sign-up",
            subtitle: "a one-time payment",
            highlight: true,
            callToAction: "Get Started",
            features: [
                "Access to premium tools and features",
                "Enjoy early %40 discount",
                "Shape the product for you",
                "No ads",
                "Direct chat with the founder",
                "Support the product development",
                "Priority chat support",
            ],
        },
    ]

    return (
        <>
            <div className="flex flex-col items-center gap-10 text-center">
                <h1
                    className={`text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl ${fontHeading.variable}`}
                >
                    Pay once. Enjoy daily.
                </h1>
                <p className="max-w-[500px] text-lg text-muted-foreground sm:text-xl">
                    Start for free and get premium access with only a one-time
                    payment once you need it.
                </p>
            </div>
            <div className="mt-10 flex flex-row flex-wrap gap-5 px-20 justify-center">
                {pricingPlans.map((p) => (
                    <div
                        className={`shadow dark:border dark:border-slate-800 rounded-3xl flex flex-col items-center p-5 min-w-[350px] ${
                            p.highlight && "shadow-lg"
                        }`}
                    >
                        <div className="text-sm flex flex-row gap-2 items-center">
                            {p.name.toLowerCase() == "premium" ? (
                                <Zap className="w-5 h-5 text-red-500 dark:text-red-700" />
                            ) : (
                                <Flame className="w-5 h-5 text-slate-500 dark:text-slate-700" />
                            )}
                            {p.name}
                        </div>
                        <div className="mt-5 text-3xl font-bold tracking-tight flex flex-row gap-2">
                            {p.upcomingPrice && (
                                <span className="line-through text-muted-foreground">
                                    {p.upcomingPrice}
                                </span>
                            )}
                            <span>{p.price}</span>
                        </div>
                        {p.subtitle && (
                            <div className="mt-2 text-muted-foreground">
                                {p.subtitle}
                            </div>
                        )}
                        <div className="mt-5 w-full">
                            <Link
                                href={p.href}
                                className={`${buttonVariants({
                                    variant: "default",
                                })} w-full`}
                            >
                                {p.callToAction}
                            </Link>
                        </div>
                        {p.features.length > 0 && (
                            <div className="mt-5 w-full text-sm flex flex-col gap-2">
                                {p.features.map((f) => (
                                    <div className="flex flex-row gap-2 items-center">
                                        {f.startsWith("Support the product") ? (
                                            <Heart className="text-red-500 dark:text-red-700 w-5 h-5" />
                                        ) : (
                                            <CheckCircle2 className="text-green-400 dark:text-green-800 w-5 h-5" />
                                        )}
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {process.env.NEXT_PUBLIC_SENJA_WALL_WIDGET_ID && (
                <div className="mt-20 flex flex-col items-center gap-10 text-center">
                    <h1
                        className={`text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl ${fontHeading.variable}`}
                    >
                        Beyond Expectations
                    </h1>
                    <p className="max-w-[500px] text-lg text-muted-foreground sm:text-xl">
                        People love using Damn Good Tools daily.
                    </p>
                </div>
            )}
            {process.env.NEXT_PUBLIC_SENJA_WALL_WIDGET_ID && (
                <div>
                    <div className="flex flex-row gap-5 items-center justify-center my-10">
                        <a
                            key="day"
                            href="https://www.producthunt.com/posts/damn-good-tools?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-damn&#0045;good&#0045;tools"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img
                                src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=395421&theme=neutral&period=daily"
                                alt="Damn&#0032;Good&#0032;Tools - Easy&#0045;to&#0045;use&#0044;&#0032;fun&#0032;productivity&#0032;tools&#0032;&#0045;&#0032;free&#0032;&#0038;&#0032;open&#0045;source | Product Hunt"
                                style={{ width: "250px", height: "54px" }}
                                width="250"
                                height="54"
                            />
                        </a>
                        <a
                            key="month"
                            href="https://www.producthunt.com/posts/damn-good-tools?utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-damn&#0045;good&#0045;tools"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img
                                src="https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=395421&theme=neutral&period=monthly&topic_id=267"
                                alt="Damn&#0032;Good&#0032;Tools - Easy&#0045;to&#0045;use&#0044;&#0032;fun&#0032;productivity&#0032;tools&#0032;&#0045;&#0032;free&#0032;&#0038;&#0032;open&#0045;source | Product Hunt"
                                style={{ width: "250px", height: "54px" }}
                                width="250"
                                height="54"
                            />
                        </a>
                    </div>
                    <SenjaEmbed
                        widgetId={process.env.NEXT_PUBLIC_SENJA_WALL_WIDGET_ID}
                    />
                </div>
            )}
        </>
    )
}
