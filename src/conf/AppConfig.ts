// @ts-ignore
const os = eval('require(\'os\');');

export default {
    appName: 'lmo-Transform',
    appAuthor: 'ayuanlmo',
    appleTitle: 'lmo-Transform',
    storageOptions: {
        namespace: '__lmo__',
        storage: 'local'
    },
    version: '1.0.0 Beta',
    ca: 'x64',
    system: {
        tempPath: `${os.tmpdir().split('\\').join('/')}/`,
        homeDir: `${os.homedir().split('\\').join('/')}/`,
        cpu: os.cpus()
    },
    openSource: {
        github: 'https://github.com/ayuanlmo/lmo-transform'
    }
}
