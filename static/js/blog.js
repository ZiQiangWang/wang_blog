$(function () {

    var csrftoken = Cookies.get('csrftoken');
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    //  登录

    $('#btn-sign-in').click(function () {

        var email = $('input[name=email]').val()

        if (email == "") {
            notify(false,'邮箱不能为空')
            return
        }

        var password = $('input[name=password]').val()

        if (password == "") {
            notify(false,'密码不能为空')
            return
        }

        $.ajax({
            url: '/sign_in/',
            type: 'POST',
            dataType: 'json',
            data: {'email':email, 'password':password},
        })
        .done(function(data) {
            if (data.success) {
                window.location.href = data.url
            }else {
                notify(false,data.msg)
            }
        })
    })


    // 注册

    $('#btn-sign-up').click(function () {

        var email = $('input[name=email]').val()
        if (email == "") {
            notify(false,'请输入邮箱')
            return
        }

        var username = $('input[name=username]').val()
        if (username == "") {
            notify(false,'请输入昵称')
            return
        }

        var password = $('input[name=password]').val()
        if (password == "") {
            notify(false,'请输入密码')
            return
        }

        var password_confirm = $('input[name=password-confirm]').val()
        if (password_confirm == "") {
            notify(false,'请再次输入密码')
            return
        }

        if (password != password_confirm) {
            notify(false,'两次密码不一致')
            return
        }

        $.ajax({
            url: '/sign_up/',
            type: 'POST',
            dataType: 'json',
            data: {'email':email, 'username':username, 'password':password, 'password_confirm':password_confirm},
        })
        .done(function(data) {
            if (data.success) {
                window.location.href = data.url
            }else {
                notify(data.success,data.msg)
            }
        })
    })

    $('#folder > .new-folder').click(function(event) {
        $.ajax({
            url: '/add_folder/',
            type: 'POST',
            dataType: 'json',
            data: {name: '新建文集2'},
        })
        .done(function(data) {
            if (data.success) {
                var new_folder = $('<a class="list-group-item folder-item"> \
                    <span class="glyphicon glyphicon-folder-open pull-left"></span> \
                    <div class="brief-text ">新建文集2</div> \
                    </a>')
                $('#folder').prepend(new_folder)
            }else {
                notify(data.success,data.msg)
            }
        })

    });
    function notify(success,msg) {

        var msg_item = $('<div class="alert '+ (success ? 'alert-success' : 'alert-danger') +' notify-item" role="alert">'+msg+'</div>')
            .click(function() {
                $(this).remove()
            }).hide()
        msg_item.appendTo($('#notify'))
        msg_item.slideDown('fast').delay(3000).slideUp('300', function() {
            msg_item.remove()
        });
    }

})
