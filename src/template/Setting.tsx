import Dialog from "../components/Dialog";
import * as React from "react";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../lib/Store";
import {setOutputPath, setParallelTasksLen} from "../lib/Store/AppState";
import {DeleteTmpFile, GetTmpFileInfo} from "../utils/fs";
import {YSwitch} from "../components/index";
import UsrLocalConfig from "../lib/UsrLocalConfig";
import * as Electron from 'electron';
import Global from "../lib/Global";

const {ipcRenderer} = Global.requireNodeModule<typeof Electron>('electron');

function Setting(): React.JSX.Element {
    const dispatch = useDispatch();
    const outputPath = useSelector((state: RootState) => state.app.outputPath);
    const parallelTasksLen = useSelector((state: RootState) => state.app.parallelTasksLength);
    const [showDialog, serShowDialogState] = useState<boolean>(false);
    const [selectOutputPath, setSelectOutputPath] = useState<string>(outputPath);
    const [tmpFileSize, setTmpFileSize] = useState<number>(0);
    const [parallelTasksLength, setParallelTasksLength] = useState<number | string>(parallelTasksLen);
    const [pds, setPds] = useState(false);

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
                showDialog ? <Dialog height={240} onConfirm={(): void => {
                    serShowDialogState(!showDialog);
                    dispatch(setOutputPath(selectOutputPath));
                    dispatch(setParallelTasksLen(parallelTasksLength));
                    UsrLocalConfig.createLocalUserConfFile({
                        'output_path': selectOutputPath,
                        'parallel_tasks_length': parallelTasksLength
                    })
                    ipcRenderer.send('OPEN-PAS', pds);
                }} onCancel={(): void => {
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
                                    defaultValue={parallelTasksLength}
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
                            <div style={{
                                width: '20%'
                            }} className={'lmo-app-setting-item-content lmo_flex_box'}>
                                <YSwitch checked={pds} onChange={(e: boolean): void => {
                                    setPds(e);
                                }}/>
                            </div>
                            <div className={'lmo-app-setting-item-tips'}>防止Windows进入待机、暂停等状态，仅本次有效
                            </div>
                        </div>
                    </div>
                </Dialog> : <></>
            }
        </>
    );
}

export default Setting;
