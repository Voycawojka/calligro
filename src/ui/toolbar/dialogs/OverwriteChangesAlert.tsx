import { Alert } from "@blueprintjs/core";

export interface Props {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    onAccepted: () => void
}

export default function OverwriteChangesAlert({ isOpen, setIsOpen, onAccepted }: Props) {
    const onConfirm = () => {
        setIsOpen(false)
        onAccepted()
    }

    return (
        <Alert
            isOpen={isOpen}
            confirmButtonText="Discard and open"
            cancelButtonText="Cancel"
            intent="warning"
            onCancel={() => setIsOpen(false)}
            onConfirm={onConfirm}
        >
            <p>
                You have unsaved changes. Are you sure you want to open another project?
            </p>
        </Alert>
    )
}
