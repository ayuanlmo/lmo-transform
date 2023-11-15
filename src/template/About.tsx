import * as React from "react";
import {useEffect, useState} from "react";
import Dialog from "../components/Dialog";
import AppConfig from "../conf/AppConfig";
import {runCommand} from "../utils";
import {FFMPEG_BIN_PATH} from "../bin/ffmpeg";
import * as Process from 'process';
import * as OS from 'os';
import Global from "../lib/Global";

const process: NodeJS.Process = Global.requireNodeModule<typeof Process>('process');
const os = Global.requireNodeModule<typeof OS>('os');

export interface AboutProps {
    show: boolean;
    onConfirm: null | (() => void);
}

function About(props: AboutProps): React.JSX.Element {
    const {show, onConfirm} = props as AboutProps;
    const [showFfmpegDecoders, setShowFfmpegDecoders] = useState<boolean>(true);
    const [showLicenseView, setShowLicenseView] = useState<boolean>(false);
    const [licenseText, setLicenseText] = useState<string>('');

    useEffect((): void => {
        if (!show) {
            setShowFfmpegDecoders(true);
            setShowLicenseView(false);
        }
    }, [show]);

    useEffect((): void => {
        if (!showLicenseView || licenseText !== '') return;

        ((): void => {
            fetch(require('../static/PackageLicense.txt')).then((res: Response): void => {
                res.text().then((text: string): void => {
                    setLicenseText(text);
                });
            });
        })();
    }, [showLicenseView]);

    return (
        show ? <Dialog
            titleAlign={'center'}
            show={show}
            width={800}
            height={500}
            title={'关于'}
            showCancel={false}
            confirmLabel={'关闭'}
            preventKeyboardEvent={showLicenseView}
            onConfirm={
                (): void => {
                    onConfirm && onConfirm()
                }
            }
        >
            <div className={'lmo-app-about lmo_none_user_select'}>
                <div className={'lmo-app-about-logo'}>
                    <img className={'animated rotateIn'} src={require('../static/icon.png')} alt="logo"/>
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
                        OS: [ {os.type()} / {os.userInfo().username} / {os.hostname()} ]
                    </div>
                </div>
                {
                    showFfmpegDecoders ? <div>
                        <button className={'lmo_color_white'} onClick={
                            (): void => {
                                setShowFfmpegDecoders(false);
                                runCommand([`${FFMPEG_BIN_PATH}  ffmpeg -decoders`]);
                            }
                        }>ffmpeg decoders
                        </button>
                    </div> : <></>
                }
                {
                    showLicenseView ?
                        <Dialog
                            showCancel={false}
                            onConfirm={(): void => {
                                setShowLicenseView(false)
                            }}
                            height={580}
                            index={9}
                            show={showLicenseView}
                            confirmLabel={'关闭'}
                            title={`${AppConfig.appName}使用的第三方软件包`}
                            titleAlign={'start'}
                        >
                            <div>
                                <textarea
                                    readOnly
                                    cols={70}
                                    rows={32}
                                    defaultValue={licenseText}
                                    className={'lmo_color_white'}
                                />
                                <div
                                    className={'lmo_position_relative'}
                                    style={{
                                        color: '#999999',
                                        fontSize: '14px',
                                        top: '8px'
                                    }}>在此特别感谢以上开源软件/社区 ,
                                    他们让{AppConfig.appName}得以实现
                                </div>
                            </div>
                        </Dialog> : <></>
                }
                <button
                    onClick={
                        (): void => setShowLicenseView(true)}
                    style={{
                        margin: '4px'
                    }}
                    className={'lmo_color_white'}>
                    查看元件许可证
                </button>
            </div>
        </Dialog> : <></>
    );
}

export default About;
