const concurrently = require('concurrently')
const path = require('path')

async function main() {
    const { result } = concurrently([
        { command: 'yarn run start:proxy', name: 'PROXY' },
        { 
            command: 'yarn run start:headless',
            name: 'SUT',
            cwd: path.resolve(__dirname, '../admin-app'),
        }
    ], {
        killOthers: ['failure', 'success'],
    })
    try {
        await result
        console.error('process was killed unexpectedly')
        process.exit(198)
    } catch (e) {
        const [proxyRes, sutRes] = e
        if (!proxyRes.killed && proxyRes.exitCode !== 0) {
            console.error('proxy errored out with exit code ' + proxyRes.exitCode)
            process.exit(proxyRes.exitCode)
        }
        if (!sutRes.killed && sutRes.exitCode !== 0) {
            console.error('sut errored out with exit code ' + sutRes.exitCode)
            process.exit(sutRes.exitCode)
        }
    }
}

main()
