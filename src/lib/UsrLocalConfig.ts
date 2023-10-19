import AppConfig from "../conf/AppConfig";
import {ToString} from "../utils";
import * as OS from 'os';
import * as FS from 'fs';
import Global from "./Global";

type PlayerTypes = 'ffplay' | 'vlc' | 'wmp';

interface DefaultUserConfig {
    output_path: string;
    parallel_tasks_length: number;
    use_hardware_acceleration: boolean;
    player: PlayerTypes,
    vlc_media_player_local_path: string;
    windows_media_player_local_path: string;
}

const defaultUserConfig: DefaultUserConfig = {
    output_path: `${AppConfig.system.tempPath}${AppConfig.appName}`, // 输出路径
    parallel_tasks_length: 2, // 并行任务个数
    use_hardware_acceleration: false, // 使用硬件加速
    player: 'ffplay', // 播放器类型
    vlc_media_player_local_path: '', // vlc播放器路径
    windows_media_player_local_path: 'C:/Program Files (x86)/Windows Media Player/wmplayer.exe' // Windows media player路径
} as const;

namespace UsrLocalConfig {
    const {homedir} = Global.requireNodeModule<typeof OS>('os'),
        {existsSync, mkdirSync, writeFileSync, readFileSync} = Global.requireNodeModule<typeof FS>('fs'),
        AppPath: string = homedir() + '\\AppData\\Local\\' + AppConfig.appName,
        AppConfigFilePath: string = AppPath + '\\user-conf.y.json';

    function confFileIsExists(): boolean {
        return existsSync(AppConfigFilePath);
    }

    export const getLocalUserConf = <T>(key: keyof DefaultUserConfig | '' = ''): DefaultUserConfig | string | boolean | number | T => {
        if (confFileIsExists()) {
            const data: DefaultUserConfig = JSON.parse(readFileSync(AppConfigFilePath, 'utf8')) as DefaultUserConfig;

            if (key === '')
                return data;

            return data[key] as string;
        }
        return defaultUserConfig;
    }

    export const createLocalUserConfFile = (key: keyof DefaultUserConfig | '' | object = '', value: any = ''): void => {
        let data: DefaultUserConfig | {} = {};

        if (typeof key === 'object') {
            data = {...defaultUserConfig, ...key};
        } else {
            if (key !== '' && value !== '')
                data = {...defaultUserConfig, [key as string]: value};
            else
                data = getLocalUserConf();
        }

        writeFileSync(AppConfigFilePath, ToString(data), {encoding: 'utf8'});
    }

    ((): void => {
        if (!existsSync(AppPath))
            mkdirSync(AppPath);

        if (!confFileIsExists())
            createLocalUserConfFile();
    })();
}

export {defaultUserConfig};
export {DefaultUserConfig};
export {PlayerTypes};
export default UsrLocalConfig;
