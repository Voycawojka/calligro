import { useContext } from "react";
import { Helmet } from "react-helmet";
import { ProjectContext } from "../contexts/ProjectContext";
import version from "../../../version.txt?raw"

export default function Head() {
    const project = useContext(ProjectContext)

    return (
        <Helmet>
            { !!project
                ? <title>{project.name} - Calligro - {version}</title>
                : <title>Calligro - {version}</title>
            }
        </Helmet>
    )
}
