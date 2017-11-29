def get_labels(model):
   if model == 'yolov2':
       return yolov2_map('assets/coco/yolov2_categories.txt')
   else:
       return ssd_map('assets/coco/ssd_categories.txt')
  

def yolov2_map(categories_file):
    with open(categories_file, mode='r') as txt_file:
        class_names = [c.strip() for c in txt_file.readlines()]
    class_names = {v: k for v, k in enumerate(class_names)}
    return class_names


def ssd_map(categories_file):
    with open(categories_file, mode='r') as txt_file:
        values = [c.strip() for c in txt_file.readlines()]
    class_names = dict()
    for s in values:
        id, key = s.split(':')
        class_names[int(id)] = key
    return class_names
