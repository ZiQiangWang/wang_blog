#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-26 17:00:29
# @Author  : wangziqiang

from django.conf.urls import url
from blog import views


urlpatterns=[
    url(r'^writer/$', views.writer, name='writer'),
]
