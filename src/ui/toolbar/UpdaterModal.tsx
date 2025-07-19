import { Dialog, DialogBody, DialogFooter, Button, Callout } from "@blueprintjs/core"
import ReactMarkdown from "react-markdown"
import { UpdaterInfo } from "./useUpdater"

export interface UpdaterModalProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    versionInfo: UpdaterInfo
}

export default function UpdaterModal({ isOpen, setIsOpen, versionInfo }: UpdaterModalProps) {
    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="New version available" icon="updated">
            <DialogBody>
                <Callout>
                    <div>
                        <strong>Current version:</strong> {versionInfo.currentVersion}
                    </div>
                    <div>
                        <strong>Update available:</strong> {versionInfo.newVersion}, {versionInfo.newVersionName}
                    </div>
                </Callout>
                <br />
                <ReactMarkdown>{versionInfo.newVersionDescription ? `**Changelog:**\n${versionInfo.newVersionDescription}` : ""}</ReactMarkdown>
            </DialogBody>
            <DialogFooter actions={
                <>
                    <Button onClick={() => setIsOpen(false)}>Close</Button>
                    <a href="https://voycawojka.itch.io/calligro" target="_blank" rel="noopener noreferrer">
                        <Button intent="primary">Download From Itch</Button>
                    </a>
                </>
            } />
        </Dialog>
    )
}
