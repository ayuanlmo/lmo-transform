import * as React from 'react';
import {useEffect, useState} from 'react';
import {AUDIO_TYPE_MAP, VIDEO_TYPE_MAP} from "../const/ResourceTypes";
import {useDispatch, useSelector} from "react-redux";
import {deleteSelectedFilesItem, setCurrentParallelTasks, setSelectedFileOutputType} from "../lib/Store/AppState";
import {FormatSec, openOutputPath, ResolveSize} from "../utils";
import {FfmpegStreamsTypes, transformVideo} from "../bin/ff";
import {File} from "../bin/file";
import Storage from "../lib/Storage";
import {RootState} from "../lib/Store";
import * as Electron from 'electron';
import Global from "../lib/Global";
import {Player} from "../bin/Player";

const {ipcRenderer} = Global.requireNodeModule<typeof Electron>('electron');

export interface ResourceInfoTypes {
    cover: string;
    duration: string | number;
    format: string;
    height?: number;
    lastModified: number;
    name: string;
    output: {
        type: string;
    };
    path: string;
    size: number;
    type: string;
    width?: number;
    streams: FfmpegStreamsTypes;
}

export interface CurrentStateTypes {
    current: number;
    frame: Array<number>;
}

export type SuccessState = 'running' | 'success' | 'error' | 'pending';

export enum SuccessStateName {
    running = "转换中",
    success = "打开文件夹",
    error = "转换失败",
    pending = "开始转换",
}

export interface OptTypeOptionsTypes {
    name: string;
    type: string;
    label?: string;
    libs?: string;
}


function ResourceItem(props: { info: ResourceInfoTypes, index: number }): React.JSX.Element {
    const {info, index} = props;
    const dispatch = useDispatch();
    const [successState, setSuccessState] = useState<SuccessState>('pending');
    const [resourcePath, setResourcePath] = useState<string>('');
    const [currentState, setCurrentState] = useState<CurrentStateTypes>({
        current: 0,
        frame: []
    });
    const [optTypeOptions, setOptTypeOptions] = useState<Array<OptTypeOptionsTypes>>([]);
    const currentParallelTasks: number = useSelector((state: RootState) => state.app.currentParallelTasks);
    const parallelTasksLength: number = useSelector((state: RootState) => state.app.parallelTasksLength);
    const isH264: boolean = info.streams.codec_name === 'h264'; // 是否h264
    const isH265: boolean = info.streams.codec_name === 'hevc'; // 是否h265
    const isVideo: boolean = info.streams.codec_type === 'video'; // 是否视频
    const isAudio: boolean = info.streams.codec_type === 'audio'; // 是否音频
    const fileType: string = info.type; // 文件类型

    const getTypeOptions = (): Array<OptTypeOptionsTypes> => {
        const type: Array<OptTypeOptionsTypes> = [];

        if (isVideo) {
            VIDEO_TYPE_MAP.forEach(i => {
                if (i.type !== fileType) {
                    type.push(i);
                } else {
                    if (isH264)
                        if (!(i.label.includes('264')))
                            type.push(i);
                    if (isH265)
                        if (!(i.label.includes('265')))
                            type.push(i);
                }
            });
        }
        if (isAudio) {
            AUDIO_TYPE_MAP.forEach(i => {
                if (i.type !== fileType)
                    type.push(i);
            })
        }
        setOptTypeOptions(type);
        return type;
    }

    useEffect((): void => {
        getTypeOptions();
        dispatch(setSelectedFileOutputType({
            index: index,
            type: ''
        }));
    }, []);
    return (
        <div className={'lmo-app-resource-item'}>
            <div className={'lmo-app-resource-item-content lmo_flex_box'}>
                <div className={'lmo-app-resource-item-content-in-info lmo_flex_box'}>
                    <div className={'lmo_cursor_pointer lmo_position_relative'} onClick={(): void => {
                        Player.usePlayerToPlay(info.path);
                    }}>
                        {
                            isAudio ? <img src={require('../static/svg/audio.svg').default} alt={'icon'}/> : isVideo ?
                                <img src={info.cover} alt={info.cover}/> : <></>
                        }
                        <div style={{width: `${currentState.current}%`}}
                             className={'lmo-app-resource-item-content-in-info-bg'}></div>
                    </div>
                    <div className={'lmo-app-resource-item-content-in-info-box'}>
                        <div
                            className={'lmo-app-resource-item-content-in-info-name lmo-app-text-ellipsis'}
                            title={info.name}
                        >
                            {info.name}
                        </div>
                        <div className={'lmo-app-resource-item-content-in-info-item lmo_flex_box'}>
                            <div>类型：{info.type.split('/')[1]}</div>
                            <div>大小：{ResolveSize(info.size)}</div>
                        </div>
                        <div className={'lmo-app-resource-item-content-in-info-item lmo_flex_box'}>
                            <div>尺寸：{info.width} * {info.height}</div>
                            <div>时长：{FormatSec(Number(info.duration as string))}</div>
                        </div>
                    </div>
                </div>
                <div className={'lmo-app-resource-item-content-output-info-box'}>
                    <div className={'lmo-app-resource-item-content-output-info-box-content'}>
                        <div className={'lmo-app-resource-item-content-in-info-name'}>输出设置</div>
                        <div className={'lmo-app-resource-item-content-in-info-item lmo_flex_box'}>
                            <div className={'lmo_color_white'}>类型：
                                <select onChange={(e) => {
                                    const type = optTypeOptions.find(i => {
                                        return i.label === e.target.value;
                                    });

                                    dispatch(setSelectedFileOutputType({
                                        index: index,
                                        type: type?.name,
                                        libs: type?.libs
                                    }));
                                }} name="" id="">
                                    {
                                        optTypeOptions.map((i, k) => {
                                            return (
                                                <option key={k} value={i.label}>
                                                    {i.label}
                                                </option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className={'lmo-app-resource-item-content-in-info-item lmo_flex_box'}>
                            <div>尺寸：{info.width} * {info.height}</div>
                            <div>时长：{FormatSec(Number(info.duration as string))}</div>
                        </div>
                    </div>
                </div>
                <div className={'lmo-app-resource-item-content-controls'}>
                    <button onClick={() => {
                        dispatch(deleteSelectedFilesItem(index));
                    }} className={'lmo_theme_color_border lmo_position_relative'}>
                        <img src={require('../static/delete.svg').default} alt={''}/>
                    </button>
                    <button onClick={
                        (): void => {
                            if (!File.directoryIs(Storage.Get('output_path')))
                                return;
                            // 开始处理（状态为等待 || 错误
                            if (successState === 'pending' || successState === 'error') {
                                if (info.output.type === '')
                                    return ipcRenderer.send('SHOW-INFO-MESSAGE-BOX', '请选择输出文件类型');
                                if (currentParallelTasks === parallelTasksLength)
                                    return ipcRenderer.send('SHOW-INFO-MESSAGE-BOX', `当前最大并行任务数为：${parallelTasksLength}个`);

                                dispatch(setCurrentParallelTasks('plus'));
                                setSuccessState('running');
                                transformVideo(info, (data: CurrentStateTypes) => {
                                    setCurrentState(data);
                                }).then((res: string): void => {
                                    ipcRenderer.send('CREATE-NOTIFICATION', {title: '转换完成', body: info.name});
                                    dispatch(setCurrentParallelTasks('sub'));
                                    setSuccessState('success');
                                    setResourcePath(res);
                                }).catch(e => {
                                    dispatch(setCurrentParallelTasks('sub'));
                                    setSuccessState('error');
                                })
                            }
                            // 转换成功
                            if (successState === 'success')
                                openOutputPath();
                        }
                    } className={'lmo_theme_color_border lmo_position_relative'}>
                        <div>
                            {
                                SuccessStateName[successState]
                            }
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResourceItem;
