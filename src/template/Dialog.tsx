import * as React from "react";
// @ts-ignore
import ReactDOM from "react-dom";

type TitleAlign = 'start' | 'center';

export interface DialogProps {
    children: React.JSX.Element;
    title: string;
    showCancel?: boolean;
    showConfirm?: boolean;
    readonly onConfirm?: null | ((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
    readonly onCancel?: null | ((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
    cancelLabel?: string;
    confirmLabel?: string;
    show: boolean;
    width?: number;
    height?: number;
    readonly titleAlign?: TitleAlign;
    style?: object;
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
        show = false,
        width = 560,
        height = 210,
        titleAlign = 'start',
        style = {}
    } = props;

    return ReactDOM.createPortal((
        <dialog style={style} open={show}>
            <div className={'dialog animated bounceIn'} style={{
                width: `${width}px`,
                top: `calc((100vh - ${height + 200}px) / 2)`,
                left: `calc((100vw - ${width}px) / 2)`
            }}>
                <div className={'dialog-header lmo_color_white'} style={{
                    textAlign: titleAlign
                }}>
                    {title}
                </div>
                <div className={'dialog-content'} style={{
                    height: `${height}px`
                }}>
                    {children}
                </div>
                <div className={'dialog-controls-buttons'}>
                    {
                        showConfirm ? <button onClick={
                            (e): void => onConfirm && onConfirm(e)
                        }>{confirmLabel}</button> : ''
                    }
                    {
                        showCancel ? <button onClick={
                            (e): void => onCancel && onCancel(e)
                        }>{cancelLabel}</button> : ''
                    }
                </div>
            </div>
        </dialog>
    ), document.body);
}

export default Dialog;
