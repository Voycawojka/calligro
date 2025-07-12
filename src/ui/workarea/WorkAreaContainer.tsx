import { useContext } from "react";
import styles from "./workarea.module.scss"
import { ProjectContext } from "../contexts/ProjectContext";
import LoadedWorkArea from "./LoadedWorkArea";
import EmptyWorkArea from "./EmptyWorkArea";

export default function WorkAreaContainer() {
    const project = useContext(ProjectContext)

    return (
        <div className={`bp6-card ${styles.container}`}>
           { !!project
            ? <LoadedWorkArea project={project} />
            : <EmptyWorkArea />
           }
        </div>
    )
}
