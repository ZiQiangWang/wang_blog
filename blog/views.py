#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2016-11-26 17:00:29
# @Author  : wangziqiang
from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse
from django.contrib.auth import login,logout,authenticate
from django.contrib.auth.decorators import login_required
import db_utils
import utils
import traceback
import re

def index(request):
    return render(request,"index.html",{})

# @login_required
# def writer(request):
#     sdata = {}
#     user = get_user(request)
#     folders = db_utils.get_folders_by_user(user)
#     articles = db_utils.get_articls_by_folder(folders[0])

#     sdata['fmid']=folders[0].mid
#     if articles:
#         sdata['amid']=articles[0].mid

#     sdata['folders'] = folders
#     sdata['articles'] = articles

#     return render(request,"writer.html",sdata)

@login_required
def save_article(request):
    try:
        amid = request.POST['amid']
        title = request.POST['title']
        content = request.POST['content']
        article = db_utils.update_article(amid,title,content)

    except:
        traceback.print_exc()
        return JsonResponse({'success':False, 'msg':u'保存文章失败'})

    return JsonResponse({'success':True, 'msg':u'保存文章成功', 'article':article.to_dict()})

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

# 注册
def sign_up(request):
    if request.POST:

        email = request.POST['email']
        username = request.POST['username']
        password = request.POST['password']
        password_confirm = request.POST['password_confirm']

        msg = ''
        if not utils.validate_email(email):
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

# 添加文集
@login_required
def new_folder(request):
    user = get_user(request)

    try:
        name = request.POST['name']
        folder = db_utils.new_folder(name,user)
    except:
        traceback.print_exc()
        return JsonResponse({'success':False, 'msg':'创建文集失败'})

    return JsonResponse({'success':True, 'msg':'创建文集成功', 'fmid':folder.mid, 'name':folder.name})


# 重命名文集
@login_required
def rename_folder(request):
    user = get_user(request)

    try:
        new_name = request.POST['new_name']
        fmid = request.POST['fmid']
        folder = db_utils.rename_folder_of_mid(new_name,fmid)
    except:
        traceback.print_exc()
        return JsonResponse({'success':False, 'msg':'重命名文集失败'})

    return JsonResponse({'success':True, 'msg':'重命名文集成功', 'fmid':folder.mid, 'name':folder.name})

@login_required
def new_article(request):
    user = get_user(request)

    try:
        fmid = request.POST.get('fmid')
        folder = db_utils.get_folder_by_mid(fmid)
        article = db_utils.new_article(user, folder)
    except:
        traceback.print_exc()
        return JsonResponse({'success':False, 'msg':'新建文章失败'})


    return JsonResponse({'success':True, 'msg':'新建文章成功', 'article':article.to_dict()})

# @login_required
# def folder(request,fmid):
#     sdata = {}
#     user = get_user(request)
#     folders = db_utils.get_folders_by_user(user)

#     folder = db_utils.get_folder_by_mid(fmid)
#     if not folder:
#         sdata['fmid'] = folders[0].mid
#         articles = db_utils.get_articles_by_folder(folders[0])
#         if articles:
#             sdata['amid'] = articles[0].mid
#     else:
#         sdata['fmid']=fmid
#         articles = db_utils.get_articles_by_folder(folder)
#         if articles:
#             sdata['amid']=article[0].mid

#     sdata['folders'] = folders
#     sdata['articles'] = articles
#     return render(request,"writer.html",sdata)

@login_required
def writer(request,fmid,amid):
    sdata={}
    user = get_user(request)
    folders = db_utils.get_folders_by_user(user)

    # 根据传入的fmid判断，若fmid不存在，则使用第一个文集的第一篇文章;
    # 若fmid存在，判断amid是否属于该文集，如属于，则显示，否则显示该文集的第一篇文章
    folder = db_utils.get_folder_by_mid(fmid)
    if not folder:
        sdata['fmid'] = folders[0].mid
        articles = db_utils.get_articles_by_folder(folders[0])
        if articles:
            sdata['amid'] = articles[0].mid
    else:
        sdata['fmid'] = fmid
        articles = db_utils.get_articles_by_folder(folder)
        if articles:
            if db_utils.article_in_articles(articles,amid):
                sdata['amid'] = amid
            else:
                sdata['amid'] = articles[0].mid
    sdata['folders'] = folders
    sdata['articles'] = articles

    return render(request,"writer.html",sdata)

@login_required
def get_articles_of_folder(request):
    user = get_user(request)

    try:
        fmid = request.GET['fmid']
        folder = db_utils.get_folder_by_mid(fmid)
        articles = db_utils.get_articles_by_folder(folder)
    except:
        traceback.print_exc()
        return JsonResponse({'success':False, 'msg':'获取文章列表失败'})

    return JsonResponse({'success':True, 'msg':'获取文章列表成功', 'articles':utils.queryset_to_dict(articles)})



