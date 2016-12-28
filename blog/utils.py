#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-12-27 11:48:03
# @Author  : wangziqiang

import hashlib
from time import time
import re
import json

from django.core import serializers

def validate_email(email):
    '''
        校验邮箱合法性
    '''
    if len(email) > 7:
        if re.match("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$", email) != None:
            return True
    return False

def md5_of_time():
    '''
        根据当前时间生成md5
    '''
    md = hashlib.md5()
    md.update(str(time()))
    return md.hexdigest()


def get_text_from_content(content):
    '''
        将markdown内容中的文字提取出来
    '''
    r = re.compile('<\/?[^>]+(>|$)')
    text = r.sub('',content)
    return text


def model_instance_to_dict(obj):
    '''
        将一个模型的实例转为字典
    '''
    serialized_obj = serializers.serialize('json', [ obj, ])

    model_dict = json.loads(serialized_obj)[0]['fields']
    return model_dict

def queryset_to_dict(obj):
    serialized_obj = serializers.serialize('json', obj)
    qset = json.loads(serialized_obj)
    result = []
    for q in qset:
        result.append(q['fields'])
    return result

if __name__ == '__main__':
    print get_text_from_content('<p><br></p>')
