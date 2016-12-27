#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-12-22 20:35:28
# @Author  : wangziqiang

from models import *
from django.utils import timezone
from collections import OrderedDict
import re
from utils import md5_of_time,get_text_from_content

def new_article(user, folder):
    article = Article()
    article.title = u"未命名文章"
    article.content = '<p><br></p>'
    article.num_of_words = len(get_text_from_content(article.content))
    article.create_time = timezone.now()
    article.author = user
    article.mid = md5_of_time()
    article.folder = folder
    article.save()

    return article


def save_article(title, content, user, folder):
    article = Article()
    article.title = title
    article.content = content
    article.num_of_words = len(get_text_from_content(content))
    article.create_time = timezone.now()
    article.author = user
    article.mid = md5_of_time()
    article.folder = folder
    article.save()

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

    add_folder(u"未分类文集",profile)

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

def new_folder(name,user):
    folder = Folder()
    folder.name = name
    folder.owner = user
    folder.mid = md5_of_time()
    folder.save()
    return folder

def rename_folder_of_mid(new_name,mid):
    folder = Folder.objects.filter(mid=mid)
    if not folder:
        return None
    f = folder[0]
    f.name = new_name
    f.save()
    return f

def get_folder_by_mid(mid):
    folder = Folder.objects.filter(mid=mid)
    if folder:
        return folder[0]
    else:
        return None

def get_articles_by_folder(folder):
    articles = Article.objects.filter(folder=folder)
    return articles

def article_in_articles(articles,mid):
    if articles.filter(mid=mid):
        return True
    else:
        return False

def get_article_by_mid(mid):
    article = Article.objects.filter(mid=mid)
    if article:
        return article[0]
    else:
        return None

