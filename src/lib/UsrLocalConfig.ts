import AppConfig from "../conf/AppConfig";
import {ToString} from "../utils";

interface DefaultUserConfig {
    output_path: string;
    parallel_tasks_length: number;
    use_hardware_acceleration: boolean;
}

const defaultUserConfig: DefaultUserConfig = {
    output_path: '',
    parallel_tasks_length: 2,
    use_hardware_acceleration: false
} as const;

namespace UsrLocalConfig {
    const {homedir} = window.require('os'),
        {existsSync, mkdirSync, writeFileSync, readFileSync} = window.require('fs'),
        AppPath: string = homedir() + '\\AppData\\Local\\' + AppConfig.appName,
        AppConfigFilePath: string = AppPath + '\\user-conf.y.json';

    function confFileIsExists(): boolean {
        return existsSync(AppConfigFilePath);
    }

    export const getLocalUserConf = (key: keyof DefaultUserConfig | '' = ''): DefaultUserConfig | string | boolean | number => {
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

export {DefaultUserConfig};
export {defaultUserConfig};
export default UsrLocalConfig;
