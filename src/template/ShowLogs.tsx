import * as React from "react";
import Dialog from "../template/Dialog";
import {useSelector} from "react-redux";
import {RootState} from "../lib/Store";

interface ShowLogsProps {
    show: boolean;

    onConfirm?(): void | null;
}

function ShowLogs(props: ShowLogsProps): React.JSX.Element {
    const {
        show = false,
        onConfirm = null
    } = props;
    const logContent: string = useSelector((state: RootState) => state.app.logContent);

    return (
        show ?
            <Dialog
                onConfirm={
                    (): void | null => onConfirm && onConfirm()
                }
                showCancel={false}
                width={700}
                height={300}
                show={show}
                titleAlign={'start'}
                title={'日志'}
                confirmLabel={'关闭'}
            >
                <textarea
                    className={'lmo_color_white'}
                    defaultValue={logContent}
                    readOnly
                    rows={19}
                    cols={90}
                />
            </Dialog> : <></>
    );
}

export default ShowLogs;
