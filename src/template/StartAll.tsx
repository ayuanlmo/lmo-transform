import * as React from "react";
// @ts-ignore
import ReactDOM from "react-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../lib/Store";
import {CurrentStateTypes, ResourceInfoTypes} from "./ResourceItem";
import {
    setCurrentParallelTasks,
    setSelectedFileCurrentSchedule,
    setSelectedFileOptPath,
    setSelectedFileStatus
} from "../lib/Store/AppState";
import {transformVideo} from "../bin/ff";
import Global from "../lib/Global";
import * as Electron from "electron";
import {DefaultUserConfig} from "../lib/UsrLocalConfig";

const {ipcRenderer} = Global.requireNodeModule<typeof Electron>('electron');


function StartAll(): React.JSX.Element {
    const selectedFiles = useSelector((state: RootState) => state.app.selectedFiles);
    const currentParallelTasks: number = useSelector((state: RootState) => state.app.currentParallelTasks);
    const parallelTasksLength: number = useSelector((state: RootState) => state.app.parallelTasksLength);
    const appConfig: DefaultUserConfig = useSelector((state: RootState) => state.app.appConfig);
    const dispatch = useDispatch();

    const transformAll = async (): Promise<void> => {
        for (let i: number = 0; i < selectedFiles.length; i++) {
            const info: ResourceInfoTypes = selectedFiles[i];

            if (info.status === 'pending' || info.status === 'error') {
                if (info.output.type === '') {
                    ipcRenderer.send('SHOW-INFO-MESSAGE-BOX', `[${info.name}],请选择输出文件类型`);
                    break;
                }
                if (currentParallelTasks < parallelTasksLength) {
                    dispatch(setSelectedFileStatus({index: i, status: 'running'}));
                    dispatch(setCurrentParallelTasks('plus'));
                    await transformVideo(info, (data: CurrentStateTypes): void => {
                        dispatch(setSelectedFileCurrentSchedule({index: i, data: data.current}));
                    }, appConfig.output_path).then((res: string): void => {
                        ipcRenderer.send('CREATE-NOTIFICATION', {title: '转换完成', body: info.name});
                        dispatch(setCurrentParallelTasks('sub'));
                        dispatch(setSelectedFileStatus({index: i, status: 'success'}));
                        dispatch(setSelectedFileOptPath({index: i, data: res}));
                    }).catch((e): void => {
                        dispatch(setCurrentParallelTasks('sub'));
                        dispatch(setSelectedFileStatus({index: i, status: 'error'}));
                    });
                }
            }
        }
    }

    return ReactDOM.createPortal(
        <div
            onClick={transformAll}
            title={'将按照顺序依次执行转换'}
            className={'lmo-app-start-all lmo_cursor_pointer'}
        >
            <p> 批量转换 </p>
        </div>,
        document.getElementById('__lmo__')
    );
}

export default StartAll;