import {createSlice} from '@reduxjs/toolkit';
import {SpliceArray} from "../../utils";
import Storage from "../Storage";
import AppConfig from "../../conf/AppConfig";

const local_output_path: string | null = Storage.Get('output_path');

export const counterSlice = createSlice({
    name: 'app',
    initialState: {
        selectedFiles: [],
        outputPath: local_output_path === null ? AppConfig.system.tempPath : local_output_path
    },
    reducers: {
        setSelectedFiles: (state, data): void => {
            state.selectedFiles.push(...data.payload);
        },
        deleteSelectedFilesItem: (state, {payload}): void => {
            state.selectedFiles = SpliceArray(state.selectedFiles, payload);
        },
        setOutputPath: (state, {payload}): void => {
            state.outputPath = payload as string;
            Storage.Set('output_path', payload as string);
        }
    },
});

export const {setSelectedFiles, deleteSelectedFilesItem, setOutputPath} = counterSlice.actions;

export default counterSlice.reducer;
