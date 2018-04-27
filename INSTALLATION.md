# Installation Guide

There are **two main steps**: 
  * Install dependencies for Front-end (running in Javascript, using `create-react-app`), 
  * Install dependencies for back-end (running in Python).

**Tested platform**:  `Ubuntu 16.04 x64`

##  Front-end Setup
* Install [NodeJS](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
```shell
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

* Install dependencies for FabricJS
```shell
sudo apt-get install libcairo2-dev libjpeg-dev libgif-dev
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


## Known issues

During the installation, you might experience these issuse

### 1.  `CXXABI_1.3.11' not found

* Tensorflow 1.7 was shipped with compiled version of Ubuntu. Issuse has been discussed [here](https://github.com/tensorflow/serving/issues/819)
```shell
tensorflow_model_server: /usr/lib/x86_64-linux-gnu/libstdc++.so.6: version `CXXABI_1.3.11' not found (required by tensorflow_model_server)
```

**Solution**:
```shell
sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
sudo apt-get update
sudo apt-get install libstdc++6
```
