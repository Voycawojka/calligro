import { useContext } from "react";
import styles from "./workarea.module.scss"
import { ProjectContext } from "../ProjectContext";
import LoadedWorkArea from "./LoadedWorkArea";
import EmptyWorkArea from "./EmptyWorkArea";

export default function WorkAreaContainer() {
    const project = useContext(ProjectContext)

    return (
        <div className={styles.container}>
           { !!project
            ? <LoadedWorkArea project={project} />
            : <EmptyWorkArea />
           }
        </div>
    )
}
