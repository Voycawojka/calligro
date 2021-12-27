export async function yieldIteration(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 0))
}
