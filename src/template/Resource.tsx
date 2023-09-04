import * as React from 'react';
import {useEffect, useState} from 'react';
import ResourceItem, {ResourceInfoTypes} from "./ResourceItem";
import {useSelector} from "react-redux";
import {RootState} from "../lib/Store";
import {GetFileInfoTypes} from "../bin/ff";

function Resource(): React.JSX.Element {
    const selectedFiles: Array<GetFileInfoTypes> = useSelector((state: RootState) => state.app.selectedFiles);
    const globalType: string = useSelector((state: RootState) => state.app.globalType);
    const [currentFiles, setCurrentFiles] = useState<Array<GetFileInfoTypes>>([]);

    useEffect((): void => {
        setCurrentFiles(selectedFiles.filter(i => {
            console.log(i.streams)
            return i.streams.codec_type === globalType
        }))
        console.log(selectedFiles)
    }, [globalType]);

    return (
        <div className={'lmo-app-resource'}>
            <div className={'lmo-app-resource-content'}>
                {
                    currentFiles.map((item, index) => {
                        return (<ResourceItem index={index} info={item as unknown as ResourceInfoTypes} key={index}/>)
                    })
                }
            </div>
        </div>
    );
}

export default Resource;
