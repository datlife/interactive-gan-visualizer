##  
#### Download weights into  this directory
Download Link: [coco_yolov2.weights]()

#### Freeze the Tensor Graph into constants
```
python export.py -o /tmp/yolov2 --version 1
```


#### Start server
```
tensorflow_model_server --port=9000 --model_name=yolov2 --model_base_path=/tmp/yolov2
```
