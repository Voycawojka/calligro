import { Dialog, DialogBody, DialogFooter, Button, AnchorButton, ButtonGroup, Card } from "@blueprintjs/core";
import version from "../../../../version.txt?raw"
import { isElectron } from "../../../electron/electronInterop";

export interface Props {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function AboutDialog({ isOpen, setIsOpen }: Props) {
    const onClose = () => {
        setIsOpen(false)
    }

    return (
        <Dialog
            title="About"
            icon="info-sign"
            isOpen={isOpen}
            onClose={onClose}
        >
            <DialogBody>
                <p>
                    Calligro, version: <strong>{version} ({isElectron() ? "desktop" : "web"})</strong>
                </p>
                <Card>
                    <p>
                        Developed and maintained by <strong>Filip Artur Kowalski</strong>
                    </p>
                    <ButtonGroup>
                        <AnchorButton icon="globe-network" href="https://ideasalmanac.com" target="_blank" text="Website" />
                        <AnchorButton icon="git-branch" href="https://github.com/Voycawojka" target="_blank" text="Github" />
                        <AnchorButton icon="team" href="https://bsky.app/profile/ideasalmanac.bsky.social" target="_blank" text="Bluesky" />
                    </ButtonGroup>
                </Card>
                <Card>
                    <p>
                        Special thanks to <strong>Dominik Józefiak</strong> for co-developing Calligro 1
                    </p>
                    <ButtonGroup>
                        <AnchorButton icon="git-branch" href="https://github.com/domlj" target="_blank" text="Github" />
                    </ButtonGroup>
                </Card>
            </DialogBody>
            <DialogFooter actions={
                <>
                    <Button intent="primary" text="Ok" onClick={onClose} />
                </>
            } />
        </Dialog>
    )
}
