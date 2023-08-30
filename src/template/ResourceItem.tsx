import * as React from 'react';
import {useEffect, useState} from 'react';
import {VIDEO_TYPE_MAP} from "../const/ResourceTypes";
import {useDispatch} from "react-redux";
import {deleteSelectedFilesItem, setSelectedFileOutputType} from "../lib/Store/AppState";
import {FormatSec, openOutputPath, ResolveSize} from "../utils";
import {ffplayer, transformVideo} from "../bin/ff";

interface ResourceInfoTypes {
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
}

interface CurrentStateTypes {
    current: number;
    frame: Array<number>;
}

type SuccessState = 'running' | 'success' | 'error' | 'pending';

enum SuccessStateName {
    running = "转换中",
    success = "打开文件夹",
    error = "转换失败",
    pending = "开始转换",
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

    useEffect((): void => {
        dispatch(setSelectedFileOutputType({
            index: index,
            type: 'mp4'
        }));
    }, []);
    return (
        <div className={'lmo-app-resource-item'}>
            <div className={'lmo-app-resource-item-content lmo_flex_box'}>
                <div className={'lmo-app-resource-item-content-in-info lmo_flex_box'}>
                    <div className={'lmo_cursor_pointer lmo_position_relative'} onClick={(): void => {
                        ffplayer(info.path);
                    }}>
                        <img src={info.cover} alt={info.cover}/>
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
                            <div>{info.width} * {info.height}</div>
                            <div>{FormatSec(Number(info.duration as string))}</div>
                        </div>
                    </div>
                </div>
                <div className={'lmo-app-resource-item-content-output-info-box'}>
                    <div className={'lmo-app-resource-item-content-output-info-box-content'}>
                        <div className={'lmo-app-resource-item-content-in-info-name'}>输出设置</div>
                        <div className={'lmo-app-resource-item-content-in-info-item lmo_flex_box'}>
                            <div className={'lmo_color_white'}>类型：
                                <select onChange={(e) => {
                                    const type = VIDEO_TYPE_MAP.find(i => {
                                        return i.label === e.target.value;
                                    });
                                    dispatch(setSelectedFileOutputType({
                                        index: index,
                                        type: type?.name,
                                        libs: type?.libs
                                    }));
                                }} name="" id="">
                                    {
                                        VIDEO_TYPE_MAP.map((i, k) => {
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
                            <div>{info.width} * {info.height}</div>
                            <div>{FormatSec(Number(info.duration as string))}</div>
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
                            // 开始处理（状态为等待 || 错误
                            if (successState === 'pending' || successState === 'error') {
                                setSuccessState('running');
                                transformVideo(info, (data: CurrentStateTypes) => {
                                    setCurrentState(data);
                                }).then((res: string) => {
                                    setSuccessState('success');
                                    setResourcePath(res);
                                }).catch(e => {
                                    setSuccessState('error');
                                    console.log('失败')
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
