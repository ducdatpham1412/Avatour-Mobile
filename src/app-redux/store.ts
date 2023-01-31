import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import accountSlice from './account/accountSlice';
import logicSlice from './account/logicSlice';

const FindmeStore = configureStore({
    reducer: {
        accountSlice,
        logicSlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof FindmeStore.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default FindmeStore;
