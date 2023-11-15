import * as React from "react";
import {useEffect, useState} from "react";
import AppFooter from "./AppFooter";
import DropFile from "./DropFile";
import Resource from "./Resource";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../lib/Store";
import {YButton, YExtendTemplate, YUrlPromptInput} from '../components';
import {resolveUrlFile, SelectFile} from "../utils/fs";
import {clearSelectedFiles, setSelectedFiles} from "../lib/Store/AppState";

function AppContent(): React.JSX.Element {
    const dispatch = useDispatch();
    const selectedFiles = useSelector((state: RootState) => state.app.selectedFiles);
    const globalType = useSelector((state: RootState) => state.app.globalType);
    const [audioLength, setAudioLength] = useState<number>(0);
    const [videoLength, setVideoLength] = useState<number>(0);
    const [showUrlInput, setShowUrlInput] = useState<boolean>(false);

    useEffect((): void => {
        setAudioLength(selectedFiles.filter((i: {
            streams: { codec_type: string }
        }): boolean => {
            return i.streams.codec_type === 'audio';
        }).length);
        setVideoLength(selectedFiles.filter((i: {
            streams: { codec_type: string }
        }): boolean => {
            return i.streams.codec_type === 'video';
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
            <div className={'lmo-app-content-header'}>
                <YExtendTemplate show={showUrlInput}>
                    <YUrlPromptInput
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
                </YExtendTemplate>
                <div>

                    <YExtendTemplate show={selectedFiles.length > 0}>
                        <YButton
                            icon={require('../static/svg/button-deltet.svg').default}
                            onClick={
                                (): void => {
                                    dispatch(clearSelectedFiles());
                                }
                            }
                        >
                            清空所有
                        </YButton>
                    </YExtendTemplate>
                    <YButton
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
                    </YButton>
                    <YButton
                        icon={require('../static/svg/button-add.svg').default}
                        onClick={
                            (): void => setShowUrlInput(true)
                        }
                    >
                        打开网络串流
                    </YButton>
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
