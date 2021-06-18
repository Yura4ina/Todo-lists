$( document ).ready(function() {

    "use strict";

    var tasks = JSON.parse(localStorage.getItem("todoData"));

    console.log(tasks);
    if(!tasks){
        tasks = {}
    }else{
        $('.todo-list').html('');
        for (let i in tasks){
            if(tasks[i].taskStatus){
                $('.todo-list').append('<div class="todo-item complete" data-id="' + tasks[i].id + '"><div class="left"><div class="checker"><span class=""><input type="checkbox" checked></span></div> <div class="todo-text">' + tasks[i].taskText  + '</div></div> <a href="javascript:void(0);" class="float-right remove-todo-item"><button type="button" class="btn btn-outline-danger">Remove</button></a></div>');
            }else{
                $('.todo-list').append('<div class="todo-item" data-id="' + tasks[i].id + '"><div class="left"><div class="checker"><span class=""><input type="checkbox"></span></div> <div class="todo-text">' + tasks[i].taskText  + '</div></div> <a href="javascript:void(0);" class="float-right remove-todo-item"><button type="button" class="btn btn-outline-danger">Remove</button></a></div>');
            }
        }
    }

    var todo = function() {

        $('.todo-nav .all-task').click(function() {
            $('.todo-list').removeClass('only-active');
            $('.todo-list').removeClass('only-complete');
            $('.todo-nav li.active').removeClass('active');
            $(this).addClass('active');
        });

        $('.todo-nav .active-task').click(function() {
            if($('.todo-item').length > 0){
                $('.todo-list').removeClass('only-complete');
                $('.todo-list').addClass('only-active');
                $('.todo-nav li.active').removeClass('active');
                $(this).addClass('active');
            }else{
                alert('Please enter new task');
            }
        });

        $('.todo-nav .completed-task').click(function() {
            if($('.todo-item').length > 0){
                $('.todo-list').removeClass('only-active');
                $('.todo-list').addClass('only-complete');
                $('.todo-nav li.active').removeClass('active');
                $(this).addClass('active');
            }else{
                alert('Please enter new task');
            }
        });

        $('#todo-add-btn').on( 'click', function () {
            let isWordNumber = isNumeric($(".add-task").val().split(' ')[0]);
            let isFirstLetterNotNum = isNumeric($(".add-task").val().split(' ')[0][0]);
            if ($(".add-task").val().length == 0) {
                alert('Please enter new task');
            } else if (isWordNumber) {
                alert('Task should not start from a number');
            } else if(isFirstLetterNotNum){
                alert('Task should not start from a number');
            } else{
                let id, taskText = $(".add-task").val(), taskStatus = false;
                if($('.todo-item').length > 0){
                    id =  $('.todo-item:last-child').data('id');
                    id++;
                }else{
                    id = 0;
                }
                let task = {
                    id: id,
                    taskText: taskText,
                    taskStatus: taskStatus
                }
                tasks[id] = task;
                localStorage.setItem("todoData", JSON.stringify(tasks));
                $('.todo-list').append('<div class="todo-item" data-id="' + id + '"><div class="left"><div class="checker"><span class=""><input type="checkbox"></span></div> <div class="todo-text">' + $(".add-task").val() + '</div> </div> <a href="javascript:void(0);" class="float-right remove-todo-item"><button type="button" class="btn btn-outline-danger">Remove</button></a></div>');
                $(".add-task").val('');
            }
        });

        $(document).on( 'click', '.todo-item input', function() {
            let id = $(this).closest('.todo-item').data('id');
            console.log(tasks[id]);
            if($(this).is(':checked')) {
                tasks[id].taskStatus = true;
                $(this).closest('.todo-item').addClass('complete');
            } else {
                tasks[id].taskStatus = false;
                $(this).closest('.todo-item').removeClass('complete');
            }
            localStorage.setItem("todoData", JSON.stringify(tasks));
        });
        $(document).on( 'click', '.todo-list .todo-item .remove-todo-item', function() {
            let id = $(this).parent('.todo-item').data('id');
            delete tasks[id];
            localStorage.setItem("todoData", JSON.stringify(tasks));
            $(this).parent().remove();
        });

    };

    todo();

});
function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}