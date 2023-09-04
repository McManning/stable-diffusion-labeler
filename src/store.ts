import { configureStore } from '@reduxjs/toolkit';

import { reducer as settings } from '@/features/settings';
import { reducer as canvas } from '@/features/canvas';
import { reducer as workspace } from '@/features/workspace';

export const store = configureStore({
  reducer: {
    settings,
    canvas,
    workspace,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
