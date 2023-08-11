import * as React from "react";
import {useEffect, useState} from "react";
import {TRANSFORM_MAP, TRANSFORM_TYPES} from "../const/TransformType";

function LeftMenu(): React.JSX.Element {
    const [transformType, setTransformType] = useState<TRANSFORM_TYPES>('video');

    useEffect((): void => {
        console.log('transformType', transformType);
    }, [transformType]);

    const getClassName = (type: TRANSFORM_TYPES): string => {
        const _: string = 'lmo-app-left-menu-item lmo_hover_theme_color ';

        return transformType === type ? _ + 'lmo-app-left-menu-item-active' : _;
    };

    return (
        <div className={'lmo-app-left-menu'}>
            {
                TRANSFORM_MAP.map((i, index: number): React.JSX.Element => {
                    return (
                        <div key={index} onClick={
                            (): void => {
                                if (transformType === i.type) return;
                                setTransformType(i.type);
                            }
                        } className={getClassName(i.type)}>
                            <div
                                className={'lmo_color_white lmo_position_relative lmo_flex_box lmo-app-left-menu-item-content'}>
                                <div><img src={i.icon} alt={i.icon}/></div>
                                <div>{i.name}</div>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default LeftMenu;
