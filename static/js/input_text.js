$(function () {
    $('label.input-text').dblclick(function(event) {
        var value = $(this).text()
        var input = $('<input type="text" value="'+ value +'">')
        $(this).hide()
        $(this).after(input.select())
    });
})
