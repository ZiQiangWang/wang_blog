$(document).ready(function() {

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
                $('#saveFileBtn').click(function(event) {

                });
            }
        }

    });

    resetHeight();
    $(window).resize(function(event) {
        resetHeight();
    });

    // 跟随浏览器大小改变高度
    function resetHeight(){
       var ah = $('.auto-height')
        var h = $(window).height() - ah.offset().top
        $('.auto-height').css({
            'height': h,
        });
    }

    // 切换文集的打开关闭图标，以及激活状态
    $('.folder-item').click(function(event) {
        $(".folder-item").removeClass('active');
        $(this).addClass('active');

        $('.folder-item > .glyphicon-folder-open').removeClass('glyphicon-folder-open').addClass('glyphicon-folder-close');
        $(this).children('.glyphicon-folder-close').removeClass('glyphicon-folder-close').addClass('glyphicon-folder-open');;

    });

    // 切换笔记的激活状态
    $('.note-item').click(function(event) {
        $(".note-item").removeClass('active');
        $(this).addClass('active');
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
