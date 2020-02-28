import React, { useEffect, useState } from 'react'
import Head from 'next/head'

import styles from './index.module.css'
import Stopwatch from 'statman-stopwatch'
import fs from 'fs'
import path from 'path'
import electron from 'electron'

const app = electron?.remote?.app ?? false
const ipcRenderer = electron.ipcRenderer ?? false

const handleOnClick = eventName => {
  ipcRenderer.send(eventName)
}

const Index = () => {
  const timer = new Stopwatch('react', true)
  const [output, setOutput] = useState(null)
  if (app) {
    fs.appendFile(
      path.join(app.getPath('home'), 'cloudmesh-ui.perf.tsv'),
      `react-rendering\t${timer.read(2)}\n`,
      err => {
        if (err) throw err
      }
    )
  }

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.on('output', (event, data) => {
        setOutput(data)
      })
    }
    return () => {
      if (ipcRenderer) {
        // unregister it
        ipcRenderer.removeAllListeners('output')
      }
    }
  }, [])

  useEffect(() => {
    if (app) {
      fs.appendFile(
        path.join(app.getPath('home'), 'cloudmesh-ui.perf.tsv'),
        `react-rendered\t${timer.read(2)}\n`,
        err => {
          if (err) throw err
        }
      )
    }
  }, [])

  return (
    <React.Fragment>
      <Head>
        <title>Cloudmesh Hello World!</title>
        <meta
          httpEquiv="Content-Security-Policy"
          content="script-src 'self' 'unsafe-inline';"
        />
      </Head>
      <main>
        <section className={styles.hello}>
          <header>
            <h1>Hello world!</h1>
          </header>
        </section>
        <section style={{ display: 'flex', justifyContent: 'space-around' }}>
          <button onClick={() => handleOnClick('run-python-spawn-hello-world')}>
            Run Hello Python w/ spawn
          </button>
          <button onClick={() => handleOnClick('run-python-shell-hello-world')}>
            Run Hello Python w/ PythonShell
          </button>
          <button onClick={() => handleOnClick('run-cms-spawn')}>
            Run CMS w/ spawn
          </button>
          <button onClick={() => handleOnClick('run-cms-python-shell')}>
            Run CMS w/ PythonShell
          </button>
        </section>
        <section>
          <header>
            <h1>Output</h1>
          </header>
          <pre>{output}</pre>
        </section>
      </main>
    </React.Fragment>
  )
}

export default Index
