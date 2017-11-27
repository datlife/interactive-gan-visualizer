import re

regex = re.compile(r'\d')

with open('mscoco_label_map.pbtxt', 'r') as f:
    lines = f.read()
    ids    = re.findall(r'id: (.*?)\n', lines)
    labels = re.findall(r'display_name: "(.*?)"', lines)

print(len(labels))
print(ids)
with open('coco_ssd.txt','w') as f:
    for id, label in zip(ids, labels):
        f.write(id+":"+label+'\n')
