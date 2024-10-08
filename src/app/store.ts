import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appReducer from '../appSlice';
import organizationReducer from '../slices/organizationSlice';
import collectionReducer from '../slices/collectionSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    organization: organizationReducer,
    collections: collectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
