import { app, BrowserWindow, globalShortcut } from 'electron';

export function createGlobalShorcuts() {
  const window = BrowserWindow.getAllWindows().find(
    (findWindow) => !findWindow.isDestroyed()
  );

  if (window) {
    /**
     * Registra o comando de atalho para abrir o devtools.
     * Teclas: control + shift + alt + D
     */
    app.whenReady().then(() => {
      globalShortcut.register('CommandOrControl+Shift+Alt+D', () => {
        window.webContents.toggleDevTools();
      });
    });

    /**
     * Desregistra todos os atalhos de teclado registrados quando o aplicativo é fechado.
     */
    app.on('will-quit', () => globalShortcut.unregisterAll());
  }
}
