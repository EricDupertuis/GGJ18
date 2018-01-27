# GGJ18 Project

Bootstrap files based on : [Phaser+ES6+Webpack](https://raw.githubusercontent.com/lean/phaser-es6-webpack)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# Setup

## Quick setup with Docker

```sh
# Install the dependencies. Docker will pull the node image automagically
docker run -w /src -v $(pwd):/src node:9.4 npm install

# Run it, the app is now available on localhost:3000 and autoreloads on changes
docker run -w /src -v $(pwd):/src -p 3000:3000 -p 3001:3001 node:9.4 npm run dev
```



You'll need to install a few things before you have a working copy of the project.

## 1. Clone this repo:

Navigate into your workspace directory.

Run:

```git clone https://github.com/lean/phaser-es6-webpack.git```

## 2. Install node.js and npm:

https://nodejs.org/en/


## 3. Install dependencies:

Navigate to the cloned repo's directory.

Run:

```npm install```

## 4. Run the development server:

Run:

```npm run dev```

This will run a server so you can run the game in a browser. It will also start a watch process, so you can change the source and the process will recompile and refresh the browser automatically.

To run the game, open your browser and enter http://localhost:3000 into the address bar.


## Before pushing to the remote

Before pushing to the remote repository, make sure to run:

```npm test```

This will parse the code with ESlint. Please fix all errors before pushing to the remote because this will break the build on TravisCI.

*It's a good idea to run these tests before commiting ;)*

## Build for deployment:

Run:

```npm run deploy```

This will optimize and minimize the compiled bundle.

## Deploy for cordova:
Make sure to uncomment the cordova.js file in the src/index.html and to update config.xml with your informations. (name/description...)

More informations about the cordova configuration:
https://cordova.apache.org/docs/en/latest/config_ref/

There is 3 platforms actually tested and supported :
- browser
- ios
- android

First run (ios example):

```
npm run cordova
cordova platform add ios
cordova run ios
```

Update (ios example):

```
npm run cordova
cordova platform update ios
cordova run ios
```

This will optimize and minimize the compiled bundle.
