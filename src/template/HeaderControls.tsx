import AppConfig from "../conf/AppConfig";
import Setting from "./Setting";
import {useState} from "react";

require('../style/HeaderControls.css');
require('../style/Global.css');

const {ipcRenderer} = window.require('electron');

function HeaderControls(): React.JSX.Element {
    const [miniWindow, setMiniWindow] = useState<boolean>(false);

    return (
        <div className={'lmo_header-controls'}>

            <div className={'lmo_header-controls-app-name lmo_theme_color'}>
                {AppConfig.appName}
            </div>
            <div className={'lmo_header-controls-block'}></div>
            <div className={'lmo_header-controls-operation'}>
                <button className={'lmo_cursor_pointer lmo_color_white'}>
                   <span>
                        <img src={require('../static/svg/header/log.svg').default} alt=""/>
                    日志
                   </span>
                </button>
                <Setting />
            </div>
            <div className={'lmo_header-controls-window-buttons'}>
                <div onClick={(): void => {
                    ipcRenderer.send('HIDE-WINDOW');
                }} className={'lmo_header-controls-window-buttons-item'}>
                    <button>
                        <img src={require('../static/svg/header/mini-window.svg').default} alt=""/>
                    </button>
                </div>
                <div onClick={() => {
                    setMiniWindow(!miniWindow);
                    ipcRenderer.send(miniWindow ? 'RESTORE-WINDOW' : 'MAX-WINDOW');
                }} className={'lmo_header-controls-window-buttons-item'}>
                    <button style={{top: '8px'}}>
                        <img
                            src={miniWindow ? require('../static/svg/header/restore-window.svg').default : require('../static/svg/header/max-window.svg').default}
                            alt=""/>
                    </button>
                </div>
                <div onClick={(): void => {
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
