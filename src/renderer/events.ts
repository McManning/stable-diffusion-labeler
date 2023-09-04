/**
 * Frontend event handlers.
 *
 * For backend event handlers, see `main/events.ts`
 */
type ElectronEventListener = (
  event: any,
  ...args: any[]
) => Promise<void> | any;
type ElectronEvent = [string, ElectronEventListener];

/**
 * Handlers for events that the backend may be received from the backend
 */
export const BACKEND_EVENTS: ElectronEvent[] = [
  // [
  //   'tags:generate',
  //   async (event, workspace: Workspace) => {
  //     console.log('generate tags', workspace);
  //   },
  // ],
  // // Events that come from main/menu.ts.
  // // Will eventually remove and replace with our own main menu
  // // since these just proxy back to the backend anyway
  // [
  //   'workspace:new',
  //   async () => {
  //     store.dispatch(
  //       setActiveWorkspace({
  //         id: uuidv4(),
  //         name: 'New Workspace',
  //         folders: [],
  //         images: [],
  //       })
  //     );
  //   },
  // ],
  // [
  //   'workspace:add-folder',
  //   async () => {
  //     const workspace = store.getState().workspace.activeWorkspace;
  //     if (!workspace) {
  //       return;
  //     }
  //     const updatedWorkspace = await window.backend.addFolderToWorkspace(
  //       workspace
  //     );
  //     store.dispatch(updateWorkspace(updatedWorkspace));
  //   },
  // ],
  // [
  //   'workspace:open',
  //   async (event, data) => {
  //     const workspace = await window.backend.openWorkspace();
  //     if (!workspace) {
  //       return;
  //     }
  //     store.dispatch(setActiveWorkspace(workspace));
  //   },
  // ],
  // [
  //   'workspace:save-as',
  //   async () => {
  //     const workspace = store.getState().workspace.activeWorkspace;
  //     if (!workspace) {
  //       return;
  //     }
  //     const updatedWorkspace = await window.backend.saveWorkspaceAs(workspace);
  //     store.dispatch(updateWorkspace(updatedWorkspace));
  //   },
  // ],
];
