#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-26 17:00:29
# @Author  : wangziqiang

from django.conf.urls import url
from blog import views


urlpatterns=[
    url(r'^$', views.index, name='index'),
    url(r'^writer/$', views.writer, name='writer'),
    url(r'^save_article/$', views.save_article, name='save_article'),
    url(r'^sign_in/$', views.sign_in, name='sign_in'),
    url(r'^sign_out/$', views.sign_out, name='sign_out'),
    url(r'^sign_up/$', views.sign_up, name='sign_up'),
    url(r'^add_folder/$', views.add_folder, name='add_folder'),
]
