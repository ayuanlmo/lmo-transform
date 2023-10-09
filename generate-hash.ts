import {createHash, Hash} from 'crypto';
import * as FS from 'fs';

((): void => {
    let isExists: boolean = false;

    const FILE_NAME: string = 'lmo-Transform Setup.exe',
        FILE_PATH: string = './dist/' + FILE_NAME,
        HASH_MD5: Hash = createHash('md5'),
        HASH_SHA256: Hash = createHash('sha256');

    const Generate: Function = (): void => {
        FS.createReadStream(FILE_PATH).on('data', (_DATA: BufferEncoding): void => {
            HASH_MD5.update(_DATA);
            HASH_SHA256.update(_DATA);
        }).on('end', (): void => {
            const MD5: string = HASH_MD5.digest('hex').toUpperCase(),
                SHA: string = HASH_SHA256.digest('hex').toUpperCase();

            try {
                FS.writeFileSync(`./dist/lmo-Transform-MD5.txt`, MD5, {encoding: 'utf8'});
                FS.writeFileSync(`./dist/lmo-Transform-SHA-256.txt`, SHA, {encoding: 'utf8'});
                console.log('\n Generate hash finish...');
            } catch (_E) {
                throw _E;
            }

            require('process').exit();
        });
    }

    const WaitFileExists: Function = (): Promise<boolean> => {
        return new Promise((resolve): void => {
            const _ = (): void => {
                if (isExists) {
                    resolve(isExists);
                } else {
                    const list: string[] = FS.readdirSync('./dist') as string[];
                    for (let i: number = 0; i < list.length; i++) {
                        const item: string = list[i];

                        if (!item.includes('blockmap')) {
                            if (item.includes('exe') && item.includes('lmo-Transform Setup')) {
                                FS.renameSync('./dist/' + item, './dist/' + FILE_NAME);
                                isExists = true;

                                setTimeout((): void => {
                                    resolve(isExists);
                                }, 500);
                                return;
                            }
                        }
                    }
                    setTimeout(_, 500);
                }
            }
            _();
        });
    }

    WaitFileExists().then((): void => {
        Generate();
    });
})();
