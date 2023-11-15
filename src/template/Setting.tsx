import Dialog from "../components/Dialog";
import * as React from "react";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../lib/Store";
import {setConfig, setOutputPath, setParallelTasksLen} from "../lib/Store/AppState";
import {DeleteTmpFile, GetTmpFileInfo} from "../utils/fs";
import {YSwitch} from "../components/index";
import * as Electron from 'electron';
import Global from "../lib/Global";
import UsrLocalConfig, {DefaultUserConfig, PlayerTypes} from "../lib/UsrLocalConfig";
import {Dispatch} from "@reduxjs/toolkit";
import {YExtendTemplate} from "../components";

const {ipcRenderer} = Global.requireNodeModule<typeof Electron>('electron');

function Setting(): React.JSX.Element {
    const LocalConfig: DefaultUserConfig = UsrLocalConfig.getLocalUserConf();
    const dispatch: Dispatch = useDispatch();
    const outputPath: string = useSelector((state: RootState) => state.app.outputPath);
    const appConf: DefaultUserConfig = useSelector((state: RootState) => state.app.appConfig);
    const parallelTasksLen: number = useSelector((state: RootState) => state.app.parallelTasksLength);
    const [showDialog, serShowDialogState] = useState<boolean>(false);
    const [selectOutputPath, setSelectOutputPath] = useState<string>(outputPath);
    const [tmpFileSize, setTmpFileSize] = useState<number>(0);
    const [parallelTasksLength, setParallelTasksLength] = useState<number | string>(parallelTasksLen);
    const [pds, setPds] = useState(false);
    const [playerType, setPlayerType] = useState<PlayerTypes>(LocalConfig.player);
    const [windowsMediaPlayerPath, setWindowsMediaPlayerPath] = useState<string>(LocalConfig.windows_media_player_local_path);
    const [vlcMediaPlayerPath, setVlcMediaPlayerPath] = useState<string>(LocalConfig.vlc_media_player_local_path);

    useEffect((): void => {
        setSelectOutputPath(outputPath);
        dispatch(setOutputPath(selectOutputPath));
        initTmpFileSize();
    }, [showDialog]);

    useEffect((): void => {
        if (parallelTasksLength === '')
            setParallelTasksLength(1);
    }, [parallelTasksLength]);

    const initTmpFileSize = (): void => setTmpFileSize(GetTmpFileInfo().size);

    ipcRenderer.on('SELECTED-DIRECTORY', (event: any, path: string): void => setSelectOutputPath(path));
    const selectPath = (): void => ipcRenderer.send('OPEN-DIRECTORY');

    const saveConfig = async (): Promise<void> => {
        serShowDialogState(!showDialog);
        dispatch(setOutputPath(selectOutputPath));
        dispatch(setParallelTasksLen(parallelTasksLength));
        dispatch(setConfig({
            ...appConf,
            parallel_tasks_length: parallelTasksLength,
            output_path: selectOutputPath
        }));

        ipcRenderer.send('OPEN-PAS', pds);

        await UsrLocalConfig.setConfig(UsrLocalConfig.keyData({
            ...appConf,
            parallel_tasks_length: parallelTasksLength,
            player: playerType,
            windows_media_player_local_path: windowsMediaPlayerPath,
            vlc_media_player_local_path: vlcMediaPlayerPath,
            output_path: selectOutputPath
        } as DefaultUserConfig));
    }

    return (
        <>
            <button onClick={(): void => {
                serShowDialogState(!showDialog);
            }} className={'lmo_cursor_pointer lmo_color_white'}>
                <span>
                    <img src={require('../static/svg/header/setting.svg').default} alt=""/>
                    设置
                </span>
            </button>
            {
                showDialog ? <Dialog height={310} onConfirm={saveConfig} onCancel={(): void => {
                    serShowDialogState(!showDialog);
                }} show={showDialog} title={'设置'}>
                    <div className={'lmo-app-setting'}>
                        <div onClick={selectPath} className={'lmo-app-setting-item'}>
                            <div className={'lmo-app-setting-item-label lmo_color_white'}>输出路径</div>
                            <div className={'lmo-app-setting-item-content'}>
                                <input
                                    value={selectOutputPath}
                                    className={'lmo_color_white lmo_cursor_pointer'}
                                    type="text"
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className={'lmo-app-setting-item'}>
                            <div className={'lmo-app-setting-item-label lmo_color_white'}>并行任务</div>
                            <div className={'lmo-app-setting-item-content'}>
                                <input
                                    value={parallelTasksLength}
                                    className={'lmo_color_white lmo_cursor_pointer'}
                                    min={1}
                                    max={5}
                                    type="number"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                        setParallelTasksLength(Number(e.target.value));
                                    }}
                                />
                            </div>
                        </div>
                        <div className={'lmo-app-setting-item'}>
                            <div className={'lmo-app-setting-item-label lmo_color_white'}>默认媒体播放器</div>
                            <div className={'lmo-app-setting-item-content'}>
                                <select
                                    value={playerType}
                                    className={'lmo_cursor_pointer'}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
                                        setPlayerType(e.target.value as PlayerTypes);
                                    }}>
                                    <option value="ffplay">ffmpeg player</option>
                                    <option value="wmp">Windows Media Player</option>
                                    <option value="vlc">VLC Media Player</option>
                                </select>
                            </div>
                        </div>
                        <YExtendTemplate show={playerType !== 'ffplay'}>
                            <div className={'lmo-app-setting-item'}>
                                <div className={'lmo-app-setting-item-label lmo_color_white'}>播放器路径</div>
                                <div className={'lmo-app-setting-item-content'}>
                                    <YExtendTemplate show={playerType === 'vlc'}>
                                        <input
                                            value={vlcMediaPlayerPath}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                                setVlcMediaPlayerPath(e.target.value);
                                            }}
                                            className={'lmo_color_white lmo_cursor_pointer'}
                                            type="text"
                                        />
                                    </YExtendTemplate>
                                    <YExtendTemplate show={playerType === 'wmp'}>
                                        <input
                                            value={windowsMediaPlayerPath}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                                setWindowsMediaPlayerPath(e.target.value);
                                            }}
                                            className={'lmo_color_white lmo_cursor_pointer'}
                                            type="text"
                                        />
                                    </YExtendTemplate>
                                </div>
                            </div>
                        </YExtendTemplate>
                        <div className={'lmo-app-setting-item'}>
                            <div className={'lmo-app-setting-item-label lmo_color_white'}>临时文件</div>
                            <div className={'lmo-app-setting-item-content lmo_flex_box'}>
                                <span className={'lmo_theme_color'}>{tmpFileSize + 'kb'}</span>
                                <button onClick={(): void => {
                                    DeleteTmpFile();
                                    initTmpFileSize();
                                }} className={'lmo_color_white lmo_cursor_pointer'}>删除
                                </button>
                            </div>
                        </div>
                        <div className={'lmo-app-setting-item'}>
                            <div style={{width: '158px'}} className={'lmo-app-setting-item-label lmo_color_white'}>
                                阻止低功耗模式
                            </div>
                            <div className={'lmo-app-setting-item-content lmo_flex_box'}>
                                <div>
                                    <YSwitch checked={pds} onChange={(e: boolean): void => {
                                        setPds(e);
                                    }}/>
                                </div>
                                <div className={'lmo-app-setting-item-tips'}>防止Windows进入待机、暂停等状态，仅本次有效
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog> : <></>
            }
        </>
    );
}

export default Setting;
