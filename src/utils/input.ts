export type InputValue = number | ''

export function standardizeNumericalInput(input: InputValue) : number {
    return input === '' ? 0 : input
}
