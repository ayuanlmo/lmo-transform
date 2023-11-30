import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {AUDIO_TYPE_MAP, VIDEO_TYPE_MAP} from "../const/ResourceTypes";
import {useDispatch, useSelector} from "react-redux";
import {
    deleteSelectedFilesItem,
    setCurrentParallelTasks,
    setSelectedFileCurrentSchedule,
    setSelectedFileOptPath,
    setSelectedFileOutputType,
    setSelectedFileStatus
} from "../lib/Store/AppState";
import {FormatSec, openOutputPath, ResolveSize} from "../utils";
import {FfmpegStreamsTypes, transformVideo} from "../bin/ff";
import {File} from "../bin/file";
import {RootState} from "../lib/Store";
import * as Electron from 'electron';
import Global from "../lib/Global";
import {Player} from "../bin/Player";
import {DefaultUserConfig} from "../lib/UsrLocalConfig";
import {targetIs} from "../utils/fs";

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
    streams: FfmpegStreamsTypes[];
    status: SuccessState;
    currentSchedule: number,
    optPath: string;
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

export interface ResourceItemProps {
    info: ResourceInfoTypes;
    index: number;
}

function ResourceItem(props: ResourceItemProps): React.JSX.Element {
    const {index} = props;
    const [info, setInfo] = useState<ResourceInfoTypes>(props.info);
    const dispatch = useDispatch();
    const selectedFiles = useSelector((state: RootState) => state.app.selectedFiles);
    const [optTypeOptions, setOptTypeOptions] = useState<Array<OptTypeOptionsTypes>>([]);
    const currentParallelTasks: number = useSelector((state: RootState) => state.app.currentParallelTasks);
    const appConfig: DefaultUserConfig = useSelector((state: RootState) => state.app.appConfig);
    const parallelTasksLength: number = useSelector((state: RootState) => state.app.parallelTasksLength);
    const isVideo: boolean = targetIs(info, 'video'); // 是否视频
    const isAudio: boolean = targetIs(info, 'audio'); // 是否音频
    const isH264: boolean = isAudio ? false : info.streams.length === 1 ? info.streams[0].codec_name === 'h264' : info.streams[1].codec_name === 'h264'; // 是否h264
    const isH265: boolean = isAudio ? false : info.streams.length === 1 ? info.streams[0].codec_name === 'hevc' : info.streams[1].codec_name === 'hevc'; // 是否h265
    const fileType: string = info.type; // 文件类型
    const scheduleRef = useRef<HTMLDivElement>(null);

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

    useEffect((): void => {
        requestAnimationFrame((): void => {
            setInfo(selectedFiles[index]);
        });
    }, [selectedFiles]);

    useEffect((): void => {
        requestAnimationFrame((): void => {
            scheduleRef.current?.setAttribute(
                'style',
                `transform: translate3d(${-230 + (info.currentSchedule * 2.3)}px, 0px, 0px);`
            );
        });
    }, [info.currentSchedule]);
    return (
        <div className={'lmo-app-resource-item'}>
            <div className={'lmo-app-resource-item-content lmo_flex_box'}>
                <div className={'lmo-app-resource-item-content-in-info lmo_flex_box'}>
                    <div
                        className={'lmo-app-resource-item-content-in-info-cover lmo_cursor_pointer lmo_position_relative'}
                        onClick={(): void => {
                            Player.usePlayerToPlay(info.path);
                        }}>
                        {
                            isAudio ? <img src={require('../static/svg/audio.svg').default} alt={'icon'}/> : isVideo ?
                                <img src={info.cover} alt={info.cover}/> : <></>
                        }
                        <div ref={scheduleRef}
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
                            if (!File.directoryIs(appConfig.output_path))
                                return;
                            // 开始处理（状态为等待 || 错误
                            if (info.status === 'pending' || info.status === 'error') {
                                if (info.output.type === '')
                                    return ipcRenderer.send('SHOW-INFO-MESSAGE-BOX', '请选择输出文件类型');
                                if (currentParallelTasks === parallelTasksLength)
                                    return ipcRenderer.send('SHOW-INFO-MESSAGE-BOX', `当前最大并行任务数为：${parallelTasksLength}个`);

                                dispatch(setCurrentParallelTasks('plus'));
                                dispatch(setSelectedFileStatus({index, status: 'running'}));
                                transformVideo(info, (data: CurrentStateTypes) => {
                                    dispatch(setSelectedFileCurrentSchedule({index, data: data.current}));
                                }, appConfig.output_path).then((res: string): void => {
                                    ipcRenderer.send('CREATE-NOTIFICATION', {title: '转换完成', body: info.name});
                                    dispatch(setSelectedFileOptPath({index, data: res}));
                                    dispatch(setCurrentParallelTasks('sub'));
                                    dispatch(setSelectedFileStatus({index, status: 'success'}));
                                }).catch(e => {
                                    dispatch(setCurrentParallelTasks('sub'));
                                    dispatch(setSelectedFileStatus({index, status: 'error'}));
                                })
                            }
                            // 转换成功
                            if (info.status === 'success')
                                openOutputPath(info.optPath);
                        }
                    } className={'lmo_theme_color_border lmo_position_relative'}>
                        <div>
                            {
                                SuccessStateName[info.status]
                            }
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResourceItem;
