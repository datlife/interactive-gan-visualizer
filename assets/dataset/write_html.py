
import os
import re
import numpy as np
import math
import time


def writeHTML(file_name, im_paths, captions, height=200, width=200):
    f=open(file_name, 'w')
    html=[]
    f.write('<!DOCTYPE html>\n')
    f.write('<html><body>\n')
    f.write('<table>\n')
    for row in range(len(im_paths)):
        f.write('<tr>\n')
        for col in range(len(im_paths[row])):
            f.write('<td>')
            f.write(captions[row][col])
            f.write('</td>')
            f.write('    ')
        f.write('\n</tr>\n')

        f.write('<tr>\n')
        for col in range(len(im_paths[row])):
            f.write('<td><img src="')
            f.write(im_paths[row][col])
            f.write('" height='+str(height)+' width='+str(width)+'"/></td>')
            f.write('    ')
        f.write('\n</tr>\n')
        f.write('<p></p>')
    f.write('</table>\n')
    f.close()


def relative_path(ref_path, target_path):
    common_prefix = os.path.commonprefix([ref_path, target_path])
    return os.path.relpath(target_path, common_prefix)

