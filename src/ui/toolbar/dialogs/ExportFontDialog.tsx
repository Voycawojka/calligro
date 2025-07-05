import { Dialog, DialogBody, DialogFooter, Button, OverlayToaster, RadioGroup, RadioCard, Classes } from "@blueprintjs/core";
import { FormEvent, useContext, useState } from "react";
import { ProjectContext } from "../../ProjectContext";
import { saveFont } from "../../../filesystem/fontstore";

export interface Props {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function ExportFontDialog({ isOpen, setIsOpen }: Props) {
    const [selectedFormat, setSelectedFormat] = useState("txt" as "txt" | "xml")

    const currentProject = useContext(ProjectContext)

    const onFormatSelected = (e: FormEvent<HTMLInputElement>) => {
        setSelectedFormat(e.currentTarget.value as "txt" | "xml")
    }

    const onClose = () => {
        setIsOpen(false)
    }

    const onExport = async () => {
        onClose()

        try {
            if (!currentProject) {
                throw new Error("No project to export a font from")
            }

            await saveFont(currentProject, selectedFormat)

            const toaster = await OverlayToaster.create({ position: "top-right" })
            toaster.show({
                intent: "success",
                message: "Exported font"
            })
        } catch (e: any) {
            const toaster = await OverlayToaster.create({ position: "top-right" })
            toaster.show({
                icon: "error",
                intent: "danger",
                message: (e as Error).message
            })
        }
    }

    return (
        <Dialog
            title="Export font"
            icon="generate"
            isOpen={isOpen}
            onClose={onClose}
        >
            <DialogBody>
                <RadioGroup
                    selectedValue={selectedFormat}
                    onChange={onFormatSelected}
                    label="Format"
                >
                    <RadioCard label="TXT" value="txt">
                        TXT
                        <br />
                        <span className={`${Classes.TEXT_MUTED} ${Classes.TEXT_SMALL}`}>
                            Supported by Godot, LibGDX, LÖVE, Heaps.io and possibly others
                        </span>
                    </RadioCard>
                    <RadioCard label="XML" value="xml">
                        XML
                        <br />
                        <span className={`${Classes.TEXT_MUTED} ${Classes.TEXT_SMALL}`}>
                            Supported by Phaser, HaxeFlixel and possibly others
                        </span>
                    </RadioCard>
                </RadioGroup>
            </DialogBody>
            <DialogFooter actions={
                <>
                    <Button text="Cancel" onClick={onClose} />
                    <Button intent="primary" text="Export" onClick={onExport} />
                </>
            } />
        </Dialog>
    )
}
