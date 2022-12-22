import { BrowserWindow } from 'electron';
import electronLocalshortcut from 'electron-localshortcut';

export function createLocalShorcuts() {
  const window = BrowserWindow.getAllWindows().find(
    (findWindow) => !findWindow.isDestroyed()
  );

  if (window) {
    electronLocalshortcut.register(window, 'Ctrl+Y', () => {
      // console.log('Ctrl+Y');
    });
  }
}
