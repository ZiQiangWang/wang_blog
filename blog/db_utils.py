#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-12-22 20:35:28
# @Author  : wangziqiang

from models import *
import datetime

def add_article(title, content):
    article = Article(title=title,content=content,create_time=datetime.datetime.now())
    article.save()

def email_registered(email):
    result = User.objects.filter(email=email)
    return len(result)>0

def name_used(name):
    result = UserProfile.objects.filter(cname=name)
    return len(result)>0

def add_user(email,username,password):
    user = User()
    user.username = email
    user.set_password(password)
    user.save()

    profile = UserProfile()
    profile.user = user
    profile.cname = username
    profile.save()

