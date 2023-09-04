import * as React from "react";
import AppFooter from "./AppFooter";
import DropFile from "./DropFile";
import Resource from "./Resource";
import {useSelector} from "react-redux";
import {RootState} from "../lib/Store";
import {useEffect, useState} from "react";

function AppContent(): React.JSX.Element {
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
            {
                selectedFiles.length === 0 ? <DropFile/> : render()
            }
            <AppFooter/>
        </div>
    );
}

export default AppContent;
