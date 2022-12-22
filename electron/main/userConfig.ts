import Store from 'electron-store';
import { app } from 'electron';
import { watch } from 'chokidar';
import { v4 as uuidv4 } from 'uuid';

type UserConfigType = Store<{
  AtualizacaoAutomatica: boolean;
  NumeroDeRegistro: string;
}>;

/**
 * @see https://www.npmjs.com/package/electron-store
 */

const userConfig = new Store({
  schema: {
    AtualizacaoAutomatica: { type: 'boolean', default: true },
    NumeroDeRegistro: { type: 'string', default: '' },
  },
}) as UserConfigType;

watch(userConfig.path).on('change', () => {
  app.relaunch();
  app.exit();
});

if (userConfig.get('NumeroDeRegistro') === '') {
  userConfig.set('NumeroDeRegistro', uuidv4());
}

export { userConfig };
