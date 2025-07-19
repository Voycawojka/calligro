import { test, expect, afterEach, vi } from 'vitest'
import nock from 'nock'
import { fetchNewerVersion } from './latestVesion'

function mockItchLatest(channelName: string): nock.Interceptor {
    return nock('https://itch.io')
        .get('/api/1/x/wharf/latest')
        .query({ target: 'voycawojka/calligro', channel_name: channelName })
}

function mockGithubTag(tag: string): nock.Interceptor {
    return nock('https://api.github.com')
        .get(`/repos/voycawojka/calligro/releases/tags/${tag}`)
}

function mockItchLatestError() {
    nock('https://itch.io')
        .get('/api/1/x/wharf/latest')
        .replyWithError('Cannot fetch latest version information')
}

const responseHeaders = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }

afterEach(() => {
    nock.cleanAll()
})

test('version is up to date when itch version matches local version', async () => {
    mockItchLatest('win-64').reply(200, { latest: '1.2.3' }, responseHeaders)

    const newVersion = await fetchNewerVersion('1.2.3', 'win-64')
    
    expect(newVersion).not.toBeNull()
    expect(newVersion.type).toEqual('up_to_date')
})

test('version is up to date when itch version is lower than local version', async () => {
    mockItchLatest('win-64').reply(200, { latest: '1.2.2' }, responseHeaders)

    const newVersion = await fetchNewerVersion('1.2.3', 'win-64')

    expect(newVersion).not.toBeNull()
    expect(newVersion.type).toEqual('up_to_date')
})

test('version is up to date when itch version data is unavailable and error is logged', async () => {
    console.error = vi.fn()
    mockItchLatestError()

    const newVersion = await fetchNewerVersion('1.2.3', 'win-64')

    expect(newVersion).not.toBeNull()
    expect(newVersion.type).toEqual('up_to_date')
    expect(console.error).toBeCalled()
})

test('new version is available when itch version is greater than local version', async () => {
    mockItchLatest('win-64').reply(200, { latest: '1.2.4' }, responseHeaders)
    mockGithubTag('v1.2.4').reply(200, { name: 'Test', body: '- nothing changed' }, responseHeaders)

    const newVersion = await fetchNewerVersion('1.2.3', 'win-64')

    expect(newVersion).not.toBeNull()
    expect(newVersion.type).toEqual('new_available')

    if (newVersion.type === 'new_available') {
        expect(newVersion.name).toEqual('Test')
        expect(newVersion.body).toEqual('- nothing changed')
        expect(newVersion.version).toEqual('1.2.4')
    }
})

test('new version is available when itch version is greater than local version for legacy tag convention', async () => {
    mockItchLatest('win-64').reply(200, { latest: '0.1.5' }, responseHeaders)
    mockGithubTag('v.0.1.5').reply(200, { name: 'Test', body: '- nothing changed' }, responseHeaders)

    const newVersion = await fetchNewerVersion('0.0.5', 'win-64')

    expect(newVersion).not.toBeNull()
    expect(newVersion.type).toEqual('new_available')

    if (newVersion.type === 'new_available') {
        expect(newVersion.name).toEqual('Test')
        expect(newVersion.body).toEqual('- nothing changed')
        expect(newVersion.version).toEqual('0.1.5')
    }
})

test('version is up to date when github version data is unavailable and error is logged', async () => {
    mockItchLatest('win-64').reply(200, { latest: '1.3.0' }, responseHeaders)
    mockGithubTag('no').reply(200)

    console.error = vi.fn()

    const newVersion = await fetchNewerVersion('1.2.7', 'win-64')

    expect(newVersion).not.toBeNull()
    expect(newVersion.type).toEqual('up_to_date')
    expect(console.error).toBeCalled()
})
