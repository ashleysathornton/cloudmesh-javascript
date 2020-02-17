# Cloudmesh App

## Overview

The Cloudmesh App is a frontend for interacting with Cloudmesh.

## User Guide

Add instructions here on how to download the binary files.

## Developer Guide

### Requirements

* Cloudmesh with cms command installed.
* [Yarn](https://yarnpkg.com/)

### Installation

```bash
git clone git@github.com:cloudmesh/cloudmesh-javascript.git
cd cloudmesh-javascript
git checkout feature/prototypes
cd nextron
yarn
```

### Development with Hot Reloading

This command will start a development mode that allows for hot reloading of code changes.
A test app with dev console should appear and reload with each edit of code.

```bash
yarn run dev
```

### Building Binaries

To build the application binaries for all architectures run the following.

```bash
yarn run build:all
```

This will produce binaries in the `dist` directory.  Mac binaries can only be build on
OS X.

Other targets include:

```bash
yarn run build:win32
yarn run build:win64
yarn run build:mac
yarn run build:linux
``` 
