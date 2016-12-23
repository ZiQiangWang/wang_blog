#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-26 17:00:29
# @Author  : wangziqiang
from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.contrib.auth import login,logout,authenticate
from django.contrib.auth.decorators import login_required
import db_utils
import simplejson
import traceback
import re


@login_required
def writer(request):
    return render(request,"writer.html",{})


def save_article(request):
    try:
        title = request.POST.get('title')
        content = request.POST.get('content')
        db_utils.add_article(title,content)
    except Exception as e:
        traceback.print_exc()

    return HttpResponse(simplejson.dumps({'msg':'HELLO'}))

# 登录
def sign_in(request):
    if request.POST:
        email = request.POST['email']
        password = request.POST['password']
        user= authenticate(username=email,password=password)
        if user and user.is_active:
            login(request,user)

        return redirect('/writer/')
    else:
        return render(request,"sign_in.html")

# 登出
@login_required
def sign_out(request):
    logout(request)
    return redirect('/writer/')

# 校验邮箱
def validate_email(email):

    if len(email) > 7:
        if re.match("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$", email) != None:
            return True
    return False


# 注册
def sign_up(request):
    if request.POST:

        email = request.POST['email']
        username = request.POST['username']
        password = request.POST['password']
        password_confirm = request.POST['password-confirm']

        if not validate_email(email):
            pass

        if password != password_confirm:
            pass

        if db_utils.email_registered(email):
            pass

        if db_utils.name_used(username):
            pass

        db_utils.add_user(email,username,password)

        return redirect('/writer/')
    else:
        return render(request,"sign_up.html")
