import Dialog from "../template/Dialog";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../lib/Store";
import {setOutputPath} from "../lib/Store/AppState";

const {ipcRenderer} = window.require('electron');

function Setting(): React.JSX.Element {
    const dispatch = useDispatch();
    const [showDialog, serShowDialogState] = useState<boolean>(false);
    const outputPath = useSelector((state: RootState) => state.app.outputPath);
    const [selectOutputPath, setSelectOutputPath] = useState<string>(outputPath);

    useEffect((): void => {
        setSelectOutputPath(outputPath);
    }, [showDialog]);

    ipcRenderer.on('SELECTED-DIRECTORY', (event, path: string): void => setSelectOutputPath(path));
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
            <Dialog onConfirm={(): void => {
                serShowDialogState(!showDialog);
                dispatch(setOutputPath(selectOutputPath));
            }} onCancel={(): void => {
                serShowDialogState(!showDialog);
            }} show={showDialog} title={'设置'}>
                <div className={'lmo-app-setting'}>
                    <div onClick={selectPath} className={'lmo-app-setting-item'}>
                        <div className={'lmo-app-setting-item-label lmo_color_white'}>输出路径</div>
                        <div>
                            <input
                                value={selectOutputPath}
                                className={'lmo_color_white lmo_cursor_pointer'}
                                disabled
                                type="text"
                            />
                        </div>
                    </div>
                    {/*<div className={'lmo-app-setting-item'}>*/}
                    {/*    <div  className={'lmo-app-setting-item-label lmo_color_white'}>*/}
                    {/*        并行任务*/}
                    {/*    </div>*/}
                    {/*    <div>*/}
                    {/*        <input className={'lmo_color_white'} type="text"/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </Dialog>
        </>
    );
}

export default Setting;
