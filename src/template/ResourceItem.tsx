import * as React from 'react';
import {VIDEO_TYPE_MAP} from "../const/ResourceTypes";
import {useDispatch} from "react-redux";
import {deleteSelectedFilesItem, setSelectedFileOutputType} from "../lib/Store/AppState";
import {FormatSec, ResolveSize} from "../utils";
import {ffplayer, transformVideo} from "../bin/ff";
import {useEffect, useState} from "react";

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

type SuccessState = 'running' | 'success' | 'error' | 'pending';

enum SuccessStateName {
    running = "转换中",
    success = "打开文件",
    error = "转换失败",
    pending = "开始转换",
}


function ResourceItem(props: { info: ResourceInfoTypes, index: number }): React.JSX.Element {
    const {info, index} = props;
    const dispatch = useDispatch();
    const [successState, setSuccessState] = useState<SuccessState>('pending');

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
                    <div className={'lmo_cursor_pointer'} onClick={(): void => {
                        ffplayer(info.path);
                    }}>
                        <img src={info.cover} alt={info.cover}/>
                    </div>
                    <div className={'lmo-app-resource-item-content-in-info-box'}>
                        <div className={'lmo-app-resource-item-content-in-info-name'}>{info.name}</div>
                        <div className={'lmo-app-resource-item-content-in-info-item lmo_flex_box'}>
                            <div>类型：{info.type.split('/')[1]}</div>
                            <div>大小：{ResolveSize(info.size)}</div>
                        </div>
                        <div className={'lmo-app-resource-item-content-in-info-item lmo_flex_box'}>
                            <div>尺寸：{info.width} * {info.height}</div>
                            <div>时长：{FormatSec(info.duration as string)}</div>
                        </div>
                    </div>
                </div>
                <div className={'lmo-app-resource-item-content-output-info-box'}>
                    <div className={'lmo-app-resource-item-content-output-info-box-content'}>
                        <div className={'lmo-app-resource-item-content-in-info-name'}>输出设置</div>
                        <div className={'lmo-app-resource-item-content-in-info-item lmo_flex_box'}>
                            <div className={'lmo_color_white'}>类型：
                                <select onChange={(e) => {
                                    dispatch(setSelectedFileOutputType({
                                        index: index,
                                        type: e.target.value.toLowerCase()
                                    }));
                                }} name="" id="">
                                    {
                                        VIDEO_TYPE_MAP.map((i, k) => {
                                            return (
                                                <option key={k} value={i.name}>
                                                    {i.name}
                                                </option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className={'lmo-app-resource-item-content-in-info-item lmo_flex_box'}>
                            <div>尺寸：{info.width} * {info.height}</div>
                            <div>时长：{FormatSec(info.duration as string)}</div>
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
                            if (successState === 'pending') {
                                setSuccessState('running');
                                transformVideo(info).then((res: string) => {
                                    setSuccessState('success');
                                    console.log('成功', res)
                                }).catch(e => {
                                    setSuccessState('error');
                                    console.log('失败')
                                })
                            }
                        }
                    } className={'lmo_theme_color_border lmo_position_relative'}>
                        {
                            SuccessStateName[successState]
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResourceItem;
