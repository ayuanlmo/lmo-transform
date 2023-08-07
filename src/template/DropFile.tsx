import * as React from 'react';
import {setSelectedFiles} from "../lib/Store/AppState";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../lib/Store";
import {SelectFile} from "../utils/fs";

function DropFile(): React.JSX.Element {
    const dispatch = useDispatch();

    return (
        <div onClick={() => {
            SelectFile().then((res): void => {
                dispatch(setSelectedFiles(res));
            });
        }} className={'lmo-app-content-drop-file lmo_position_relative lmo_cursor_pointer'}>
            <div className={'lmo_flex_box'}>
                <div className={'lmo-app-content-drop-file-select-file-icon'}>
                    <img src={require('../static/svg/select-file.svg').default} alt=""/>
                </div>
                <div className={'lmo-app-content-drop-file-select-file-info'}>
                    <span>点击导入文件，或将文件拖到此处</span>
                    <span>视频、图片、音频</span>
                </div>
            </div>
        </div>
    );
}

export default DropFile;
