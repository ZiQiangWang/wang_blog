$(function() {

    var fmids = new Array()
    $('.folder-item').each(function(index, el) {
        fmids.push($(this).data('fmid'))
    });
    var cur_fmid = fmids[0]

    $(window).keydown(function(e) {
        if (e.keyCode == 83 && e.ctrlKey) {
            e.preventDefault();
            notify(true,"保存成功")
        }
    });

    $('#summernote').summernote({
        minHeight: null, // set minimum height of editor
        maxHeight: null, // set maximum height of editor
        callbacks: {
            onInit: function() {
                var ned = $('div.note-editor');
                var ne = $('div.note-editable');
                var ntb = $('div.note-toolbar')
                var h1 = ned.offset().top;
                var h2 = h1 + ntb.outerHeight(true);
                // 整个note区域
                ned.css({
                    'border': 'lightgrey solid thin',
                    'border-top':'none',
                    'border-radius':'0px',
                    'height':'calc(100vh - '+h1+'px)',
                    'margin-bottom':'0px'
                });
                // 文字输入区域
                ne.css({
                    'border-top':'none',
                    'border-radius':'0px',
                    'height':'calc(100vh - '+h2+'px)',
                });
                // 去掉缩放功能
                $('div.note-statusbar').remove()

                // 增加保存按钮
                var saveBtn = '<button id="saveFileBtn" type="button" class="btn btn-success btn-sm" title="保存" data-event="something" tabindex="-1">保存</button>';
                var fileGroup = '<div class="note-btn-group btn-group" style="padding-left:20px;">' + saveBtn + '</div>';
                $(fileGroup).appendTo($('.note-toolbar'));
            }
        }

    });

    reset_height();
    $(window).resize(function(event) {
        reset_height();
    });

    // 跟随浏览器大小改变高度
    function reset_height(){
       var ah = $('.auto-height')
        var h = $(window).height() - ah.offset().top
        $('.auto-height').css({
            'height': h,
        });
    }

    // 点击文集触发事件
    $('body').on('click', '.folder-item', function(event) {

        // 切换文集的打开关闭图标，以及激活状态
        $(".folder-item").removeClass('active');
        $(this).addClass('active');

        $('.folder-item > .glyphicon-folder-open').removeClass('glyphicon-folder-open').addClass('glyphicon-folder-close');
        $(this).children('.glyphicon-folder-close').removeClass('glyphicon-folder-close').addClass('glyphicon-folder-open');

        index = $('.folder-item').index(this)
        cur_fmid = fmids[index]
        // window.location.href = '/writer/folder/'+cur_fmid

    });

    // function expand_folder (fmid) {
    //     $.ajax({
    //         url: '/writer/folder/'+fmid,
    //         type: 'GET',
    //         dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
    //         data: {param1: 'value1'},
    //     })
    //     .done(function() {
    //         console.log("success");
    //     })
    // }

    function expand_articles_of_folder (fid) {
        $.ajax({
            url: '/path/to/file',
            type: 'default GET (Other values: POST)',
            dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
            data: {param1: 'value1'},
        })
        .done(function() {
            console.log("success");
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });

    }

    // 切换笔记的激活状态
    $('.article-item').click(function(event) {
        $(".article-item").removeClass('active');
        $(this).addClass('active');
    });

    $('#saveFileBtn').click(function(event) {
        var content = $('#summernote').summernote('code');
        var title = $('#title').val();
        $.ajax({
            url: '/save_article/',
            type: 'POST',
            dataType: 'json',
            data: {title: title, content:content}
        })
        .done(function(data) {
            notify(data.success,data.msg)
        })
        .fail(function() {
            notify(false,'ajax请求失败')
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

    // 创建新文集
    $('#folder > .new-folder').click(function(event) {
        $.ajax({
            url: '/new_folder/',
            type: 'POST',
            dataType: 'json',
            data: {name: '新建文集'},
        })
        .done(function(data) {
            if (data.success) {
                var new_folder = $('<div class="list-group-item new-folder-item"> \
                    <span class="glyphicon glyphicon-folder-close glyphicon-left"> \
                    <input type="text" id="new-folder-input" class="form-control folder-rename-input" value='+ data.name + '></div>').hide()
                $('#folder > .new-folder').after(new_folder)
                new_folder.slideDown('fast');

                $('#new-folder-input').select()
                .keypress(function(event) {
                    if (event.keyCode == "13") {
                       new_folder_process(data.fmid)
                    }
                })
                .blur(function(event) {
                    new_folder_process(data.fmid)
                });
            }else {
                notify(data.success,data.msg)
            }
        })
        .fail(function() {
            notify(false,'ajax请求失败')
        })
    });

    function new_folder_process (fmid) {
        var new_name = $('#new-folder-input').val()
        rename_folder(fmid,new_name)
        var new_folder = $('<a class="list-group-item folder-item" data-fmid=' + fmid +'> \
            <span class="glyphicon glyphicon-folder-open glyphicon-left"></span> \
            <div class="brief-text ">'+new_name+'</div> \
            </a>')
        fmids.unshift(new_folder.data('fmid'))
        console.log(fmids)
        $('.new-folder-item').remove()
        $('#folder > .new-folder').after(new_folder)
        new_folder.trigger('click')
    }

    //  双击文集进行重命名
    $('body').on('dblclick','.folder-item > div.brief-text',function (event) {
        var label = $(this)
        var value = label.text()
        var input = $('<input type="text" value='+ value +' class="form-control folder-rename-input">')
        label.hide()
        label.after(input)
        input[0].focus()
        input.select()

        input.blur(function(event) {
            label.text($(this).val())
            $(this).remove()
            rename_folder(cur_fmid,label.text())
            label.show()
        });

        input.keypress(function(event) {
            if (event.keyCode == "13") {
                label.text($(this).val())
                $(this).remove()
                rename_folder(cur_fmid,label.text())
                label.show()
            }
        });
    })


    //  重命名文集
    function rename_folder(fmid, new_name) {
        $.ajax({
            url: '/rename_folder/',
            type: 'POST',
            dataType: 'json',
            data: {'new_name': new_name, 'fmid':fmid},
        })
        .done(function(data) {
            notify(data.success, data.msg)
        })
        .fail(function() {
            notify(false,'ajax请求失败')
        })
    };

    // 新建文章
    $('#article > .new-article').click(function(event) {
        $.ajax({
            url: '/new_article/',
            type: 'POST',
            dataType: 'json',
            data: {fmid: cur_fmid},
        })
        .done(function(data) {
            ar = data.article
            var new_article = $('<a class="list-group-item article-item active"> \
                    <div> \
                        <div class="brief-text article-item-title">'+ar['title']+'</div> \
                        <span class="glyphicon glyphicon-trash pull-right"></span> \
                    </div> \
                    <div class="brief-text article-item-content"> \
                        '+ar['content']+'\
                    </div> \
                    <div class="article-item-footer"> \
                        <span>'+ar['update_time']+'</span> \
                        <span>'+ar['num_of_words']+'字</span> \
                    </div> \
                </a>')
            $('#article > .new-article').after(new_article)
            new_article.trigger('click')
            notify(data.success, data.msg)
        })
        .fail(function() {
            notify(false,'ajax请求失败')
        })

    });

        // 点击文章触发事件
    $('body').on('click', '.article-item', function(event) {

        $(".article-item").removeClass('active');
        $(this).addClass('active');
        $(".article-item div .glyphicon-trash").hide()
        $(this).find("div span.glyphicon-trash").show()
    });

    $('#edit').click(function(event) {
        $('#summernote').summernote({
            focus: true
        });
    });
    $('#save').click(function(event) {
        var makrup = $('#summernote').summernote('code');
        $('#summernote').summernote('destroy');
    });
});
