import * as React from 'react';
import AppConfig from "../conf/AppConfig";
import {StartBrowser} from "../utils";

function AppFooter(): React.JSX.Element {
    const openBrowser = (e: React.MouseEvent<HTMLAnchorElement>, url: string): void => {
        e.preventDefault();
        return StartBrowser(url);
    }

    return (
        <div className={'lmo-app-footer'}>
            <a
                onClick={(e: React.MouseEvent<HTMLAnchorElement>): void => {
                    openBrowser(e, AppConfig.openSource.github)
                }}
                className={'lmo_color_white lmo_hover_theme_color'}
            >{AppConfig.appName}</a>  &nbsp;
            <span>Design by 阿柒</span>
            <span> Powered by
                <a
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>): void => {
                        openBrowser(e, 'https://www.electronjs.org/')
                    }}
                    className={'lmo_color_white lmo_hover_theme_color'}>Electron
                </a> and
                <a
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>): void => {
                        openBrowser(e, 'https://ffmpeg.org/')
                    }}
                    className={'lmo_color_white lmo_hover_theme_color'}
                >ffmpeg
                </a> on Microsoft Windows</span>
        </div>
    );
}

export default AppFooter;
