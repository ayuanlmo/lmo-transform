require('./YButton.css');

import * as React from 'react';
import {YExtendTemplate} from "../index";

interface YButtonProps {
    disabled?: boolean;
    children: React.JSX.Element | string;
    readonly primary?: boolean;
    readonly icon?: string;
    readonly onClick?: ((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
}

function YButton(props: YButtonProps): React.JSX.Element {
    const {
        disabled = false,
        primary = false,
        icon = '',
        children,
        onClick
    } = props;

    const getClassName = (): string => {
        if (primary)
            return 'YButton YButton-primary lmo_color_white'
        return 'YButton lmo_color_white';
    }

    return (
        <button onClick={onClick} className={getClassName()} disabled={disabled}>
            <YExtendTemplate show={icon !== ''}>
                <img src={icon} alt=""/>
            </YExtendTemplate>
            {children}
        </button>
    )
}

export default YButton;
