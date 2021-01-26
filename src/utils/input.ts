export type NumInputValue = number | ''

export function standardizeNumericalInput(input: NumInputValue) : number {
    return input === '' ? 0 : input
}
