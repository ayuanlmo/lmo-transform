import {useEffect, useRef} from "react";

export interface DialogProps {
    children: React.JSX.Element,
    title: string;
    showCancel?: boolean;
    showConfirm?: boolean;
    onConfirm?: null | Function;
    onCancel?: null | Function;
    cancelLabel?: string;
    confirmLabel?: string;
    show: boolean;
}

function Dialog(props: DialogProps): React.JSX.Element {
    const {
        children,
        title,
        showCancel = true,
        showConfirm = true,
        onConfirm = null,
        onCancel = null,
        cancelLabel = '取消',
        confirmLabel = '确定',
        show = false
    } = props;

    return (
        <dialog open={show}>
            <div className={'dialog'}>
                <div className={'dialog-header lmo_color_white'}>
                    {title}
                </div>
                <div className={'dialog-content'}>
                    {children}
                </div>
                <div className={'dialog-controls-buttons'}>
                    {
                        showCancel ? <button onClick={
                            (e): void => onCancel && onCancel(e)
                        }>{cancelLabel}</button> : ''
                    }
                    {
                        showConfirm ? <button onClick={
                            (e): void => onConfirm && onConfirm(e)
                        }>{confirmLabel}</button> : ''
                    }
                </div>
            </div>
        </dialog>
    );
}

export default Dialog;
