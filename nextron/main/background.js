import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { PythonShell } from 'python-shell';

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

ipcMain.on('run-python', (event, arg) => {
  let results;
  let options = {
    mode: 'text',
    pythonPath: '/Users/jogoodma/ENV3/bin/python',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: '/Users/jogoodma/development/E516_cloud_computing/cm/cloudmesh-javascript/nextron/python/',
    // args: ['value1', 'value2', 'value3']
  };
  if (process.env.NODE_ENV === 'production') {
    PythonShell.run('hello.py', options, function  (err, results)  {
      if  (err)  throw err;
      console.log('hello.py finished.');
      console.log('results', results);
    });
  } else {
    PythonShell.run('hello.py', options,  function  (err, results)  {
      if  (err)  throw err;
      console.log('hello.py finished.');
      console.log('results', results);
    });
  }
  // event.sender.send('result', result.stdout);
});
