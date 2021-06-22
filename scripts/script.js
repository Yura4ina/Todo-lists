function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

(function(){
    'use strict'
    var ENTER_KEY = 13;
    var ESCAPE_KEY = 27;

    function keyhandlerBindingFactory(keyCode){
        return {
            init: function(element, valueAccessor, allBindingsAccessor, data, bindingContext){
                var wrappedHandler, newValueAccessor;

                wrappedHandler = function(data, event){
                    if(event.keyCode == keyCode){
                        valueAccessor().call(this, data, event);
                    }
                };

                newValueAccessor = function(){
                    return{
                        keyup: wrappedHandler
                    };
                };
                ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data, bindingContext);
            }
        };
    }

    ko.bindingHandlers.enterKey = keyhandlerBindingFactory(ENTER_KEY);

    ko.bindingHandlers.escapeKey = keyhandlerBindingFactory(ESCAPE_KEY);

    ko.bindingHandlers.selectAndFocus = {
        init: function(element, valueAccessor, allBindingsAccessor, bindingContext){
            ko.bindingHandlers.hasFocus.init(element, valueAccessor, allBindingsAccessor, bindingContext);
            ko.utils.registerEventHandler(element, 'focus', function(){
                element.focus();
            });
        },
        update: function(element, valueAccessor){
            ko.utils.unwrapObservable(valueAccessor());
            setTimeout(function(){
                ko.bindingHandlers.hasFocus.update(element, valueAccessor);
            }, 0);
        }

    };

    var Todo = function(title, completed){
        this.title = ko.observable(title);
        this.completed = ko.observable(completed);
        // this.editing = ko.observable(false);
    };

    var ViewModel = function(todos){

        this.todos = ko.observableArray(todos.map(function(todo){
            return new Todo(todo.title, todo.completed);
        }));

        this.current = ko.observable();

        this.showMode = ko.observable('all');

        this.query = ko.observable('');

        this.isActive = function(title){
            if(this.showMode() === title)
            {
                return 'active';
            }
            else
                return '';

        };

        this.filteredTodos = function(todo) {
            var result = true;
            switch(this.showMode()){
                case 'active':
                    if(todo.completed() != false)
                        result = false;
                    break;
                case 'completed':
                    if(todo.completed() != true)
                        result = false
                    break;
            }
            if(result){
                var filter = this.query().toLowerCase();
                if(!filter){
                    return true;
                }
                else{
                    return todo.title().toLowerCase().indexOf(filter) !== -1;
                }
            }else
            {
                return false;
            }
        };


        this.add = function(){
            let isWordNumber = isNumeric(document.querySelector(".add-task").value.split(' ')[0]);
            let isFirstLetterNotNum = isNumeric(document.querySelector(".add-task").value.split(' ')[0][0]);
            if (document.querySelector(".add-task").value.length == 0) {
                alert('Please enter new task');
            } else if (isWordNumber) {
                alert('Task should not start from a number');
            } else if(isFirstLetterNotNum){
                alert('Task should not start from a number');
            } else{
                var current = this.current().trim();
                if(current){
                    this.todos.push(new Todo(current,false));
                    this.current('');
                }
                document.querySelector(".add-task").value = '';
            }
        }.bind(this);

        this.remove = function(todo){
            this.todos.remove(todo);
        }.bind(this);

        this.getLabel = function(count){
            return ko.utils.unwrapObservable(count) === 1 ? 'item' : 'items';
        }.bind(this);

        ko.computed(function(){
            localStorage.setItem('todos-knockoutjs', ko.toJSON(this.todos));
        }.bind(this)).extend({
            rateLimit: {timeout: 500, method: 'notifyWhenChangesStop'}
        });
    };

    var todos = ko.utils.parseJson(localStorage.getItem('todos-knockoutjs'));

    var viewModel = new ViewModel(todos || []);
    ko.applyBindings(viewModel);

    Router({'/:filter': viewModel.showMode}).init();

}());