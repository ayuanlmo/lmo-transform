import {createSlice} from '@reduxjs/toolkit';
import {getCurrentDateTime, SpliceArray} from "../../utils";
import Storage from "../Storage";
import AppConfig from "../../conf/AppConfig";

const local_output_path: string | null = Storage.Get('output_path');

export const counterSlice = createSlice({
    name: 'app',
    initialState: {
        selectedFiles: [],
        outputPath: local_output_path === null ? AppConfig.system.tempPath : local_output_path,
        parallelTasksLength: Storage.Get('parallel_tasks_length') || 1,
        logContent: `[${getCurrentDateTime()}]\n程序启动...\n\n`
    },
    reducers: {
        // 设置选择的文件
        setSelectedFiles: (state, {payload}): void => {
            // @ts-ignore
            state.selectedFiles.push(...payload);
        },
        // 删除某个删除的文件
        deleteSelectedFilesItem: (state, {payload}): void => {
            state.selectedFiles = SpliceArray(state.selectedFiles, payload);
        },
        // 设置文件输出格式
        setSelectedFileOutputType: (state, {payload}): void => {
            // @ts-ignore
            state.selectedFiles[payload.index].output.type = payload.type;
            // @ts-ignore
            state.selectedFiles[payload.index].output.libs = payload.libs;
        },
        // 设置系统输出路径
        setOutputPath: (state, {payload}): void => {
            state.outputPath = payload as string;
            Storage.Set('output_path', payload as string);
        },
        // 设置并行任务数量
        setParallelTasksLen(state, {payload}): void {
            state.parallelTasksLength = payload as number;
            Storage.Set('parallel_tasks_length', payload as string);
        },
        // 添加日志内容
        pushLog(state, {payload}): void {
            const _: string = `[${getCurrentDateTime()}]\n${payload}...\n\n`;

            if (state.logContent.length >= ((19 * 90) * 5))
                state.logContent = _;
            else
                state.logContent += _;
        }
    },
});

export const {
    setSelectedFiles,
    deleteSelectedFilesItem,
    setSelectedFileOutputType,
    setOutputPath,
    setParallelTasksLen,
    pushLog
} = counterSlice.actions;

export default counterSlice.reducer;
