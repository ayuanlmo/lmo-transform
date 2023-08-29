import * as React from "react";
import Dialog from "./Dialog";
import AppConfig from "../conf/AppConfig";

const process = window.require('process');
const os = window.require('os');

export interface AboutProps {
    show: boolean;
    onConfirm: null | (() => void);
}

function About(props: AboutProps): React.JSX.Element {
    const {show, onConfirm} = props as AboutProps;

    return (
        show ? <Dialog
            titleAlign={'center'}
            show={show}
            width={800}
            height={500}
            title={'About'}
            showCancel={false}
            confirmLabel={'关闭'}
            onConfirm={
                (): void => {
                    onConfirm && onConfirm()
                }
            }
        >
            <div className={'lmo-app-about lmo_none_user_select'}>
                <div className={'lmo-app-about-logo'}>
                    <img className={'animated bounce'} src={require('../static/icon.png')} alt="logo"/>
                </div>
                <div className={'lmo-app-about-app-name'}>
                    <h2 className={'lmo_theme_color animated headShake'}>{AppConfig.appName}</h2>
                </div>
                <div className={'lmo-app-about-line'}/>
                <div className={'lmo-app-about-version lmo_color_white animated fadeInDown'}>
                    <div>
                        App version: [ {AppConfig.version} - {AppConfig.ca} for {os.platform()} ]
                    </div>
                    <div>
                        NodeJS version: [ {process.version} / {process.versions.v8} ]
                        <br/>
                        Chromium version: [ {process.versions.chrome} ]
                        <br/>
                        OS: [ {os.userInfo().username} / {os.hostname()} ]
                    </div>
                </div>
            </div>
        </Dialog> : <></>
    );
}

export default About;
