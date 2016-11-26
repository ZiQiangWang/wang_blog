#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-26 17:00:29
# @Author  : wangziqiang

from django.conf.urls import url, include
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^blog/', include('blog.urls'))
]
