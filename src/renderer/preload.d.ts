// import { createEventMap } from '@/main/events/frontend';
import { MainWorldApiFuncs } from '@/main/events/shared';
import { ElectronHandler } from '@/main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    // backend: ReturnType<typeof createEventMap>;
    backend: MainWorldApiFuncs;
  }
}

export {};
