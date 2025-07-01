import { NonIdealState } from "@blueprintjs/core";

export default function EmptyWorkArea() {
    return (
        <NonIdealState
            layout="vertical"
            icon="application"
            title="No project open"
            description="Use the 'File' menu to open or create a new project!"
        />
    )
}
