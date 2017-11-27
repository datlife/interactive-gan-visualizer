##  

#### Freeze the Tensor Graph into constants
```
python export.py -o /tmp/yolov2 --version 1
```
#### Quantize the model (Optional)
```
git clone https://github.com/tensorflow/tensorflow
```
```
cd ./tensorflow
./configure
```

```
bazel build tensorflow/tools/graph_transforms:transform_graph

```

#### Start server
```
tensorflow_model_server --port=9000 --model_name=yolov2 --model_base_path=/tmp/yolov2
```
