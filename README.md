# Interactive Image Generator

This is an ONGOING research project.

-------------------

## Overview

```shell
./
├── app.py  # Flask Applicatiton
├── assets  # Stores trained ML models for inference
├── client  # UI/UX for the app, written using `create-react-app`
└── server  # Python codes for Back-end logics (object detection, image generator, etc.) 
```

## Usage

* Read  [`INSTALLATION.md`.](INSTALL.md)
* To run the app, from terminal
```
run app.py
```
* An app is available at http://localhost:3000

## TODO list

- [ ] Documentation
- [ ] Fix error handlings bug
- [ ] Update API for Image Generator 
- [ ] Add unit tests, converage tests

## Roadmap
* Integrate GAN model in `server/generator` once it is ready.
* Improve rendering speed in front-end
* Switch to `GraphQL` for client-server communtication
* Dockerize the app for cloud deployment

## Acknowledgement

 Thank your PhD student Fanyi Xiao and professor Yong J. Lee for providing me resources and support to work on this project.