export interface Tool {
    slug: string
    name: string
    description: string
    icon: React.ReactElement
}

export type PremiumProperties<T> = {
    [P in keyof T]: boolean
}

export const tools: Tool[] = []
