import { BrowserWindow, ipcMain } from 'electron';

/**
 * @see https://www.electronjs.org/docs/api/ipc-main
 * @see https://www.electronjs.org/docs/api/ipc-renderer
 */

/**
 * Piscar o ícone na bandeja do sistema.
 */
ipcMain.on('flashFrame', () => {
  const window = BrowserWindow.getAllWindows().find(
    (findWindow) => !findWindow.isDestroyed()
  );

  if (window) {
    window.once('focus', () => window.flashFrame(false));

    window.flashFrame(true);

    if (window.isVisible() === false) window.minimize();
  }
});
