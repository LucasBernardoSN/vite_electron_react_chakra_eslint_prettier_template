import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import Store from 'electron-store';

const UPDATE_CHECK_MESSAGE = `✅ Foi realizada com SUCESSO uma verificação de atualização em ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`;
const UPDATE_CHECK_ERROR_MESSAGE = `❌ Foi realizada uma verificação de atualização, mas ocorreu um ERRO, em ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`;
const FORCE_UPDATE_CHECK_MESSAGE = `💪 Foi forçada com SUCESSO uma verificação de atualização em ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`;
const FORCE_UPDATE_CHECK_ERROR_MESSAGE = `👎 Foi forçada uma verificação de atualização, mas ocorreu um ERRO, em ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`;
const UPDATE_DOWNLOADED_MESSAGE = `⏬ Uma nova versão foi baixada e será instalada, em ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`;
const UPDATE_ERROR = `⚠️ Erro ao tentar baixar a nova versão, em ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`;

type UserConfigType = Store<{
  AtualizacaoAutomatica: boolean;
  NumeroDeRegistro: string;
}>;

export function createAutoUpdater(userConfig: UserConfigType) {
  if (app.isPackaged) {
    app.whenReady().then(() => {
      const window = BrowserWindow.getAllWindows().find(
        (findWindow) => !findWindow.isDestroyed()
      );

      if (window) {
        /**
         * Verificando se automaticamente se há atualizações.
         * Somente se o usuário permitir.
         */
        if (userConfig.get('AtualizacaoAutomatica')) {
          autoUpdater
            .checkForUpdates()
            .then(() => {
              window.webContents.send(
                'UpdateNotification',
                UPDATE_CHECK_MESSAGE
              );
            })
            .catch(() => {
              window.webContents.send(
                'UpdateNotification',
                UPDATE_CHECK_ERROR_MESSAGE
              );
            });
        }

        /**
         * A nova versão foi baixada e será instalada.
         */
        autoUpdater.on('update-downloaded', (event) => {
          window.webContents.send('UpdateDownloadedNotification', {
            message: UPDATE_DOWNLOADED_MESSAGE,
            newVersion: event.version,
          });
          autoUpdater.quitAndInstall();
        });

        /**
         * Erro ao tentar baixar a nova versão.
         */
        autoUpdater.on('error', (error) => {
          window.webContents.send('UpdateDownloadedError', {
            message: UPDATE_ERROR,
            error,
          });
        });

        /**
         * Verifica se há atualizações.
         * Quando um suporte força uma atualização.
         */
        ipcMain.on('forceCheckUpdate', () => {
          autoUpdater
            .checkForUpdates()
            .then(() => {
              window.webContents.send(
                'ForcedUpdateNotification',
                FORCE_UPDATE_CHECK_MESSAGE
              );
            })
            .catch(() => {
              window.webContents.send(
                'ForcedUpdateNotification',
                FORCE_UPDATE_CHECK_ERROR_MESSAGE
              );
            });
        });
      }
    });
  }
}
