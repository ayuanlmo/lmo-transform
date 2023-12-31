import * as React from "react";
import Dialog from "../components/Dialog";
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
                height={334}
                show={show}
                titleAlign={'start'}
                title={'日志'}
                confirmLabel={'关闭'}
            >
                <textarea
                    className={'lmo_color_white'}
                    defaultValue={logContent}
                    style={{
                        width: '650px'
                    }}
                    readOnly
                    rows={19}
                    cols={90}
                />
            </Dialog> : <></>
    );
}

export default ShowLogs;
