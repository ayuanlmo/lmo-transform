import {configureStore} from '@reduxjs/toolkit';
import AppState from "./AppState";

const store = configureStore({
    reducer: {
        app: AppState
    },
});
export default store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;