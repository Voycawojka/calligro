import { Button, Tooltip } from "@blueprintjs/core"
import { Icon } from "@blueprintjs/core"

export default function UpdaterIcon({ onClick }: { onClick: () => void }) {
    return (
        <Tooltip content="New version available!" position="bottom">
            <Button variant="minimal" icon={<Icon icon="updated" intent="warning" />} onClick={onClick} />
        </Tooltip>
    )
}
