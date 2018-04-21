# Installation Guide
This guide details how to start the interactive image generator web application.
**Tested platform**:  `Ubuntu 16.04 x64`

### Installation
#### Front-end
* Install dependencies for FabricJS
```shell
sudo apt-get install libgif-dev
```

* Install NodeJS
```shell
todo

npm --version
```

* Set up client dependencies
```
cd client        # contain `package.json`
npm install      # install required dependencies
```

#### Backend

* Install `tensorflow-serving-model`
```shell
echo "deb [arch=amd64] http://storage.googleapis.com/tensorflow-serving-apt stable tensorflow-model-server tensorflow-model-server-universal" | sudo tee /etc/apt/sources.list.d/tensorflow-serving.list

curl https://storage.googleapis.com/tensorflow-serving-apt/tensorflow-serving.release.pub.gpg | sudo apt-key add -

sudo apt-get update && sudo apt-get install tensorflow-model-server
```

