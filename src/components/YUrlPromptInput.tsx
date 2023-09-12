import * as React from "react";
import {useState} from "react";
import {Dialog} from "./index";
import {IsURL} from "../utils";
import YExtendTemplate from "./YExtendTemplate";

export interface YUrlPromptInputProps {
    show: boolean;
    readonly placeholder?: string;
    readonly title?: string;
    readonly onConfirm?: null | (<T>(urls: T) => T);
    readonly onCancel?: null | ((e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
}

function YUrlPromptInput(props: YUrlPromptInputProps): React.JSX.Element {
    const {
        placeholder = '请输入URL，一行一个',
        title = '请输入URL',
        onConfirm = null,
        onCancel = null,
        show
    } = props;

    const [value, setValue] = useState<string>('');

    return (
        <YExtendTemplate show={show}>
            <Dialog
                onCancel={onCancel}
                show={show}
                title={title}
                onConfirm={(): void => {
                    if (value === '')
                        return

                    const _: Array<string> = value.split(('\n')).filter((i: string) => {
                        return i !== '' && IsURL(i);
                    });

                    onConfirm?.<Array<string>>(_);
                }}
            >
            <textarea
                cols={70}
                rows={11}
                value={value}
                defaultValue={value}
                placeholder={placeholder}
                onChange={
                    (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
                        setValue(e.target.value as string);
                    }
                }
            />
            </Dialog>
        </YExtendTemplate>
    )
}

export default YUrlPromptInput;
