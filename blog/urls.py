#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-26 17:00:29
# @Author  : wangziqiang

from django.conf.urls import url
from blog import views


urlpatterns=[
    url(r'^$', views.index, name='index'),
    url(r'^writer/$', views.writer, name='writer'),
    url(r'^writer/folder/(?P<fmid>[\w\-]+)/$', views.folder, name='folder'),
    url(r'^writer/folder/(?P<fmid>[\w\-]+)/article/((?P<amid>[\w\-]+))/$', views.article, name='article'),
    url(r'^save_article/$', views.save_article, name='save_article'),
    url(r'^sign_in/$', views.sign_in, name='sign_in'),
    url(r'^sign_out/$', views.sign_out, name='sign_out'),
    url(r'^sign_up/$', views.sign_up, name='sign_up'),
    url(r'^new_folder/$', views.new_folder, name='new_folder'),
    url(r'^rename_folder/$', views.rename_folder, name='rename_folder'),
    url(r'^new_article/$', views.new_article, name='new_article'),
]
