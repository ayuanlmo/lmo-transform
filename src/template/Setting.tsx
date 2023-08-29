import Dialog from "../template/Dialog";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../lib/Store";
import {setOutputPath} from "../lib/Store/AppState";
import {DeleteTmpFile, GetTmpFileInfo} from "../utils/fs";

const {ipcRenderer} = window.require('electron');

function Setting(): React.JSX.Element {
    const dispatch = useDispatch();
    const outputPath = useSelector((state: RootState) => state.app.outputPath);
    const [showDialog, serShowDialogState] = useState<boolean>(false);
    const [selectOutputPath, setSelectOutputPath] = useState<string>(outputPath);
    const [tmpFileSize, setTmpFileSize] = useState<number>(0);

    useEffect((): void => {
        setSelectOutputPath(outputPath);
        initTmpFileSize();
    }, [showDialog]);

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
                showDialog ? <Dialog onConfirm={(): void => {
                    serShowDialogState(!showDialog);
                    dispatch(setOutputPath(selectOutputPath));
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
                    </div>
                </Dialog> : <></>
            }
        </>
    );
}

export default Setting;
