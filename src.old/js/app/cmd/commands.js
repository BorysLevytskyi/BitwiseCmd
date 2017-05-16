app.run(function() {
    "use strict";

    var cmd = app.get('cmd');
    var cmdConfig = app.get('cmdConfig');
    var rootView = app.get('rootView');
    var expression = app.get('expression');

    // TODO: Make as function
    cmd.command({
        canHandle: function(input) { return app.get('expression').canParse(input); },
        handle: function(input) {
            var expr = expression.parse(input);
            return this.locateModel(expr);
        },
        locateModel: function (expr) {
            if(expr instanceof expression.ListOfNumbersExpression) {
                return new app.models.BitwiseNumbersViewModel(expr);
            }

            if(expr instanceof expression.SingleOperandExpression ){
                return new app.models.BitwiseExpressionViewModel.buildNot(expr);
            }

            if(expr instanceof expression.MultipleOperandsExpression) {
                return new app.models.BitwiseExpressionViewModel.buildMultiple(expr);
            }

            return new app.models.ErrorResult('Cannot create model for expression: ' + expr.toString());
        }
    });

    function moveResultUp(helpResult) {
        var container = helpResult.parentNode.parentNode;
        if(container.parentNode.firstChild != container) {

            var out = container.parentNode;
            out.removeChild(container);
            out.insertBefore(container, out.firstChild);
        }

    }

});
