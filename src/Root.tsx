import * as React from 'react';
import {useEffect} from 'react';
import HeaderControls from "./template/HeaderControls";
import LeftMenu from "./template/LeftMenu";
import AppContent from "./template/AppContent";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./lib/Store";
import {initConfig, setSelectedFiles} from "./lib/Store/AppState";
import {resolveFile} from "./utils/fs";
import GlobalLoading from "./template/GlobalLoading";
import './lib/UsrLocalConfig';

require('./style/lmo-default.t.css');
require('./style/App.css');
require('./style/animate.min.css');

export interface File {
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    path: string;
    size: number
    type: string;
    webkitRelativePath: string;
}

function Root(): React.JSX.Element {
    const selectedFiles = useSelector((state: RootState) => state.app.selectedFiles);
    const dispatch = useDispatch();

    dispatch(initConfig());

    useEffect(() => {
        const handleDragOver = (e: Event) => e.preventDefault();
        const handleDrop = async (e: any) => {
            e.preventDefault();
            const files: Array<File> = [...e.dataTransfer.files].filter((i: File): boolean => i.path !== '');
            // 输入文件
            dispatch(setSelectedFiles([...selectedFiles, ...await resolveFile(files)]));
        };
        document.body.addEventListener('dragover', handleDragOver);
        document.body.addEventListener('drop', handleDrop);
        return () => {
            document.body.removeEventListener('dragover', handleDragOver);
            document.body.removeEventListener('drop', handleDrop);
        };
    }, []);
    return (
        <div>
            <GlobalLoading/>
            <HeaderControls/>
            <div className={'lmo_app-content lmo_none_user_select'}>
                <LeftMenu/>
                <AppContent/>
            </div>
        </div>
    );
}

export default Root;
