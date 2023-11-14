import AppConfig from "../conf/AppConfig";
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

const WinIni = Global.requireNodeModule<any>('ini');

namespace UsrLocalConfig {
    const {homedir} = Global.requireNodeModule<typeof OS>('os'),
        {existsSync, mkdirSync, writeFileSync, readFileSync} = Global.requireNodeModule<typeof FS>('fs'),
        AppPath: string = homedir() + '\\AppData\\Local\\' + AppConfig.appName,
        AppConfigFilePath: string = AppPath + '\\Config.y.ini';

    function confFileIsExists(): boolean {
        return existsSync(AppConfigFilePath);
    }

    export const getLocalUserConf = (): DefaultUserConfig => {
        if (confFileIsExists())
            return WinIni.parse(readFileSync(AppConfigFilePath, 'utf8'));

        return defaultUserConfig;
    }

    export const setConfig = async (config: Array<{
        key: string | keyof DefaultUserConfig;
        data: DefaultUserConfig[keyof DefaultUserConfig]
    }>): Promise<void> => {
        const data: any = {};

        config.map((i): void => {
            data[i.key] = i.data;
        });
        
        writeFileSync(AppConfigFilePath, WinIni.stringify(data));
    }

    export const keyData = <T extends DefaultUserConfig>(data: T) => {
        const res: Array<{ key: string | keyof T; data: T[keyof T]; }> = [];

        Object.keys(data).map((i): void => {
            res.push({
                key: i,
                data: data[i as keyof T]
            });
        });

        return res;
    }

    export const createLocalUserConfFile = (): void => {
        writeFileSync(AppConfigFilePath, WinIni.stringify(defaultUserConfig), {encoding: 'utf8'});
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
