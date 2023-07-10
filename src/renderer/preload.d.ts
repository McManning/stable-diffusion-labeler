import { ElectronHandler } from '@/main/preload';
import Konva from 'konva';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;

    workspace: {
      open: () => Promise<Workspace | undefined>;
      save: (workspace: Workspace) => Promise<Workspace>;
      saveAs: (workspace: Workspace) => Promise<Workspace>;
      addFolder: (workspace: Workspace) => Promise<Workspace>;
    }

    tags: {
      generate: (workspace: Workspace) => Promise<Workspace>;
      save: (image: TrainingImage) => void;
    }

    images: {
      delete: (image: TrainingImage) => void;
    }

    // Super-global for accessing the Konva stage we use
    // from various hooks and other features.
    // TODO: Nicer solution? App-level context?
    ActiveKonvaStage: Konva.Stage | null
  }
}

export {};
