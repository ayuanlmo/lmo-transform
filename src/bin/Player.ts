import UsrLocalConfig, {DefaultUserConfig, PlayerTypes} from "../lib/UsrLocalConfig";
import {ffplayer} from "./ff";
import {
    NoVlcPlayerPath,
    NoWindowsMediaPlayerPath,
    VlcPlayerPathDoesNotExist,
    WindowsMediaPlayerPathDoesNotExist
} from "../const/Message";
import getLocalUserConf = UsrLocalConfig.getLocalUserConf;
import * as Electron from 'electron';
import * as FS from 'fs';
import * as ChildProcess from 'child_process';
import Global from "../lib/Global";

namespace Player {
    const {ipcRenderer} = Global.requireNodeModule<typeof Electron>('electron');
    const {existsSync} = Global.requireNodeModule<typeof FS>('fs');
    const {exec} = Global.requireNodeModule<typeof ChildProcess>('child_process');

    export const useVlcMediaPlayerToPlay = (path: string): void => {
        const vlcPath: string = getLocalUserConf<DefaultUserConfig>('vlc_media_player_local_path') as string;

        if (vlcPath === '')
            return ipcRenderer.send('SHOW-ERROR-MESSAGE-BOX', {
                msg: NoVlcPlayerPath
            });
        if (!existsSync(vlcPath))
            return ipcRenderer.send('SHOW-ERROR-MESSAGE-BOX', {
                msg: VlcPlayerPathDoesNotExist
            });

        exec(`"${vlcPath}" file:///"${path}" -f`);
    }

    export const useWindowsMediaPlayerToPlay = (path: string): void => {
        const wmpPath: string = getLocalUserConf<DefaultUserConfig>('windows_media_player_local_path') as string;

        if (wmpPath === '')
            return ipcRenderer.send('SHOW-ERROR-MESSAGE-BOX', {
                msg: NoWindowsMediaPlayerPath
            });
        if (!existsSync(wmpPath))
            return ipcRenderer.send('SHOW-ERROR-MESSAGE-BOX', {
                msg: WindowsMediaPlayerPathDoesNotExist
            });

        exec(`"${wmpPath}" "${path}"`);
    }

    export const usePlayerToPlay = (filePath: string): void => {
        const playerType: PlayerTypes = getLocalUserConf<DefaultUserConfig>('player') as PlayerTypes;

        if (playerType === 'ffplay')
            ffplayer(filePath);
        if (playerType === 'vlc')
            useVlcMediaPlayerToPlay(filePath);
        if (playerType === 'wmp')
            useWindowsMediaPlayerToPlay(filePath);
    }
}

export {Player};
