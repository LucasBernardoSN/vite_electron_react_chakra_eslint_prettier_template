import electron from 'electron';

export const sendToMain = (channel: string, ...args: unknown[]) => {
  electron.ipcRenderer.send(channel, ...args);
};

export const sendUpdateBadge = (count: number) => {
  electron.ipcRenderer.sendSync('update-badge', count);
};
