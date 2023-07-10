import { TypedUseSelectorHook, useSelector } from 'react-redux';
import type { AppState } from '@/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

