import * as React from 'react';
import {VIDEO_TYPE_MAP} from "../const/ResourceTypes";

function Resource(): React.JSX.Element {
    return (
        <div className={'lmo-app-resource'}>
            <div className={'lmo-app-resource-content'}>
                <div className={'lmo-app-resource-item'}>
                    <div className={'lmo-app-resource-item-content lmo_flex_box'}>
                        <div className={'lmo-app-resource-item-content-in-info lmo_flex_box'}>
                            <div>
                                <img src="https://cdn.ayuanlmo.cn/img/ayuanlmo.jpg!/fw/200" alt=""/>
                            </div>
                            <div className={'lmo-app-resource-item-content-in-info-box'}>
                                <div className={'lmo-app-resource-item-content-in-info-name'}>视频名称</div>
                                <div className={'lmo-app-resource-item-content-in-info-item lmo_flex_box'}>
                                    <div>类型：MP4</div>
                                    <div>大小：16M</div>
                                </div>
                                <div className={'lmo-app-resource-item-content-in-info-item lmo_flex_box'}>
                                    <div>尺寸：MP4</div>
                                    <div>时长：16M</div>
                                </div>
                            </div>
                        </div>
                        <div className={'lmo-app-resource-item-content-output-info-box'}>
                            <div className={'lmo-app-resource-item-content-output-info-box-content'}>
                                <div className={'lmo-app-resource-item-content-in-info-name'}>输出设置</div>
                                <div className={'lmo-app-resource-item-content-in-info-item lmo_flex_box'}>
                                    <div className={'lmo_color_white'}>类型：
                                        <select name="" id="">
                                            {
                                                VIDEO_TYPE_MAP.map((i,k) => {
                                                    return (
                                                        <option key={k} value={i.type}>
                                                            {i.name}
                                                        </option>
                                                    );
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div>大小：16M</div>
                                </div>
                                <div className={'lmo-app-resource-item-content-in-info-item lmo_flex_box'}>
                                    <div>尺寸：MP4</div>
                                    <div>时长：16M</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'lmo-app-resource-item'}></div>
                <div className={'lmo-app-resource-item'}></div>
                <div className={'lmo-app-resource-item'}></div>
                <div className={'lmo-app-resource-item'}></div>
            </div>

        </div>
    );
}

export default Resource;