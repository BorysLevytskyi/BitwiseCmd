(function(){
    var bindr = {};

    bindr.bindChildren = function(container, model) {
         var elements = container.querySelectorAll('[data-bind]');
         Array.prototype.call(elements, function(el){
         });
    };

    bindr.bind = function(element, model, propertyName) {
    };

    bindr.attachView = function(viewElement, model) {
        var elements = viewElement.querySelectorAll('[data-bindr]'),
            count = elements.length,
            i =0, el;

        for(;i<count; i++){
            el = elements[i];
            this.bindElement(el, model, el.getAttribute('data-bindr'))
        }

    };


    function bindInput(model, intput, propertyName) {
        bindTextInput(intput, model, propertyName);
    }

    function bindCheckBox(element, model, propertyName) {
        element.checked = model[propertyName];

        element.addEventListener('changed', function (e) {
            model[propertyName] = e.srcElement.checked == true;
        });

        model.observe(propertyName, function (property, value) {
            if (window.event && window.event.srcElement == element) {
                return;
            }

            element.checked = value;
        });
    }


    function bindTextInput(input, model, propertyName) {
        input.value = model[propertyName];

        input.addEventListener('keyup', function (e) {
            model[propertyName] = e.srcElement.value;
        });

        model.observe(propertyName, function (property, value) {
            if (window.event && window.event.srcElement == input) {
                return;
            }

            input.value = value;
        });
    }

    function bindHtmlElement(model, el, propertyName) {
        model.observe(propertyName, function(propery, value){
            el.innerHTML = value;
        });
    }

    window.core.bindr = bindr;
})();