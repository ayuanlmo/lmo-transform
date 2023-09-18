import * as React from "react";
import {useEffect, useState} from "react";
import AppFooter from "./AppFooter";
import DropFile from "./DropFile";
import Resource from "./Resource";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../lib/Store";
import {YButton} from '../components';
import {SelectFile} from "../utils/fs";
import {clearSelectedFiles, setSelectedFiles} from "../lib/Store/AppState";

function AppContent(): React.JSX.Element {
    const dispatch = useDispatch();
    const selectedFiles = useSelector((state: RootState) => state.app.selectedFiles);
    const globalType = useSelector((state: RootState) => state.app.globalType);
    const [audioLength, setAudioLength] = useState<number>(0);
    const [videoLength, setVideoLength] = useState<number>(0);

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
                <div>
                    <YButton onClick={
                        (): void => {
                            dispatch(clearSelectedFiles());
                        }
                    }
                             icon={require('../static/svg/button-deltet.svg').default}
                    >
                        清空所有
                    </YButton>
                    <YButton
                        primary
                        onClick={
                            (): void => {
                                SelectFile().then((res): void => {
                                    dispatch(setSelectedFiles(res));
                                });
                            }
                        }
                        icon={require('../static/svg/button-add.svg').default}
                    >
                        添加文件
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
