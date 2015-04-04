(function(){
    var bindr = {};

  bindr.bindElement = function(element, model, propertyName) {
        if(element.bindr != null) {
            return;
        }

        if(element.tagName == "INPUT") {
            bindInput(model, element, propertyName);
        }
        else {
            bindHtmlElement(model, element, propertyName);
        }

        element.bindr = {}; // will be used later
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
        intput.addEventListener('keyup', function(e){
            model[propertyName] = e.srcElement.value;
        });

        model.observe(function(property, value){
            if(window.event && window.event.srcElement == intput) {
                return;
            }

            intput.value = value;
        });
    }

    function bindHtmlElement(model, el, propertyName) {
        model.observe(function(propery, value){
            if(propery == propertyName) {
                el.innerHTML = value;
            }
        });
    }

    window.core.bindr = bindr;
})();