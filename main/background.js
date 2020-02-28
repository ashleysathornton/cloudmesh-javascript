import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { PythonShell } from 'python-shell'
import { spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'

import Stopwatch from 'statman-stopwatch'

const pythonPath = '/Users/jogoodma/ENV3/bin/python3'
const cmsPath = '/Users/jogoodma/ENV3/bin/cms'

const timer = new Stopwatch('node', true)

fs.appendFile(
  path.join(app.getPath('home'), 'cloudmesh-ui.perf.tsv'),
  `app-start\t${timer.read(2)}\n`,
  err => {
    if (err) throw err
  }
)
const isProd = process.env.NODE_ENV === 'production'

app.allowRendererProcessReuse = true

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()
  fs.appendFile(
    path.join(app.getPath('home'), 'cloudmesh-ui.perf.tsv'),
    `app-ready-pre-paint\t${timer.read(2)}\n`,
    err => {
      if (err) throw err
    }
  )

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  })

  if (isProd) {
    await mainWindow.loadURL('app://./')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/`)
    mainWindow.webContents.openDevTools()
  }
  fs.appendFile(
    path.join(app.getPath('home'), 'cloudmesh-ui.perf.tsv'),
    `app-ready-post-paint\t${timer.read(2)}\n`,
    err => {
      if (err) throw err
    }
  )
})()

app.on('window-all-closed', () => {
  app.quit()
})

/**
 * Event listener that executes the Cloudmesh command and returns the output back to the UI.
 */

const helloPyPath = isProd
  ? path.join(app.getAppPath(), '..', 'python', 'hello.py')
  : path.join(app.getAppPath(), 'python', 'hello.py')
// const helloPyPath = path.join('python', 'hello.py')
ipcMain.on('run-python-spawn-hello-world', (event, arg) => {
  fs.appendFile(
    path.join(app.getPath('home'), 'cloudmesh-ui.perf.tsv'),
    `app-python-spawn-hello-world-exec-start\t${timer.read(2)}\n`,
    err => {
      if (err) throw err
    }
  )
  const { signal, stdout } = spawnSync(helloPyPath)
  event.sender.send('output', stdout.toString())
  fs.appendFile(
    path.join(app.getPath('home'), 'cloudmesh-ui.perf.tsv'),
    `app-python-spawn-hello-world-exec-end\t${timer.read(2)}\n`,
    err => {
      if (err) throw err
    }
  )
})

let pyShellOpts = {
  pythonPath: pythonPath,
  mode: 'text',
  pythonOptions: ['-u'], // get print results in real-time
  args: ['--nosplash'],
}
// const appPath = isProd ? app.getAppPath() : ''
const pyShellPath = isProd
  ? path.join(app.getAppPath(), '..', 'python', 'hello-pyshell.py')
  : path.join(app.getAppPath(), 'python', 'hello-pyshell.py')
const pyShell = new PythonShell(pyShellPath, pyShellOpts)
ipcMain.on('run-python-shell-hello-world', (event, arg) => {
  fs.appendFile(
    path.join(app.getPath('home'), 'cloudmesh-ui.perf.tsv'),
    `app-python-shell-hello-world-exec-start\t${timer.read(2)}\n`,
    err => {
      if (err) throw err
    }
  )
  pyShell.on('message', function(message) {
    event.sender.send('output', message)
  })
  pyShell.send('Hello from PyShell!')

  fs.appendFile(
    path.join(app.getPath('home'), 'cloudmesh-ui.perf.tsv'),
    `app-python-shell-hello-world-exec-end\t${timer.read(2)}\n`,
    err => {
      if (err) throw err
    }
  )
})

ipcMain.on('run-cms-spawn', (event, arg) => {
  fs.appendFile(
    path.join(app.getPath('home'), 'cloudmesh-ui.perf.tsv'),
    `app-cms-spawn-exec-start\t${timer.read(2)}\n`,
    err => {
      if (err) throw err
    }
  )
  const { signal, stdout } = spawnSync(cmsPath, ['vm', 'list', '--output=json'])
  event.sender.send('output', stdout.toString())
  fs.appendFile(
    path.join(app.getPath('home'), 'cloudmesh-ui.perf.tsv'),
    `app-cms-spawn-exec-end\t${timer.read(2)}\n`,
    err => {
      if (err) throw err
    }
  )
})

const options = {
  pythonPath: pythonPath,
  mode: 'text',
  pythonOptions: ['-u'], // get print results in real-time
  args: ['--nosplash'],
}
const cms = new PythonShell(cmsPath, options)
ipcMain.on('run-cms-python-shell', (event, arg) => {
  fs.appendFile(
    path.join(app.getPath('home'), 'cloudmesh-ui.perf.tsv'),
    `app-cms-pyshell-exec-start\t${timer.read(2)}\n`,
    err => {
      if (err) throw err
    }
  )
  let stdoutBuffer = []
  cms.on('message', function(message) {
    stdoutBuffer.push(message)
    if (message.startsWith('}')) {
      event.sender.send('output', stdoutBuffer.join('\n'))
      stdoutBuffer = []
    }
  })
  cms.send('vm list --output=json')

  fs.appendFile(
    path.join(app.getPath('home'), 'cloudmesh-ui.perf.tsv'),
    `app-cms-pyshell-exec-end\t${timer.read(2)}\n`,
    err => {
      if (err) throw err
    }
  )
})
