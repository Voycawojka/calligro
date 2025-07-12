import { Switch } from "@blueprintjs/core";
import { ChangeEvent, useContext } from "react";
import { ThemeContext, ThemeSetContext } from "../contexts/ThemeContext";

export default function ThemeSwitch() {
    const theme = useContext(ThemeContext)
    const setTheme = useContext(ThemeSetContext)

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setTheme("light")
        } else {
            setTheme("dark")
        }
    }

    return (
        <Switch
            onChange={onChange}
            innerLabel={ theme === "dark" ? "dark theme" : "light theme" }
            checked={ theme !== "dark" }
            size="large"
        />
    )
}
