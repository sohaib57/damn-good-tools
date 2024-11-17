import { PageHeader } from "@/components/page-header"

export default function ThankYouPage() {
    return (
        <>
            <PageHeader
                heading="Thank You"
                subheading="Thank you for supporting the product by buying premium access. It usually takes a few minutes to receive your payment and upgrade your access."
            />
            <div className="max-w-[500px]">
                In case you want to chat or have any questions, please
                don&rsquo;t hesitate to write to{" "}
                <strong>support@damngood.tools</strong>.
            </div>
        </>
    )
}
