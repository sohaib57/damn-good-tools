import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface PaywallModalState {
    open: boolean
    setOpen: (boolean) => void
    show: () => void
    hide: () => void
}

export const usePaywallModalStore = create<PaywallModalState>()(
    devtools(
        (set) => ({
            open: false,
            show: () => set((state) => ({ open: true })),
            hide: () => set((state) => ({ open: false })),
            setOpen: (open: boolean) => set((state) => ({ open })),
        }),
        {
            name: "paywall-storage",
        }
    )
)
