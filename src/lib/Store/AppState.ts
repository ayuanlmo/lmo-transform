import {createSlice} from '@reduxjs/toolkit';
import {getCurrentDateTime, SpliceArray} from "../../utils";
import AppConfig from "../../conf/AppConfig";
import UsrLocalConfig, {DefaultUserConfig, defaultUserConfig} from "../UsrLocalConfig";

const local_output_path: string = UsrLocalConfig.getLocalUserConf('output_path') as string;
const pTasksLength: number = UsrLocalConfig.getLocalUserConf('parallel_tasks_length') as number;

export const counterSlice = createSlice({
    name: 'app',
    initialState: {
        globalLoading: false,
        selectedFiles: [],
        outputPath: local_output_path === null ? AppConfig.system.tempPath + `${AppConfig.appName}` : local_output_path,
        parallelTasksLength: pTasksLength,
        logContent: `[${getCurrentDateTime()}]\n程序启动...\n\n`,
        globalType: 'video',
        currentParallelTasks: 0,
        appConfig: defaultUserConfig
    },
    reducers: {
        // 设置配置文件
        setConfig: (state, {payload}): void => {
            const _payload = payload as { key: keyof DefaultUserConfig, data: never } | DefaultUserConfig;

            if ('key' in _payload)
                state.appConfig[_payload.key] = _payload.data;
            else
                state.appConfig = _payload;
        },
        initConfig: (state): void => {
            state.appConfig = UsrLocalConfig.getLocalUserConf<DefaultUserConfig>() as DefaultUserConfig;
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
    setOutputPath,
    setParallelTasksLen,
    pushLog,
    setGlobalLoading,
    setGlobalType,
    setCurrentParallelTasks
} = counterSlice.actions;

export default counterSlice.reducer;
