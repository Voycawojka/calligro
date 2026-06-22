import { Dialog, DialogBody, DialogFooter, Button, OverlayToaster, RadioGroup, RadioCard, Classes, InputGroup, FormGroup } from "@blueprintjs/core";
import { FormEvent, useContext, useState } from "react";
import { ProjectContext, ProjectMutContext } from "../../contexts/ProjectContext";
import { saveFontWithPicker } from "../../../filesystem/fontstore";

export interface Props {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function ExportFontDialog({ isOpen, setIsOpen }: Props) {
    const currentProject = useContext(ProjectContext)
    const { setProjectData } = useContext(ProjectMutContext)

    const [selectedFormat, setSelectedFormat] = useState<"txt" | "xml">("txt")
    const [selectedName, setSelectedName] = useState(currentProject?.name ?? "calligro-custom")


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

            const fontHandles = await saveFontWithPicker(currentProject, selectedName, selectedFormat)

            setProjectData({
                ...currentProject,
                lastExportedFont: {
                    handles: fontHandles,
                    format: selectedFormat,
                    name: selectedName,
                },
            })

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
            console.error(e)
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

                <br />
                <FormGroup label="Font Name">
                    <InputGroup id="selected-name" placeholder="Font Name" value={selectedName} onValueChange={setSelectedName} />
                </FormGroup>

                <div className="bp6-running-text">
                    <p>
                        Calligro will produce the following files:
                    </p>
                    <ul>
                        <li><code>{selectedName}.{selectedFormat}</code></li>
                        <li><code>{selectedName}.png</code></li>
                    </ul>
                </div>
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
