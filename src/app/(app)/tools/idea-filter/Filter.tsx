"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogClose } from "@radix-ui/react-dialog"
import {
    CheckCircle,
    HelpCircle,
    Loader2,
    Plus,
    Trash2,
    XCircle,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { unknown } from "zod"

import { FilterIdeaRequest, FilterIdeaRequestSchema } from "@/lib/schema"
import { IdeaFilter } from "@/lib/shared"
import { AlertDialog } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface IdeaFilterProps {
    filter: IdeaFilter
    onDeleteFilter: (key: string) => void
}

function RenderIdeaFilter({
    filter: { key, state, text, explanation },
    onDeleteFilter,
}: IdeaFilterProps) {
    return (
        <div className="flex flex-row items-center gap-2">
            <div>{<StateIcon state={state} />}</div>
            <div className="grow min-w-[300px] md:min-w-[600px]">
                <div
                    className={
                        state === true
                            ? "text-green-500"
                            : state === false
                            ? "text-red-500 line-through"
                            : ""
                    }
                >
                    {text}
                </div>
                {explanation && (
                    <div className="text-sm text-muted-foreground">
                        {explanation}
                    </div>
                )}
            </div>
            <div>
                <Trash2
                    className="text-destructive hover:cursor-pointer w-4 h-4"
                    onClick={() => onDeleteFilter(key)}
                />
            </div>
        </div>
    )
}

function StateIcon({ state }: { state: "unknown" | true | false }) {
    if (state === true) {
        return <CheckCircle className="w-5 h-5 text-green-500" />
    }

    if (state === false) {
        return <XCircle className="w-5 h-5 text-red-500" />
    }

    if (state === "unknown") {
        return <HelpCircle className="w-5 h-5 text-muted-foreground" />
    }

    return <HelpCircle className="w-5 h-5 text-muted-foreground" />
}

function AddFilterDialog({ onAdded }: { onAdded: (filter: string) => void }) {
    const [filter, setFilter] = useState<string>("")

    return (
        <Dialog onOpenChange={() => setFilter("")}>
            <DialogTrigger asChild>
                <Button type="button" variant="secondary">
                    + Add one more
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Add one more idea filter</DialogTitle>
                    <DialogDescription>
                        Describe what you want to achieve with the idea so that
                        it can be easily filtered if it does not fit.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="text" className="text-left">
                            Filter
                        </Label>
                        <Input
                            id="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder="I don't need $1,000,000 to make it happen."
                            className="w-full"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            onClick={() => {
                                onAdded(filter)
                            }}
                        >
                            Add
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function Filter() {
    const [ideaFilters, setIdeaFilters] = useState<IdeaFilter[]>([
        {
            key: "solo",
            state: "unknown",
            text: "I can execute the idea solo, and I don't need to hire a team.",
        },
        {
            key: "funding",
            state: "unknown",
            text: "I don't need funding for it—it can be bootstrapped from my pocket.",
        },
        {
            key: "revenue",
            state: "unknown",
            text: "It can grow to at least $10,000 MRR in the next 12-36 months.",
        },
        {
            key: "mvp",
            state: "unknown",
            text: "It is easy to build in six weeks if I know client and server-side development.",
        },
    ])

    const deleteFilter = (key: string) => {
        if (ideaFilters.length == 1) {
            toast({
                variant: "destructive",
                title: "Uh oh! The filter can't be deleted.",
                description: "At least one filter required.",
            })
            return
        }

        setIdeaFilters((filters) => filters.filter((f) => f.key != key))
    }

    const addFilter = (f: string) => {
        setIdeaFilters((filters) => [
            ...filters,
            {
                state: "unknown",
                text: f,
                key: f.replace(/[^\w]/g, ""),
            },
        ])
    }

    const { toast } = useToast()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FilterIdeaRequest>({
        resolver: zodResolver(FilterIdeaRequestSchema),
        defaultValues: {
            text: "",
            filters: [],
        },
    })

    const [processing, setProcessing] = useState<boolean>(false)
    const onSubmit = async (data: FilterIdeaRequest) => {
        setProcessing(true)

        try {
            const response = await fetch("/tools/idea-filter/api", {
                method: "POST",
                body: JSON.stringify({ ...data, filters: ideaFilters }),
            })
            setProcessing(false)

            if (response.ok) {
                const result = (await response.json()) as {
                    success: boolean
                    result?: {
                        filters?: IdeaFilter[]
                    }
                }

                if (
                    result.success &&
                    result.result &&
                    result.result.filters &&
                    result.result.filters.length > 0
                ) {
                    setIdeaFilters(result.result.filters)

                    return
                }
            }

            throw new Error("Failed to filter idea")
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            })
        }

        setProcessing(false)
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col md:flex-row gap-10"
        >
            <div className="max-w-[400px] md:max-w-[500px]">
                <div className="grid w-full items-center gap-2">
                    <Label htmlFor="website">Describe your idea</Label>
                    <Textarea
                        id="text"
                        rows={10}
                        className="text-md w-[400px] md:w-[500px] h-[200px]"
                        placeholder="Enter your idea here..."
                        {...register("text")}
                    />
                    {errors.text && errors.text?.message && (
                        <p className="text-sm text-destructive">
                            {errors.text?.message}
                        </p>
                    )}
                </div>
                <div className="flex justify-end mt-2">
                    <Button type="submit" disabled={processing}>
                        {processing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            "Verify"
                        )}
                    </Button>
                </div>
            </div>
            <div>
                <div className="flex flex-row items-center gap-2">
                    <span>Filters</span>
                    <AddFilterDialog onAdded={(f) => addFilter(f)} />
                </div>
                <div className="flex flex-col gap-5 mt-5">
                    {ideaFilters.map((f) => (
                        <RenderIdeaFilter
                            key={f.key}
                            filter={f}
                            onDeleteFilter={deleteFilter}
                        />
                    ))}
                </div>
            </div>
        </form>
    )
}
