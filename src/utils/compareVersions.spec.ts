import { compareVersions } from "./compareVersions"

test('compares versions properly', () => {
    expect(compareVersions('0.0.1', '0.0.1')).toBe('equal')
    expect(compareVersions('0.1.0', '0.1.0')).toBe('equal')
    expect(compareVersions('1.0.0', '1.0.0')).toBe('equal')
    expect(compareVersions('0.1.1', '0.1.1')).toBe('equal')
    expect(compareVersions('1.1.0', '1.1.0')).toBe('equal')
    expect(compareVersions('1.0.1', '1.0.1')).toBe('equal')

    expect(compareVersions('0.1.0', '0.0.1')).toBe('greater')
    expect(compareVersions('1.0.0', '0.1.0')).toBe('greater')
    expect(compareVersions('1.1.0', '0.1.1')).toBe('greater')
    expect(compareVersions('0.0.12', '0.0.9')).toBe('greater')
    expect(compareVersions('0.3.0', '0.2.99')).toBe('greater')

    expect(compareVersions('0.0.1', '0.1.0')).toBe('lesser')
    expect(compareVersions('0.1.0', '1.0.0')).toBe('lesser')
    expect(compareVersions('0.1.1', '1.1.0')).toBe('lesser')
    expect(compareVersions('0.0.9', '0.0.12')).toBe('lesser')
    expect(compareVersions('0.2.99', '0.3.0')).toBe('lesser')
})