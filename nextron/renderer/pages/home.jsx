import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import electron from 'electron'

// prevent SSR webpacking
const ipcRenderer = electron.ipcRenderer || false;

const Home = () => {
  const [result, setResult] = useState('no python result');

  const onClick = () => {
    if (ipcRenderer) {
      ipcRenderer.send('run-python');
    }
  };

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
        <button onClick={onClick}>Click me</button>
      </div>
    </React.Fragment>
  );
};

export default Home;
