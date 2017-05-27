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

        var op = expr.expressions[0],
            i = 1, l = expr.expressions.length,
            ex, m = new BitwiseExpressionViewModel(config);

        m.addOperand(op);

        for (;i<l;i++) {
            ex = expr.expressions[i];
            op = ex.apply(op.value);

            if(ex.isShiftExpression()){
                m.addShiftExpressionResult(ex, op);
            } else {
                m.addExpression(ex);
                m.addExpressionResult(op);
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
            label: this.getLabel(operand), 
            bin: operand.bin, 
            other: operand.other, 
            css: '',
            operand: operand});
    };

    addExpression(expression) {
        this.maxNumberOfBits = Math.max(expression.operand1.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({ 
            sign: expression.sign, 
            label: this.getLabel(expression.operand1), 
            bin: expression.operand1.bin, 
            other: expression.operand1.other, 
            css: '',
            operand: expression.operand1
        });
    };

    addShiftExpressionResult(expression, resultOperand) {
        this.maxNumberOfBits = Math.max(resultOperand.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({
            sign: expression.sign + expression.operand1.input,
            label: this.getLabel(resultOperand),
            bin: resultOperand.bin,
            other: resultOperand.other,
            css: 'expression-result',
            operand: resultOperand});
    };

    addExpressionResult(operand) {
        this.maxNumberOfBits = Math.max(operand.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({ 
            sign:'=', 
            label: this.getLabel(operand), 
            bin: operand.bin, 
            other: operand.other, 
            css: 'expression-result',
            operand: operand});
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