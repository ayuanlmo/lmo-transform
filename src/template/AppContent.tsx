import * as React from "react";
import {useEffect, useState} from "react";
import AppFooter from "./AppFooter";
import DropFile from "./DropFile";
import Resource from "./Resource";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../lib/Store";
import * as Components from '../components';
import {resolveUrlFile, SelectFile, targetIs} from "../utils/fs";
import {clearSelectedFiles, setSelectedFiles} from "../lib/Store/AppState";
import StartAll from "./StartAll";
import {FfmpegStreamsTypes} from "../bin/ff";

function AppContent(): React.JSX.Element {
    const dispatch = useDispatch();
    const selectedFiles = useSelector((state: RootState) => state.app.selectedFiles);
    const globalType = useSelector((state: RootState) => state.app.globalType);
    const [audioLength, setAudioLength] = useState<number>(0);
    const [videoLength, setVideoLength] = useState<number>(0);
    const [showUrlInput, setShowUrlInput] = useState<boolean>(false);

    useEffect((): void => {
        setAudioLength(selectedFiles.filter((i: {
            streams: FfmpegStreamsTypes[]
        }): boolean => {
            return targetIs(i.streams, 'audio');
        }).length);
        setVideoLength(selectedFiles.filter((i: {
            streams: FfmpegStreamsTypes[]
        }): boolean => {
            return targetIs(i.streams, 'video');
        }).length);
    }, [selectedFiles]);

    const render = (): React.JSX.Element => {
        const length: number = globalType === 'video' ? videoLength : audioLength;

        if (length === 0)
            return <DropFile/>;
        return <Resource/>;
    }

    return (
        <div className={'lmo-app-content'}>
            <Components.YExtendTemplate show={selectedFiles.length !== 0}>
                <StartAll/>
            </Components.YExtendTemplate>
            <div className={'lmo-app-content-header'}>
                <Components.YExtendTemplate show={showUrlInput}>
                    <Components.YUrlPromptInput
                        show={showUrlInput}
                        title={'打开串流媒体'}
                        placeholder={'请输入网络串流URL , 一行一个\n\nrtp://@:8081 \n' +
                            'rtsp://example.fi/video-play \n' +
                            'rtmp://example.fi/video-play \n' +
                            'https://www.example.fi/video.mp4'}
                        onConfirm={async (urls: string[]): Promise<void> => {
                            if (urls.length === 0)
                                return setShowUrlInput(false);

                            dispatch(setSelectedFiles([...selectedFiles, ...await resolveUrlFile(urls)]));
                            setShowUrlInput(false);
                        }}
                        onCancel={(): void => {
                            setShowUrlInput(false);
                        }}
                    />
                </Components.YExtendTemplate>
                <div>
                    <Components.YExtendTemplate show={selectedFiles.length > 0}>
                        <Components.YButton
                            icon={require('../static/svg/button-deltet.svg').default}
                            onClick={
                                (): void => {
                                    dispatch(clearSelectedFiles());
                                }
                            }
                        >
                            清空所有
                        </Components.YButton>
                    </Components.YExtendTemplate>
                    <Components.YButton
                        primary
                        icon={require('../static/svg/button-add.svg').default}
                        onClick={
                            (): void => {
                                SelectFile().then((res): void => {
                                    dispatch(setSelectedFiles(res));
                                });
                            }
                        }
                    >
                        打开文件
                    </Components.YButton>
                    <Components.YButton
                        icon={require('../static/svg/button-add.svg').default}
                        onClick={
                            (): void => setShowUrlInput(true)
                        }
                    >
                        打开网络串流
                    </Components.YButton>
                </div>
            </div>
            {
                selectedFiles.length === 0 ? <DropFile/> : render()
            }
            <AppFooter/>
        </div>
    );
}

export default AppContent;
