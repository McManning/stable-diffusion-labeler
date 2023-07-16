
import { configureStore } from '@reduxjs/toolkit';

import { reducer as settings } from '@/features/settings';
import { reducer as canvas } from '@/features/canvas';
import { reducer as dataset } from '@/features/dataset';
import { reducer as queue } from '@/features/queue';
import { reducer as workspace } from '@/features/workspace';
import { reducer as doodle } from '@/features/doodle';

export const store = configureStore({
  reducer: {
    settings,
    canvas,
    dataset,
    queue,
    workspace,
    doodle,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
