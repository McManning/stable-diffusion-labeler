export type InvokeMethod = <T>(event: string, ...args: any[]) => Promise<T>;

/**
 * Methods exposed to `window.backend` that the frontend can execute
 * to trigger backend event handlers.
 */
export const createEventMap = (invoke: InvokeMethod) => ({
  toggleDarkMode: () => invoke('toggleDarkMode'),
  activateSystemTheme: () => invoke('activateSystemTheme'),
  openWorkspace: () => invoke<Workspace>('openWorkspace'),
  reloadWorkspace: (workspace: Workspace) =>
    invoke<Workspace>('reloadWorkspace', workspace),
  saveWorkspace: (workspace: Workspace) =>
    invoke<Workspace>('saveWorkspace', workspace),
  saveWorkspaceAs: (workspace: Workspace) =>
    invoke<Workspace>('saveWorkspaceAs', workspace),
  addFolderToWorkspace: (workspace: Workspace) =>
    invoke<Workspace>('addFolderToWorkspace', workspace),
  addImagesToWorkspace: (
    workspace: Workspace,
    images: TrainingImage[],
    insertAfter?: TrainingImage
  ) =>
    invoke<Workspace>('addImagesToWorkspace', workspace, images, insertAfter),
  saveImageTags: (image: TrainingImage) =>
    invoke<TrainingImage>('saveImageTags', image),
  replaceAllTags: (workspace: Workspace, replacements: ImageSearchResult[]) =>
    invoke<Workspace>('replaceAllTags', workspace, replacements),
  deleteImage: (image: TrainingImage) =>
    invoke<TrainingImage>('deleteImage', image),
  saveImageCrop: (image: TrainingImage, crop: Crop) =>
    invoke<TrainingImage>('saveImageCrop', image, crop),
});

type EventMap = {
  toggleDarkMode: () => void;
  activateSystemTheme: () => void;
  openWorkspace: () => Promise<Workspace>;
  saveWorkspace: (workspace: Workspace) => Promise<Workspace>;
};
