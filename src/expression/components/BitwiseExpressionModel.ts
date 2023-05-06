import { ScalarExpression, ListOfNumbersExpression, BitwiseOperationExpression, OperatorExpression } from '../expression';
import { Expression, ExpressionInput } from '../expression-interfaces';
import calc from '../../core/calc';
import formatter from '../../core/formatter';

type Config = {
    emphasizeBytes: boolean;
    allowFlipBits: boolean;
}

type ExpressionItemModel = {
    sign: string;
    css: string;
    expression: Expression;
    allowFlipBits: boolean;
    label: string;
}

export default class BitwiseExpressionViewModel {

    emphasizeBytes: boolean;
    items: ExpressionItemModel[];
    maxNumberOfBits: number;
    allowFlipBits: boolean;

    constructor({ emphasizeBytes = false, allowFlipBits = false} : Config) {
        this.emphasizeBytes = emphasizeBytes;
        this.items = [];
        this.maxNumberOfBits = 0;
        this.allowFlipBits = allowFlipBits === true;
    }

    static buildListOfNumbers(expr : ListOfNumbersExpression, config : Config) {
        var model = new BitwiseExpressionViewModel(config);
        expr.children.forEach(op => model.addScalarRow(op));
        model.maxNumberOfBits = BitwiseExpressionViewModel.applyEmphasizeBytes(model.maxNumberOfBits, model.emphasizeBytes);
        return model;
    }

    static buildMultiple (expr : BitwiseOperationExpression, config : Config) {

        var op = expr.children[0],
            i = 0, len = expr.children.length,
            ex, m = new BitwiseExpressionViewModel(config);

        var prev : ScalarExpression | null = null;

        for (;i<len;i++) {
            ex = expr.children[i];
            if(ex instanceof ScalarExpression) {
                m.addScalarRow(ex);
                prev = ex;
                continue;
            }

            var eo = ex as OperatorExpression;

            // If it a single NOT expression
            if(eo.isNotExpression) {
                m.addExpressionOperandRow(eo);
                var notResult = eo.evaluate();
                m.addExpressionResultRow(notResult);
                prev = notResult;
            }
            else if(eo.isShiftExpression){
                prev = eo.evaluate(prev as ScalarExpression);
                m.addShiftExpressionResultRow(eo, prev);
            } else {

                prev = eo.evaluate(prev as ScalarExpression);
                m.addExpressionOperandRow(eo);
                m.addExpressionResultRow(prev);
            }
        }

        m.maxNumberOfBits = BitwiseExpressionViewModel.applyEmphasizeBytes(m.maxNumberOfBits, m.emphasizeBytes);
        return m;
    };

    static buildNot (expression: OperatorExpression, config : Config) {
        
        var m = new BitwiseExpressionViewModel(config);
        m.addExpressionOperandRow(expression);
        m.addExpressionResultRow(expression.evaluate());
        m.maxNumberOfBits = BitwiseExpressionViewModel.applyEmphasizeBytes(m.maxNumberOfBits, m.emphasizeBytes);
        return m;
    };

    addScalarRow(expr: ScalarExpression) {
        const bits = calc.numberOfBitsDisplayed(expr.value);
        this.maxNumberOfBits = Math.max(bits, this.maxNumberOfBits);
        this.items.push({ 
            sign:'', 
            css: '',
            expression: expr,
            allowFlipBits: this.allowFlipBits,
            label: ''
        });
    };

    addExpressionOperandRow(expr: OperatorExpression) {
        
        const resultNumber = expr.isNotExpression ? expr.evaluate() : expr.getUnderlyingScalarOperand();
        const bits = calc.numberOfBitsDisplayed(resultNumber.value);
        this.maxNumberOfBits = Math.max(bits, this.maxNumberOfBits);
        
        this.items.push({ 
            sign: expr.operator, 
            css: '',
            label: this.getLabel(resultNumber),
            expression: expr.operand,
            allowFlipBits: this.allowFlipBits
        });
    };
 
    addShiftExpressionResultRow(expr : OperatorExpression, resultExpr : ScalarExpression) {
        const bits = calc.numberOfBitsDisplayed(resultExpr.value);
        this.maxNumberOfBits = Math.max(bits, this.maxNumberOfBits);
        const child = expr.operand.getUnderlyingScalarOperand();
        this.items.push({
            sign: expr.operator + formatter.numberToString(child.value, child.base),
            css: 'expression-result',
            expression: resultExpr,
            allowFlipBits: false,
            label: ''
        });
    };

    addExpressionResultRow(expr : ScalarExpression) {
        const bits = calc.numberOfBitsDisplayed(expr.value);
        this.maxNumberOfBits = Math.max(bits, this.maxNumberOfBits);
        this.items.push({ 
            sign:'=', 
            css: 'expression-result',
            expression: expr, 
            allowFlipBits: false,
            label: '',
        });
    };

    getLabel (op: ScalarExpression) : string {

        return formatter.numberToString(op.value, op.base === 'bin' ? 'dec' : op.base)
    }

    static applyEmphasizeBytes (bits : number, emphasizeBytes : boolean) : number {
        
        if(emphasizeBytes && bits % 8 != 0) {
             if(bits < 8) {
                 return 8;
             }

             var n = bits - (bits % 8);
             return n + 8;
        }

        return bits;
    };

    static createModel(expr : ExpressionInput, emphasizeBytes: boolean) : BitwiseExpressionViewModel {
        if(expr instanceof ListOfNumbersExpression) {
            return BitwiseExpressionViewModel.buildListOfNumbers(expr, { 
                emphasizeBytes: emphasizeBytes, 
                allowFlipBits: true 
            });
        }

        if(expr instanceof BitwiseOperationExpression) {
            return BitwiseExpressionViewModel.buildMultiple(expr, { 
                emphasizeBytes: emphasizeBytes,
                allowFlipBits: false 
            });
        }

        throw new Error("Cannot build BitwiseExpressionViewModel out of expression " + expr);
    }
}