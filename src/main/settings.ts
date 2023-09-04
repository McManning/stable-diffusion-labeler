import Store from 'electron-store';

type SettingsType = {
  theme: 'dark' | 'light' | 'system';
  recentWorkspaces: string[];
};

const settings = new Store<SettingsType>({
  defaults: {
    theme: 'system',
    recentWorkspaces: [],
  },
});

export default settings;
