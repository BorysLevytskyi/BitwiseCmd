import { Operand, ExpressionOperand } from '../../../expression';

export default class BitwiseExpressionViewModel {

    constructor({ emphasizeBytes = false, allowFlipBits = false } = {}) {
        this.emphasizeBytes = emphasizeBytes;
        this.items = [];
        this.maxNumberOfBits = 0;
        this.allowFlipBits = allowFlipBits === true;
    }

    static buildListOfNumbers(expr, config) {
        var model = new BitwiseExpressionViewModel(config);
        expr.numbers.forEach(op => model.addOperand(op));
        model.maxNumberOfBits = BitwiseExpressionViewModel.getNumberOfBits(model.maxNumberOfBits, model.emphasizeBytes);
        return model;
    }

    static buildMultiple (expr, config) {
        console.log('build: ', expr);
        var op = expr.expressions[0],
            i = 0, l = expr.expressions.length,
            ex, m = new BitwiseExpressionViewModel(config);

        var cur = null;
        for (;i<l;i++) {
            var ex = expr.expressions[i];
            if(ex instanceof Operand) {
                m.addOperand(ex);
                cur = ex;
                console.log('cur is ', cur)
                continue;
            }

            // If it a single NOT expression
            if(ex.isNotExpression) {
                m.addExpression(ex);
                var notResult = ex.apply();
                m.addExpressionResult(notResult);
                cur = notResult;
            }
            else if(ex.isShiftExpression){
                console.log('cur is ', cur)
                cur = ex.apply(cur);
                m.addShiftExpressionResult(ex, cur);
            } else {

                cur = ex.apply(cur);
                m.addExpression(ex);
                m.addExpressionResult(cur);
            }
        }

        m.maxNumberOfBits = BitwiseExpressionViewModel.getNumberOfBits(m.maxNumberOfBits, m.emphasizeBytes);
        return m;
    };

    static buildNot (expression, config) {
        
        var m = new BitwiseExpressionViewModel(config);
        m.addExpression(expression);
        m.addExpressionResult(expression.apply());
        m.maxNumberOfBits = BitwiseExpressionViewModel.getNumberOfBits(m.maxNumberOfBits, m.emphasizeBytes);
        return m;
    };

    addOperand(operand) {
        this.maxNumberOfBits = Math.max(operand.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({ 
            sign:'', 
            css: '',
            operand: operand,
            allowFlipBits: this.allowFlipBits
        });
    };

    addExpression(expression) {
        this.maxNumberOfBits = Math.max(expression.operand.apply().getLengthInBits(), this.maxNumberOfBits);
        
        this.items.push({ 
            sign: expression.sign, 
            label: this.getLabel(expression.operand),
            operand: expression.operand,
            allowFlipBits: this.allowFlipBits
        });
    };

    addShiftExpressionResult(expression, resultOperand) {
        this.maxNumberOfBits = Math.max(resultOperand.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({
            sign: expression.sign + expression.operand.toString(),
            css: 'expression-result',
            operand: resultOperand,
            allowFlipBits: false
        });
    };

    addExpressionResult(operand) {
        this.maxNumberOfBits = Math.max(operand.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({ 
            sign:'=', 
            css: 'expression-result',
            operand: operand, 
            allowFlipBits: false
        });
    };

    getLabel (op) {
        
        if(op.kind == 'bin') {
            return op.dec;
        }

        return op.toString();
    }

    // TODO: move this method elsewhere. It is also used in LisOfNumbersExpressionView.js
    static getNumberOfBits = function (bits, emphasizeBytes) {
        if(emphasizeBytes && bits % 8 != 0) {
             if(bits < 8) {
                 return 8;
             }

             var n = bits - (bits % 8);
             return n + 8;
        }

        return bits;
    };
}