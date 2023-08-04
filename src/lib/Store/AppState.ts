import {createSlice} from '@reduxjs/toolkit';

export const counterSlice = createSlice({
    name: 'app',
    initialState: {
        selectedFiles: []
    },
    reducers: {
        setSelectedFiles: (state, data) => {
            state.selectedFiles = data.payload
            console.log(state.selectedFiles)
        }
    },
});

// 为每个 case reducer 函数生成 Action creators
export const {setSelectedFiles} = counterSlice.actions;

export default counterSlice.reducer;