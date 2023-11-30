import {createHash, Hash} from 'crypto';
import * as FS from 'fs';

((): void => {
    try {
        const HASH_MD5: Hash = createHash('md5'),
            HASH_SHA256: Hash = createHash('sha256'),
            FILE: string = FS.readdirSync('../dist').filter((i: string) => {
                if (!i.includes('blockmap'))
                    return i.includes('lmo-Transform Setup')
            })[0];

        FS.createReadStream('../dist/' + FILE).on('data', (_DATA: BufferEncoding): void => {
            HASH_MD5.update(_DATA);
            HASH_SHA256.update(_DATA);
        }).on('end', (): void => {
            const MD5: string = HASH_MD5.digest('hex').toUpperCase(),
                SHA: string = HASH_SHA256.digest('hex').toUpperCase();

            try {
                FS.writeFileSync(`../dist/lmo-Transform-MD5.txt`, MD5, {encoding: 'utf8'});
                FS.writeFileSync(`../dist/lmo-Transform-SHA-256.txt`, SHA, {encoding: 'utf8'});
                console.log('\n Generate hash finish...');
            } catch (_E) {
                throw _E;
            }

            require('process').exit();
        });
    } catch (e) {
        throw e;
    }
})();
