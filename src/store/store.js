import { configureStore } from '@reduxjs/toolkit';
import orderBookSlice from './orderBook';
import { enableMapSet } from 'immer';

enableMapSet();

export const store = configureStore({
  reducer: {
    orderBook: orderBookSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
