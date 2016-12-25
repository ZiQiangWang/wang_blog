#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-12-22 20:35:28
# @Author  : wangziqiang

from models import *
from django.utils import timezone
from collections import OrderedDict
import re

def add_article(title, content,user):
    article = Article()
    article.title = title
    article.content = content
    article.num_of_words = len(get_text_from_content(content))
    article.create_time = timezone.now()
    article.author = user
    article.save()

def get_text_from_content(content):
    r = re.compile('<\/?[^>]+(>|$)')
    text = r.sub('',content)
    return text

def email_registered(email):
    result = User.objects.filter(username=email)
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

    folder = Folder()
    folder.name = u"未分类文集"
    folder.owner = profile
    folder.save()


def get_user_profile(user):
    result = UserProfile.objects.filter(user=user)
    if len(result):
        return result[0]

    return None

def get_folders_by_user(user):
    folders = Folder.objects.filter(owner=user)
    return folders

def get_articls_by_folder(folder):
    articles = Article.objects.filter(folder=folder).order_by('update_time')
    return articles

def add_folder(name,user):
    folder = Folder()
    folder.name = name
    folder.owner = user
    folder.save()
