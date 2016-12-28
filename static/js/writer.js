$(function() {

    var cur_fmid = undefined
    var cur_amid = undefined
    var folder_article_tree = new Object()

    init_tree()

    function init_tree () {
        init_folder_fmids()
        init_article_amids()
     }

    function init_folder_fmids () {
        $('.folder-item').each(function(index, el) {
            var fmid = $(this).data('fmid')
            folder_article_tree[fmid] = undefined

            if ($(this).hasClass('active')) {
                cur_fmid = fmid
            }
        });
    }
    function init_article_amids() {
        $('.article-item').each(function(index, el) {
            if ($(this).hasClass('active')) {
                cur_amid = $(this).data('amid')
            }
        });
    }

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


    $('#saveFileBtn').click(function(event) {
        var content = $('#summernote').summernote('code');
        var title = $('#title').val();
        console.log(cur_amid)
        $.ajax({
            url: '/save_article/',
            type: 'POST',
            dataType: 'json',
            data: {amid:cur_amid, title: title, content:content}
        })
        .done(function(data) {
            folder_article_tree[cur_fmid][cur_amid] = data.article

            refresh_article_list(folder_article_tree[cur_fmid])
            notify(data.success,data.msg)
        })
        .fail(function() {
            notify(false,'ajax请求失败')
        })
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

        fmids = Object.keys(folder_article_tree)

        // if (fmids[index] != cur_fmid)
        {
            cur_fmid = fmids[index]
            expand_folder(cur_fmid)
        }

    });

    // 点击文集，展开相应的文章
    function expand_folder (fmid) {

        if (folder_article_tree[cur_fmid] == undefined) {
            $.ajax({
                url: '/get_articles_of_folder/',
                type: 'GET',
                dataType: 'json',
                data: {fmid: fmid},
            })
            .done(function(data) {
                if (data.success) {

                    var ar = data.articles
                    var tmp = new Object()
                    for (var i = 0; i < ar.length; i++) {
                        tmp[ar[i].mid] = ar[i]
                    }
                    folder_article_tree[fmid] = tmp

                    refresh_article_list(ar)
                }
            })
            .fail(function() {
                notify(false,'ajax请求失败')
            })
        }else {
            var tmp = new Array()
            var i=0
            for (var k in folder_article_tree[cur_fmid]){
                tmp[i] = folder_article_tree[cur_fmid][k]
                i++
            }
            refresh_article_list(folder_article_tree[cur_fmid])
        }
    }

    function object_to_array (obj) {
        var tmp = new Array()
        var i=0
        for (var k in obj){
            tmp[i] = obj[k]
            i++
        }
        return tmp
    }
    function refresh_article_list (obj) {

        ar = object_to_array(obj)

        $('#article .article-item').each(function(index, el) {
            $(this).remove()
        })

        for (var i = 0; i < ar.length; i++) {
            var new_article = $('<a class="list-group-item article-item '+(i == 0 ? "active":"")+'" data-amid="'+ar[i]['mid']+'"> \
                                    <div> \
                                        <div class="brief-text article-item-title">'+ar[i]['title']+'</div> \
                                        <span class="glyphicon glyphicon-trash pull-right" '+ (i != 0 ? "style=display:none;":"") +'></span> \
                                    </div> \
                                    <div class="brief-text article-item-content"> \
                                        '+ar[i]['abstract']+'\
                                    </div> \
                                    <div class="article-item-footer"> \
                                        <span>'+ar[i]['update_time']+'</span> \
                                        <span>'+ar[i]['num_of_words']+'字</span> \
                                    </div> \
                                </a>')
            $('#article').append(new_article)
        }
        if (ar.length) {
            set_summernote_code(ar[0]['title'],ar[0]['content'])
            cur_amid = ar[0].mid
        }else{
            cur_amid = undefined
        }
    }

    // 切换笔记的激活状态
    $('.article-item').click(function(event) {
        $(".article-item").removeClass('active');
        $(this).addClass('active');
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
                    <span class="glyphicon glyphicon-folder-close"> \
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

        var tmp = new Object()
        tmp[fmid]=undefined
        folder_article_tree = Object.assign(tmp, folder_article_tree)
        cur_fmid = fmid
        cur_amid = undefined
        console.log(folder_article_tree)
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
            var new_article = $('<a class="list-group-item article-item active" data-amid='+ar['mid']+'> \
                    <div> \
                        <div class="brief-text article-item-title">'+ar['title']+'</div> \
                        <span class="glyphicon glyphicon-trash pull-right"></span> \
                    </div> \
                    <div class="brief-text article-item-content"> \
                        '+ar['abstract']+'\
                    </div> \
                    <div class="article-item-footer"> \
                        <span>'+ar['update_time']+'</span> \
                        <span>'+ar['num_of_words']+'字</span> \
                    </div> \
                </a>')
            $('#article > .new-article').after(new_article)

            var tmp = new Object()
            tmp[ar.mid]=ar
            folder_article_tree[cur_fmid] = Object.assign(tmp,folder_article_tree[cur_fmid])
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

        index = $('.article-item').index(this)

        articles_obj = folder_article_tree[cur_fmid]
        if (articles_obj == undefined) {
            // TODO
        }else {
            amids = Object.keys(articles_obj)
            if (amids[index] != cur_amid) {
                cur_amid = amids[index]
                cur_obj = articles_obj[cur_amid]
                set_summernote_code(cur_obj.title, cur_obj.content)
            }
        }
    });

    function set_summernote_code (title, content) {
        $('#title').val(title)
        $('#summernote').summernote('code', content);
    }

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
