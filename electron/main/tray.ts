import { app, BrowserWindow, Menu, Tray } from 'electron';
import { join } from 'path';
import Store from 'electron-store';

/**
 * @see https://www.electronjs.org/docs/api/tray
 */

type UserConfigType = Store<{
  AtualizacaoAutomatica: boolean;
  NumeroDeRegistro: string;
}>;

export function createTray(userConfig: UserConfigType) {
  app.whenReady().then(() => {
    const window = BrowserWindow.getAllWindows().find(
      (findWindow) => !findWindow.isDestroyed()
    );

    if (window) {
      /**
       * Adiona o ícone de aplicativo minimizado na bandeja do sistema.
       * E adiciona o nome ao ícone quando o "hover" é realizado.
       */
      const iconPath = join(
        __dirname,
        app.isPackaged ? '../../web' : '../../../public'
      );
      const tray = new Tray(join(iconPath, 'trayicon.ico'));
      tray.setToolTip(app.getName());

      /**
       * Adiciona um menu de contexto ao ícone de aplicativo minimizado na bandeja do sistema.
       */
      const contextMenu = Menu.buildFromTemplate([
        {
          label: 'Abrir',
          click: () => window.show(),
        },
        {
          label: 'Opções',
          click() {
            return userConfig.openInEditor();
          },
        },
        {
          label: 'Fechar',
          click: () => {
            window.destroy();
            tray.destroy();
            app.quit();
          },
        },
      ]);

      tray.setContextMenu(contextMenu);

      /**
       * Adiciona um evento de clique ao ícone de aplicativo minimizado na bandeja do sistema.
       * Ao clicar no ícone, o aplicativo é exibido.
       */
      tray.on('click', () => window.show());

      /**
       * Destroi o ícone quando o aplicativo for fechado.
       */
      app.on('before-quit', () => {
        tray.destroy();
      });
    }
  });
}
