import { app, BrowserWindow, Menu, MenuItem } from 'electron';

/**
 * @see https://www.electronjs.org/docs/api/menu-item
 * @see https://www.electronjs.org/docs/api/menu
 * @see https://www.electronjs.org/docs/api/web-contents#event-context-menu
 */

app.whenReady().then(() => {
  const window = BrowserWindow.getAllWindows().find(
    (findWindow) => !findWindow.isDestroyed()
  );

  if (window) {
    window.webContents.on('context-menu', (_, params) => {
      const {
        misspelledWord,
        dictionarySuggestions,
        editFlags: { canCopy, canPaste },
      } = params;

      const enableMenu = canCopy || canPaste;

      if (enableMenu) {
        const menu = new Menu();

        /**
         * Verifica se o texto selecionado é uma palavra incorreta.
         */
        if (misspelledWord !== '') {
          /**
           * Adiciona as sugestões de correção de palavras incorretas.
           */
          if (dictionarySuggestions.length > 0) {
            dictionarySuggestions.forEach((suggestion) => {
              menu.append(
                new MenuItem({
                  label: `${suggestion}`,
                  click: () =>
                    window.webContents.replaceMisspelling(suggestion),
                })
              );
            });

            menu.append(new MenuItem({ type: 'separator' }));
          }

          /**
           * Adiciona a opção de adicionar a palavra incorreta ao dicionário.
           */
          if (misspelledWord) {
            menu.append(
              new MenuItem({
                label: '📘 Adicionar ao dicionário',
                click: () =>
                  window.webContents.session.addWordToSpellCheckerDictionary(
                    misspelledWord
                  ),
              })
            );
          }

          menu.append(new MenuItem({ type: 'separator' }));
        }

        /**
         * Adiciona a opção de copiar.
         */
        if (canCopy) {
          menu.append(
            new MenuItem({
              label: '✒ Copiar',
              click: () => window.webContents.copy(),
            })
          );
        }

        /**
         * Adiciona a opção de colar.
         */
        if (canPaste) {
          menu.append(
            new MenuItem({
              label: '📝 Colar',
              click: () => window.webContents.paste(),
            })
          );
        }

        menu.popup();
      }
    });
  }
});
