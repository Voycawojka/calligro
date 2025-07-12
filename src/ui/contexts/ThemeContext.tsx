import { createContext, PropsWithChildren, useState } from "react";

export type Theme = "dark" | "light"

export const ThemeContext = createContext<Theme>("dark")
export const ThemeSetContext = createContext((_: Theme) => {})


export interface Props extends PropsWithChildren {}

export default function ThemeContextRoot({ children }: Props) {
    const defaultTheme = (window.localStorage.getItem("theme") ?? "dark") as Theme
    const [theme, setTheme] = useState<Theme>(defaultTheme)

    const setThemeAndRemember = (newTheme: Theme) => {
        setTheme(newTheme)
        window.localStorage.setItem("theme", newTheme)
    }

    return (
        <ThemeSetContext.Provider value={setThemeAndRemember}>
            <ThemeContext.Provider value={theme}>
                <div className={theme === "dark" ? "bp6-dark" : ""}>
                    {children}
                </div>
            </ThemeContext.Provider>
        </ThemeSetContext.Provider>
    )
}
