import * as React from "react";
import {useEffect, useState} from "react";

require('./YSwitch.css');

export interface YSwitchProps {
    checked?: boolean;
    onChange: ((e: boolean) => void);
}

function YSwitch(props: YSwitchProps): React.JSX.Element {
    const {
        checked = false,
        onChange
    } = props;
    const [cls, setCls] = useState('');
    const change = (): void => onChange && onChange(!checked);

    useEffect((): void => {
        setCls(checked ? '' : 'lmo-c-y-switch-off');
    }, [checked]);

    return (
        <span onClick={change} className={'lmo-c-y-switch lmo_theme_color_background ' + cls}/>
    );
}

export default YSwitch;
