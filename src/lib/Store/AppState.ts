import {createSlice} from '@reduxjs/toolkit';
import {SpliceArray} from "../../utils";

export const counterSlice = createSlice({
    name: 'app',
    initialState: {
        selectedFiles: []
    },
    reducers: {
        setSelectedFiles: (state, data) => {
            state.selectedFiles.push(...data.payload);
        },
        deleteSelectedFilesItem: (state, {payload}) => {
            state.selectedFiles = SpliceArray(state.selectedFiles, payload);
        }
    },
});

// 为每个 case reducer 函数生成 Action creators
export const {setSelectedFiles, deleteSelectedFilesItem} = counterSlice.actions;

export default counterSlice.reducer;
