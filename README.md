# How to build

## Install Cordova

Follow instructions on [Cordova documentation site](http://cordova.apache.org/docs/en/edge/guide_cli_index.md.html)

## Initialise project

### Create Cordova structure

     $ cordova create cryptotext fr.jpfox.cryptotext CryptoText
     $ cd cryptotext/
     $ cordova platform add android
     $ cordova plugin add http://github.com/jpfox/Custom-URL-scheme.git --variable URL_SCHEME=https --variable HOST=jpfox.fr --variable PATH_PREFIX="/c/"
     $ cordova plugin add nl.x-services.plugins.socialsharing

### Get source from github repository into this existing structure

     $ git init
     $ git remote add origin http://github/jpfox/cryptotext
     $ git fetch
     $ git checkout -t origin/master

## Build application

     $ cordova build

## Test in emulator

     $ cordova emulate

