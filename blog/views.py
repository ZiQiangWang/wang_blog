#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-26 17:00:29
# @Author  : wangziqiang

from django.shortcuts import render, redirect

def index(request):
    pass


def writter(request):
    return render(request,"writter.html", {})
