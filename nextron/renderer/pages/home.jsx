import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import electron from 'electron'

// prevent SSR webpacking
const ipcRenderer = electron.ipcRenderer || false;

const Home = () => {
  const [result, setResult] = useState('no python result');
  const [pythonBin, setPythonBin] = useState('');

  const onClick = () => {
    if (ipcRenderer) {
      ipcRenderer.send('run-python');
    }
  };
  useEffect(() => {
    if (ipcRenderer) {
      const pythonEnv = ipcRenderer.sendSync('get-python-env');
      console.log(pythonEnv)
    }

    return () => {
      // componentWillUnmount()
    };
  }, []);

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.on('result', (event, data) => {
        setResult(data);
      });
    }

    return () => {
      // componentWillUnmount()
      if (ipcRenderer) {
        ipcRenderer.removeAllListeners('result');
      }
    };
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-javascript)</title>
        <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />
      </Head>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ -
          <Link href="/next">
            <a>Go to next page</a>
          </Link>
        </p>
        <img src="/images/logo.png" />
        <div>
          <h3>Please choose your Cloudmesh python binary</h3>
          <input type="file" id="file" name="file" onChange={(e) => console.log('python chosen', e.target.files[0].path)}/>
        </div>
        <div>
          <button onClick={onClick}>Run Python</button>
        </div>
        <p>{result}</p>
      </div>
    </React.Fragment>
  );
};

export default Home;
