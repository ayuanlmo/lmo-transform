import * as React from 'react';
import AppConfig from "../conf/AppConfig";

function AppFooter(): React.JSX.Element {
    return (
        <div className={'lmo-app-footer'}>
            <a className={'lmo_color_white lmo_hover_theme_color'} href={AppConfig.openSource.github}
               target={'_blank'}>{AppConfig.appName}</a>  &nbsp;
            <span>Design by 阿柒</span>
            <span> Powered by <a className={'lmo_color_white lmo_hover_theme_color'} href="https://www.electronjs.org/"
                                 target={'_blank'}>Electron</a> and <a
                className={'lmo_color_white lmo_hover_theme_color'} href="https://ffmpeg.org/"
                target={'_blank'}>ffmpeg</a> on Microsoft Windows</span>
        </div>
    );
}

export default AppFooter;
