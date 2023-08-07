import * as React from 'react';
import ResourceItem from "./ResourceItem";
import {useSelector} from "react-redux";
import {RootState} from "../lib/Store";

function Resource(): React.JSX.Element {
    const selectedFiles = useSelector((state: RootState) => state.app.selectedFiles);

    return (
        <div className={'lmo-app-resource'}>
            <div className={'lmo-app-resource-content'}>
                {
                    selectedFiles.map((item, index) => {
                        return (<ResourceItem info={item} key={index}/>)
                    })
                }
            </div>
        </div>
    );
}

export default Resource;
