import * as React from 'react';
import ResourceItem, {ResourceInfoTypes} from "./ResourceItem";
import {useSelector} from "react-redux";
import {RootState} from "../lib/Store";
import {GetFileInfoTypes} from "../bin/ff";

function Resource(): React.JSX.Element {
    const selectedFiles: Array<GetFileInfoTypes> = useSelector((state: RootState) => state.app.selectedFiles);
    const globalType: string = useSelector((state: RootState) => state.app.globalType);

    return (
        <div className={'lmo-app-resource'}>
            <div className={'lmo-app-resource-content'}>
                {
                    selectedFiles.map((item, index) => {
                        if (item.streams.codec_type === globalType) {
                            return (
                                <ResourceItem index={index} info={item as unknown as ResourceInfoTypes} key={index}/>)
                        }
                    })
                }
            </div>
        </div>
    );
}

export default Resource;
