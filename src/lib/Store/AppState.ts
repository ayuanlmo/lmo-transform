import {createSlice} from '@reduxjs/toolkit';
import {getCurrentDateTime, SpliceArray} from "../../utils";
import UsrLocalConfig, {defaultUserConfig} from "../UsrLocalConfig";

export const counterSlice = createSlice({
    name: 'app',
    initialState: {
        globalLoading: false,
        selectedFiles: [],
        outputPath: '',
        parallelTasksLength: 2,
        logContent: `[${getCurrentDateTime()}]\n程序启动...\n\n`,
        globalType: 'video',
        currentParallelTasks: 0,
        appConfig: defaultUserConfig
    },
    reducers: {
        // 设置配置文件
        setConfig: (state, {payload}): void => {
            state.appConfig = payload;
        },
        initConfig: (state): void => {
            state.appConfig = UsrLocalConfig.getLocalUserConf();
            state.outputPath = state.appConfig.output_path;
            state.parallelTasksLength = state.appConfig.parallel_tasks_length;
        },
        // 设置选择的文件
        setSelectedFiles: (state, {payload}): void => {
            // @ts-ignore
            state.selectedFiles.push(...payload);
        },
        // 清空选择的文件
        clearSelectedFiles(state): void {
            state.selectedFiles = [];
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
        // 设置状态
        setSelectedFileStatus(state, {payload}): void {
            // @ts-ignore
            state.selectedFiles[payload.index].status = payload.status as string;
        },
        // 设置当前进度
        setSelectedFileCurrentSchedule(state, {payload}): void {
            // @ts-ignore
            state.selectedFiles[payload.index].currentSchedule = payload.data as string;
        },
        // 设置输出文件路径
        setSelectedFileOptPath(state, {payload}): void {
            // @ts-ignore
            state.selectedFiles[payload.index].optPath = payload.data as string;
        },
        // 设置系统输出路径
        setOutputPath: (state, {payload}): void => {
            state.outputPath = payload as string;
        },
        // 设置并行任务数量
        setParallelTasksLen(state, {payload}): void {
            state.parallelTasksLength = payload as number;
        },
        // 添加日志内容
        pushLog(state, {payload}): void {
            const _: string = `[${getCurrentDateTime()}]\n${payload}...\n\n`;

            if (state.logContent.length >= ((19 * 90) * 5))
                state.logContent = _;
            else
                state.logContent += _;
        },
        // 设置全局加载状态
        setGlobalLoading(state, {payload}): void {
            state.globalLoading = payload as boolean;
        },
        // 设置全局文件类型
        setGlobalType(state, {payload}) {
            state.globalType = payload;
        },
        // 设置任务
        setCurrentParallelTasks(state, {payload}) {
            if (payload === 'plus') {
                state.currentParallelTasks++;
            } else {
                state.currentParallelTasks--;
            }
        }
    },
});

export const {
    setConfig,
    initConfig,
    setSelectedFiles,
    clearSelectedFiles,
    deleteSelectedFilesItem,
    setSelectedFileOutputType,
    setSelectedFileStatus,
    setSelectedFileCurrentSchedule,
    setSelectedFileOptPath,
    setOutputPath,
    setParallelTasksLen,
    pushLog,
    setGlobalLoading,
    setGlobalType,
    setCurrentParallelTasks
} = counterSlice.actions;

export default counterSlice.reducer;
