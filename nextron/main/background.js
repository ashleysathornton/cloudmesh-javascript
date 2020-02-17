import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import * as Store from 'electron-store'
import CloudmeshWrapper from './cloudmeshWrapper'

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

// Init app data store.
const store = new Store({ name: 'cloudmesh' });

// Helper function for getting the Cloudmesh config from the store.
const getCloudmeshConfig = (store) => store.get('cloudmesh') ?? {}


/**
 * Event listener that returns the Cloudmesh binary path from the store.
 */
ipcMain.on('get-cms-binary', (event, arg) => {
  const { cmsBin = 'cms' } = getCloudmeshConfig(store)
  console.log("cmsBin = ", cmsBin)
  event.returnValue = cmsBin
})

/**
 * Event listener that sets the Cloudmesh config object in the store.
 */
ipcMain.on('set-cms-binary', (event, arg) => {
  const cmsConfig = getCloudmeshConfig(store)
  store.set('cloudmesh', { ...cmsConfig, cmsBin: arg})
})

/**
 * Event listener that executes the Cloudmesh command and returns the output back to the UI.
 */
ipcMain.on('run-cms', (event, arg) => {
  const cmsBin = getCloudmeshConfig(store)?.cmsBin ?? 'cms'
  const cmw = new CloudmeshWrapper(cmsBin)
  const args = {
    cmsCommand: arg,
    onStdout: (data) => {
      event.sender.send('result', data.toString())
    },
    onError: (err) => console.log(`Error: ${err.message}`)
  }
  cmw.exec(args)
});
