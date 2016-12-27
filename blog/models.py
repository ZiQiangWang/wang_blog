#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-12-02 19:55:29
# @Author  : wangziqiang

from django.db import models
from django.utils.encoding import python_2_unicode_compatible
from django.contrib.auth.models import AbstractUser, User
from utils import get_text_from_content,model_instance_to_dict


@python_2_unicode_compatible
class UserProfile(models.Model):
    '''
    作者类，包括中文名
    '''
    user = models.OneToOneField(User)
    cname = models.CharField(max_length=128)
    def __str__(self):
        return self.user.username

@python_2_unicode_compatible
class Folder(models.Model):
    '''
    文件夹类，用于保存文章专辑
    '''
    mid = models.CharField(max_length=128,null=False)
    name = models.CharField(max_length=128,blank=False)
    owner = models.ForeignKey("UserProfile")

    def __str__(self):
        return self.name

@python_2_unicode_compatible
class Article(models.Model):
    '''
    文章类，包括标题，内容，创建时间，更新时间，评论
    '''
    mid = models.CharField(max_length=128,null=False)
    title = models.CharField(max_length=128,blank=False)
    content = models.TextField(blank=False)
    create_time = models.DateTimeField()
    update_time = models.DateTimeField(auto_now=True)
    num_of_words = models.IntegerField(default=0)
    reads = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    keeps = models.IntegerField(default=0)
    author = models.ForeignKey("UserProfile")
    folder = models.ForeignKey("Folder")

    def content_to_text(self):
        get_text_from_content(self.content)

    def to_dict(self):
        result = model_instance_to_dict(self)
        result['content'] = get_text_from_content(self.content)
        return result

    def __str__(self):
        return self.title

@python_2_unicode_compatible
class Comment(models.Model):
    '''
    评论类，包括评论者，评论时间，
    '''
    likes = models.IntegerField(default=0)
    floor = models.IntegerField(default=1)
    user = models.ForeignKey("UserProfile")
    content = models.TextField(blank=False)
    article = models.ForeignKey("Article")
    time = models.DateTimeField(auto_now=True);

    def __str__():
        return user.username,content


class Reply_To_Comment(models.Model):
    from_uid = models.ForeignKey(UserProfile, related_name='from_uid')
    to_uid = models.ForeignKey(UserProfile, related_name='to_uid')
    content = models.TextField(blank=False)
    comment = models.ForeignKey("Comment")
    time = models.DateTimeField(auto_now=True);
