import * as React from 'react';
import AppConfig from "../conf/AppConfig";

function AppFooter(): React.JSX.Element {
    return (
        <div className={'lmo-app-footer'}>
            <span className={'lmo_theme_color lmo_cursor_pointer'}>{AppConfig.appName}</span> &nbsp;
            <span>Design by 阿柒</span>
            <span> Powered by Electron and <a className={'lmo_color_white lmo_hover_theme_color'} href="https://ffmpeg.org/" target={'_blank'}>ffmpeg</a> on Microsoft Windows</span>
        </div>
    );
}

export default AppFooter;
