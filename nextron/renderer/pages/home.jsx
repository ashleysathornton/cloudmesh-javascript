import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import electron from 'electron'
import CloudmeshEnvChooser from "../components/CloudmeshEnvChooser";

// prevent SSR webpacking
const ipcRenderer = electron.ipcRenderer || false;

const Home = () => {
  const [result, setResult] = useState('nothing to report');
  const [cmsBin, setCmsBin] = useState('');

  const inputRef = useRef(null)

  const onClick = (evt) => {
    if (ipcRenderer) {
      ipcRenderer.send('run-cms', inputRef.current.value);
    }
  };
  useEffect(() => {
    if (ipcRenderer) {
      const cmsBin = ipcRenderer.sendSync('get-cms-binary');
      console.log("Got cmsBin=", cmsBin)
      setCmsBin(cmsBin)
    }

    // Cleanup the listener on unmount.
    return () => { }
  }, []);

  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.on('result', (event, data) => {
        setResult(data);
      });
    }

    // Cleanup all listeners on unmount.
    return () => {
      if (ipcRenderer) {
        ipcRenderer.removeAllListeners('result');
      }
    };
  }, []);

  const onChange = (e) => {
    if (ipcRenderer) {
      const binary = e?.target?.files[0]?.path
      if (binary) {
        ipcRenderer.send('set-cms-binary', binary);
        setCmsBin(binary)
      }
    }
  }


  return (
    <React.Fragment>
      <Head>
        <title>Home - Cloudmesh</title>
        <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />
      </Head>
      <div>
        <h2>Cloudmesh</h2>
        <div>
          <CloudmeshEnvChooser binPath={cmsBin} onChange={onChange}/>
        </div>
        <div>
          Enter your CMS command: <input type="text" ref={inputRef}/>
          <button onClick={onClick}>Execute</button>
        </div>
        <pre>{result}</pre>
      </div>
    </React.Fragment>
  );
};

export default Home;
