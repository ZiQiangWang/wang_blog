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
    return render(request,"writer.html",{})

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

        db_utils.add_user(email,username,password)
        msg = u'注册成功'

        user= authenticate(username=email,password=password)
        if user and user.is_active:
            login(request,user)

        return JsonResponse({'success':True, 'msg':msg, 'url':'/'})
    else:
        return render(request,"sign_up.html")
