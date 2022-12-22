import { app, Menu } from 'electron';
import AutoLaunch from 'auto-launch';
import { restoreOrCreateWindow } from './mainWindow';
import { createTray } from './tray';
import { createAutoUpdater } from './autoUpdate';
import { createLocalShorcuts } from './localShorcuts';
import { createGlobalShorcuts } from './globalShortcuts';

/**
 * Desative a aceleração de hardware para economizar mais recursos do sistema.
 */
app.disableHardwareAcceleration();

/**
 * Definir o nome do aplicativo para notificações do Windows 10/11.
 */
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

/**
 * Impedir que o electron execute várias instâncias.
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);

/**
 * Encerra o processo em segundo plano se todas as janelas estiverem fechadas
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/latest/api/app#event-activate-macos
 * Event 'activate' para MacOS
 */
app.on('activate', restoreOrCreateWindow);

/**
 *  Configurações do AutoLauncher, para que o aplicativo seja iniciado automaticamente ao iniciar o sistema.
 */
const autoLauncher = new AutoLaunch({
  name: app.getName(),
});

autoLauncher
  .isEnabled()
  .then((isEnabled: boolean) => {
    if (isEnabled) return;
    autoLauncher.enable();
  })
  .catch((err: Error) => {
    throw err;
  });

/**
 * Desativar o menu padrão do Electron.
 * @see https://www.electronjs.org/docs/api/menu#main-process
 */
Menu.setApplicationMenu(null);

/**
 * Crie a janela do aplicativo quando o processo em segundo plano estiver pronto.
 */
app
  .whenReady()
  .then(() =>
    restoreOrCreateWindow().then(() => {
      import('./userConfig').then(({ userConfig }) => {
        createTray(userConfig);
        createAutoUpdater(userConfig);
        createLocalShorcuts();
        createGlobalShorcuts();
      });
    })
  )
  .catch((err) => console.error('❌ Falha ao criar janela:', err));
