import AppConfig from "../conf/AppConfig";
import Setting from "./Setting";
import {useEffect, useState} from "react";
import About from "./About";
import ShowLog from './ShowLogs';
import * as Electron from 'electron'
import Global from "../lib/Global";

require('../style/HeaderControls.css');
require('../style/Global.css');

const {ipcRenderer} = Global.requireNodeModule<typeof Electron>('electron');

function HeaderControls(): React.JSX.Element {
    const [miniWindow, setMiniWindow] = useState<boolean>(false);
    const [showAboutDialog, setShowAboutDialog] = useState<boolean>(false);
    const [showLogDialog, setShowLogDialog] = useState<boolean>(false);
    const [alwaysOnTopStatus, setAlwaysOnTopStatus] = useState<boolean>(false);

    ipcRenderer.on('WINDOW-ON-MAX', (e: any, state: boolean): void => setMiniWindow(state));

    const getButtonClass = (isActive: boolean): string => {
        return `lmo_cursor_pointer lmo_color_white ${isActive ? 'lmo_header-controls-operation-active-button' : ''}`;
    }

    useEffect((): void => {
        ipcRenderer.send('TO-TOP', {data: alwaysOnTopStatus});
    }, [alwaysOnTopStatus]);

    return (
        <div className={'lmo_header-controls'}>
            <About onConfirm={(): void => {
                setShowAboutDialog(!showAboutDialog);
            }} show={showAboutDialog}/>
            <div onClick={(): void => {
                setShowAboutDialog(!showAboutDialog);
            }} className={'lmo_header-controls-app-name lmo_theme_color lmo_cursor_pointer'}>
                {AppConfig.appName}
            </div>
            <ShowLog show={showLogDialog} onConfirm={
                (): void => setShowLogDialog(false)
            }/>
            <div className={'lmo_header-controls-block'}></div>

            <div title={'窗口置顶'} className={'lmo_header-controls-operation'}>
                <button onClick={(): void => {
                    setAlwaysOnTopStatus(!alwaysOnTopStatus);
                }}
                        className={getButtonClass(alwaysOnTopStatus)}>
                   <span>
                        <img style={{
                            width: '14px'
                        }} src={require('../static/svg/header/to-top.svg').default} alt=""/>
                   </span>
                </button>
            </div>
            <div className={'lmo_header-controls-operation'}>
                <button onClick={() => {
                    setShowLogDialog(true);
                }} className={'lmo_cursor_pointer lmo_color_white'}>
                   <span>
                        <img src={require('../static/svg/header/log.svg').default} alt=""/>
                    日志
                   </span>
                </button>
                <Setting/>
            </div>
            <div className={'lmo_header-controls-window-buttons'}>
                <div title={'最小化窗口'} onClick={(): void => {
                    ipcRenderer.send('HIDE-WINDOW');
                }} className={'lmo_header-controls-window-buttons-item'}>
                    <button>
                        <img src={require('../static/svg/header/mini-window.svg').default} alt=""/>
                    </button>
                </div>
                <div title={!miniWindow ? '最大化窗口' : '还原窗口'} onClick={() => {
                    setMiniWindow(!miniWindow);
                    ipcRenderer.send(miniWindow ? 'RESTORE-WINDOW' : 'MAX-WINDOW');
                }} className={'lmo_header-controls-window-buttons-item'}>
                    <button style={{top: '8px'}}>
                        <img
                            src={miniWindow ? require('../static/svg/header/restore-window.svg').default : require('../static/svg/header/max-window.svg').default}
                            alt=""/>
                    </button>
                </div>
                <div title={'关闭'} onClick={(): void => {
                    ipcRenderer.send('CLOSE-WINDOW');
                }} className={'lmo_header-controls-window-buttons-item'}>
                    <button style={{top: '8px'}}>
                        <img src={require('../static/svg/header/close-window.svg').default} alt=""/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HeaderControls;
