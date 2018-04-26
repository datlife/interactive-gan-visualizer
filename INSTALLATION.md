# Installation Guide
This guide details how to start the interactive image generator web application. There are **two main steps**: install dependencies for Front-end (running in Javascript, using `create-react-app`), install dependencies for back-end (running in Python).

**Tested platform**:  `Ubuntu 16.04 x64`

##  Front-end Setup
* Install [NodeJS](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
```shell
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

* Install dependencies for FabricJS
```shell
sudo apt-get install libgif-dev
```
* Set up client dependencies, first `cd` to client directory
```
cd client        # contain `package.json`
npm install      # install required dependencies
```

## Backend Setup

* Install `tensorflow-serving-model`
```shell
echo "deb [arch=amd64] http://storage.googleapis.com/tensorflow-serving-apt stable tensorflow-model-server tensorflow-model-server-universal" | sudo tee /etc/apt/sources.list.d/tensorflow-serving.list
curl https://storage.googleapis.com/tensorflow-serving-apt/tensorflow-serving.release.pub.gpg | sudo apt-key add -
sudo apt-get update && sudo apt-get install tensorflow-model-server
```

* Install dependencies for Back-end (`requirements.txt`)
```shell
```

