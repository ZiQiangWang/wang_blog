#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-26 17:00:29
# @Author  : wangziqiang
from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse
from django.contrib.auth import login,logout,authenticate
from django.contrib.auth.decorators import login_required
import db_utils
import traceback
import re

def index(request):
    return render(request,"index.html",{})

@login_required
def writer(request):
    user = get_user(request)
    sdata = {}
    folders = db_utils.get_folders_by_user(user)
    articles = db_utils.get_articls_by_folder(folders[0])
    sdata['folders'] = folders
    sdata['article'] = articles
    return render(request,"writer.html",sdata)


@login_required
def save_article(request):
    try:
        title = request.POST.get('title')
        content = request.POST.get('content')
        user = request.user
        user_profile = db_utils.get_user_profile(user)
        db_utils.add_article(title,content,user_profile)

    except:
        traceback.print_exc()
        return JsonResponse({'success':False, 'msg':u'保存失败'})

    return JsonResponse({'success':True, 'msg':u'保存成功'})

# 登录
def sign_in(request):

    if request.POST:
        email = request.POST['email']
        password = request.POST['password']
        user= authenticate(username=email,password=password)
        if user and user.is_active:
            login(request,user)
            return JsonResponse({'success':True,'url':'/'})
        else:
            return JsonResponse({'success':False, 'msg':u'用户名或密码错误'})
    else:
        return render(request,"sign_in.html")

# 登出
@login_required
def sign_out(request):
    logout(request)
    return redirect('/')


# 获取当前用户
def get_user(request):
    user = request.user
    user_profile = db_utils.get_user_profile(user)
    return user_profile


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
        password_confirm = request.POST['password_confirm']

        msg = ''
        if not validate_email(email):
            msg = u'邮箱格式不正确'
            return JsonResponse({'success':False, 'msg':msg})

        if password != password_confirm:
            msg = u'两次密码输入不一致'
            return JsonResponse({'success':False, 'msg':msg})

        if db_utils.email_registered(email):
            msg = u'该邮箱已被注册'
            return JsonResponse({'success':False, 'msg':msg})

        if db_utils.name_used(username):
            msg = u'该昵称已被使用'
            return JsonResponse({'success':False, 'msg':msg})

        try:
            db_utils.add_user(email,username,password)
            msg = u'注册成功'
        except Exception as e:
            msg = u'注册失败'

        user= authenticate(username=email,password=password)
        if user and user.is_active:
            login(request,user)

        return JsonResponse({'success':True, 'msg':msg, 'url':'/'})
    else:
        return render(request,"sign_up.html")

def add_folder(request):
    user = get_user(request)

    try:
        name = request.POST['name']
        db_utils.add_folder(name,user)
    except:
        traceback.print_exc()
        return JsonResponse({'success':False, 'msg':'创建文集失败'})

    return JsonResponse({'success':True, 'msg':'创建文集成功'})

