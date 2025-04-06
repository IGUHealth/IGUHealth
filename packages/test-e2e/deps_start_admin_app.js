const concurrently = require('concurrently')
const path = require('path')

async function main() {
    const { result } = concurrently([
        { command: 'yarn run start:proxy', name: 'PROXY' },
        { 
            command: (
                'yarn workspaces foreach -ptR --topological-dev --from @iguhealth/admin-app run build && ' +
                'http-server ../admin-app -p 3001'
            ),
            name: 'SUT',
            cwd: path.resolve(__dirname, '../admin-app'),
        }
    ], {
        killOthers: ['failure', 'success'],
    })

    let r
    try {
        r = await result
    } catch (e) {
        r = e
    }

    const [proxyRes, sutRes] = r
    if (!proxyRes.killed && proxyRes.exitCode !== 0) {
        console.error('proxy errored out with exit code ' + proxyRes.exitCode)
        process.exit(proxyRes.exitCode)
    }
    if (!sutRes.killed && sutRes.exitCode !== 0) {
        console.error('sut errored out with exit code ' + sutRes.exitCode)
        process.exit(sutRes.exitCode)
    }
}

main()
