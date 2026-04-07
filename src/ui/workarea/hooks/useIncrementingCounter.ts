import { useCallback, useEffect, useState } from "react"

export function useIncrementingCounter(increment: number, intervalMs: number): number {
    const [counter, setCounter] = useState(0)

    const incrementCounter = useCallback(() => setCounter(prev => prev + increment), [increment])
    
    useEffect(() => {
        const interval = setInterval(incrementCounter, intervalMs)
        return () => clearInterval(interval)
    }, [incrementCounter, intervalMs])

    return counter
}
