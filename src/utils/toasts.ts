import { IconName, OverlayToaster, ToastProps, Toaster } from "@blueprintjs/core"

let toasterPromise: Promise<Toaster> | null = null

function getToaster(): Promise<Toaster> {
    toasterPromise ??= OverlayToaster.create({ position: "top-right" })
    return toasterPromise
}

export async function showToast(props: ToastProps): Promise<void> {
    const toaster = await getToaster()
    toaster.show(props)
}

export function showSuccessToast(message: string, icon?: IconName): Promise<void> {
    return showToast({ intent: "success", message, icon })
}

export function showErrorToast(error: unknown, prefix?: string): Promise<void> {
    console.error(error)

    const detail = error instanceof Error ? error.message : String(error)
    return showToast({
        icon: "error",
        intent: "danger",
        message: prefix ? `${prefix}: ${detail}` : detail,
    })
}
