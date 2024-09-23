import { Action, combineSlices, configureStore, ThunkAction } from '@reduxjs/toolkit';
import inputSlice from './slices/input.slicer';

const rootReducer = combineSlices(
    inputSlice,
  );

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
    return configureStore({
      reducer: rootReducer,
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    Action
>;
