import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { PythonShell } from 'python-shell';
import path from 'path'
import * as Store from 'electron-store'

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

const store = new Store({ name: 'python' });

ipcMain.on('get-python-env', (event, arg) => {
  event.returnValue = store.get('python') || {};
});

ipcMain.on('set-python', (event, arg) => {
  const pythonEnv = store.get('python') || {};
  pythonEnv.push(arg)
  store.set('python', pythonEnv);
});

ipcMain.on('run-python', (event, arg) => {
  let results;
  let options = {
    mode: 'text',
    pythonPath: '/Users/jogoodma/ENV3/bin/python',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: path.join(app.getAppPath(),'python'),
    // args: ['value1', 'value2', 'value3']
  };
  PythonShell.run('hello.py', options,  function  (err, results)  {
    if  (err)  throw err;
    console.log('hello.py finished.');
    console.log('results', results);
    event.sender.send('result', results);
  });
  event.sender.send('result', results);
});
