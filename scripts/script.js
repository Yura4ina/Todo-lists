function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

var tasks = JSON.parse(localStorage.getItem("todoData")),
    list = document.querySelector('.todo-list');

if(!tasks){
    tasks = {}
}else{
    list.innerHTML = '';
    for (let i in tasks){
        if(tasks[i].taskStatus){
            list.innerHTML += '<div class="todo-item complete" data-id="' + tasks[i].id + '"><div class="left"><div class="checker"><span class=""><input type="checkbox" onclick="checkUncheck(this)" checked></span></div> <div class="todo-text">' + tasks[i].taskText  + '</div></div> <a href="javascript:void(0);" class="float-right remove-todo-item" onclick="onRemove(this)"><button type="button" class="btn btn-outline-danger">Remove</button></a></div>';
        }else{
            list.innerHTML += '<div class="todo-item" data-id="' + tasks[i].id + '"><div class="left"><div class="checker"><span class=""><input type="checkbox" onclick="checkUncheck(this)" ></span></div> <div class="todo-text">' + tasks[i].taskText  + '</div></div> <a href="javascript:void(0);" class="float-right remove-todo-item" onclick="onRemove(this)"><button type="button" class="btn btn-outline-danger">Remove</button></a></div>';
        }
    }
}

var items = document.querySelectorAll('.todo-item');
console.log(items.length);

function filterAll(event) {
    var this_ = event;
    console.log(this_);
    list.classList.remove('only-active');
    list.classList.remove('only-complete');
    document.querySelector('.todo-nav li.active').classList.remove('active');
    this_.classList.add('active');
};

function filterActiveTasks(event) {
    items = document.querySelectorAll('.todo-item');
    var this_ = event;
    if(items.length > 0){
        list.classList.remove('only-complete');
        list.classList.add('only-active');
        document.querySelector('.todo-nav li.active').classList.remove('active');
        this_.classList.add('active');
    }else{
        alert('Please enter new task');
    }
};

function filterCompleted(event) {
    items = document.querySelectorAll('.todo-item');
    var this_ = event;
    if(items.length > 0){
        list.classList.remove('only-active');
        list.classList.add('only-complete');
        document.querySelector('.todo-nav li.active').classList.remove('active');
        this_.classList.add('active');
    }else{
        alert('Please enter new task');
    }
};

function addTask() {
    items = document.querySelectorAll('.todo-item');
    console.log('submit');
    console.log(items.length);
    let isWordNumber = isNumeric(document.querySelector(".add-task").value.split(' ')[0]);
    let isFirstLetterNotNum = isNumeric(document.querySelector(".add-task").value.split(' ')[0][0]);
    if (document.querySelector(".add-task").value.length == 0) {
        alert('Please enter new task');
    } else if (isWordNumber) {
        alert('Task should not start from a number');
    } else if(isFirstLetterNotNum){
        alert('Task should not start from a number');
    } else{
        let id, taskText = document.querySelector(".add-task").value, taskStatus = false;
        if(items.length > 0){
            id =  document.querySelector('.todo-item:last-child').dataset.id;
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
        list.innerHTML += '<div class="todo-item" data-id="' + id + '"><div class="left"><div class="checker"><span class=""><input type="checkbox" onclick="checkUncheck(this)"></span></div> <div class="todo-text">' + document.querySelector(".add-task").value + '</div> </div> <a href="javascript:void(0);" class="float-right remove-todo-item" onclick="onRemove(this)"><button type="button" class="btn btn-outline-danger">Remove</button></a></div>';
        document.querySelector(".add-task").value = '';
    }
};

function checkUncheck(event){
    var this_ = event;
    let id = this_.closest('.todo-item').dataset.id;
    console.log(tasks[id]);
    if(this_.checked) {
        tasks[id].taskStatus = true;
        this_.setAttribute("checked", "checked");
        this_.checked = true;
        this_.closest('.todo-item').classList.add('complete');
    } else {
        tasks[id].taskStatus = false;
        this_.removeAttribute("checked");
        this_.checked = false;
        this_.closest('.todo-item').classList.remove('complete');
    }
    localStorage.setItem("todoData", JSON.stringify(tasks));
};

function onRemove(event){
    var this_ = event;
    let id = this_.closest('.todo-item').dataset.id;
    delete tasks[id];
    localStorage.setItem("todoData", JSON.stringify(tasks));
    this_.closest('.todo-item').remove();
};

