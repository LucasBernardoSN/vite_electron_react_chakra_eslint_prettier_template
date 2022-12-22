import { app, BrowserWindow, shell } from 'electron';
import { join } from 'path';
import Badge from 'electron-windows-badge';

const DIST_FOLDER_PATH = join(__dirname, '../..');
const INDEX_HTML = join(DIST_FOLDER_PATH, '/web/index.html');
const ICON_FOLDER_PATH = join(
  __dirname,
  app.isPackaged ? '../..' : '../../../electron/resources'
);
/**
 *  @see https://www.electronjs.org/docs/api/browser-window
 */

async function createWindow() {
  const browserWindow = new BrowserWindow({
    icon: join(ICON_FOLDER_PATH, 'icon.ico'),
    width: 1024,
    height: 768,
    minWidth: 500,
    minHeight: 500,
    x: 2000,
    y: 220,
    show: false, // Use o evento 'ready-to-show' para mostrar o BrowserWindow instanciado.'
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      spellcheck: true,
      webviewTag: false, // A tag de visualização da web não é recomendada. Considere alternativas como um iframe ou o BrowserView da Electron.
    },
  });

  /**
   * Se a propriedade 'show' do construtor do BrowserWindow for omitida das opções de inicialização o padrão é 'true'.
   *
   * Isso pode causar oscilações à medida que a janela carrega o conteúdo html,
   * e também tem mostrado comportamento problemático com o fechamento da janela.
   *
   * Use `show: false` e ouça o evento `ready-to-show` para mostrar a janela.
   *
   * @see https://github.com/electron/electron/issues/25012 veja o problema mencionado.
   */
  browserWindow.on('ready-to-show', () => {
    browserWindow.show();

    /**
     * Abilitando a comunicação entre o processo principal e o processo de renderização.
     */
    import('./processCommunication');

    /**
     * Abilitando o menu de contexto. (copiar, colar, etc...)
     */
    import('./contextMenu');

    /**
     *  Criando o contador de notificações.
     * @see https://www.npmjs.com/package/electron-windows-badge
     */
    // eslint-disable-next-line no-new
    new Badge(browserWindow, {});

    /**
     * Abre o DevTools quando o aplicativo estiver em desenvolvimento.
     */
    // if (!app.isPackaged) {
    //   browserWindow?.webContents.openDevTools();
    // }
  });

  /**
   * Se app.isPackaged for true, o conteúdo html será carregado diretamente no BrowserWindow. (production)
   * Se app.isPackaged for false, o conteúdo html será carregado através da url do servidor de desenvolvimento "localhost". (development)
   */
  if (app.isPackaged) {
    await browserWindow.loadFile(INDEX_HTML);
  } else {
    await browserWindow.loadURL('http://127.0.0.1:3000');
  }

  /**
   * Faz com que os links sejam abertos com o navegador padrão do sistema operacional. E não dentro do aplicativo.
   */
  browserWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  /**
   * Muda o comportamento padrão do botão de fechar da janela.
   * Em vez de fechar a janela, minimiza a janela para a bandeja do sistema.
   */
  browserWindow.on('close', (event) => {
    event.preventDefault();
    browserWindow.hide();
  });

  return browserWindow;
}

/**
 * Restaure uma BrowserWindow existente ou crie uma nova BrowserWindow.
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find(
    (findWindow) => !findWindow.isDestroyed()
  );

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}
