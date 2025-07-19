import React, { useContext, Suspense } from "react";
import { Spinner } from "@blueprintjs/core";
import styles from "./workarea.module.scss"
import { ProjectContext } from "../contexts/ProjectContext";
import EmptyWorkArea from "./EmptyWorkArea";

const LoadedWorkArea = React.lazy(() => import("./LoadedWorkArea"));

export default function WorkAreaContainer() {
    const project = useContext(ProjectContext)

    return (
        <div className={`bp6-card ${styles.container}`}>
           { !!project
            ? (
                <Suspense fallback={<Spinner intent="primary" size={40} />}>
                    <LoadedWorkArea project={project} />
                </Suspense>
            )
            : <EmptyWorkArea />
           }
        </div>
    )
}
