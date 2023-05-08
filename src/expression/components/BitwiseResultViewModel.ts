import { ScalarValue, ListOfNumbersExpression, BitwiseOperationExpression, BitwiseOperator } from '../expression';
import { ExpressionElement, Expression } from '../expression-interfaces';
import calc from '../../core/calc';
import formatter from '../../core/formatter';
import exp from 'constants';

type Config = {
    emphasizeBytes: boolean;
    allowFlipBits: boolean;
}

type ExpressionRowModel = {
    sign: string;
    css: string;
    expression: ExpressionElement;
    allowFlipBits: boolean;
    label: string;
    maxBitSize: number;
}

export default class BitwiseResultViewModel {

    emphasizeBytes: boolean;
    items: ExpressionRowModel[];
    maxNumberOfBits: number;
    allowFlipBits: boolean;

    constructor({ emphasizeBytes = false, allowFlipBits = false} : Config) {
        this.emphasizeBytes = emphasizeBytes;
        this.items = [];
        this.maxNumberOfBits = 0;
        this.allowFlipBits = allowFlipBits === true;
    }

    static buildListOfNumbers(expr : ListOfNumbersExpression, config : Config) {
        var model = new BitwiseResultViewModel(config);
        expr.children.forEach(op => model.addScalarRow(op));
        model.maxNumberOfBits = BitwiseResultViewModel.applyEmphasizeBytes(model.maxNumberOfBits, model.emphasizeBytes);
        return model;
    }

    static buildBitwiseOperation (expr : BitwiseOperationExpression, config : Config) {

        var op = expr.children[0],
            i = 0, len = expr.children.length,
            ex, m = new BitwiseResultViewModel(config);

        var prev : ScalarValue | null = null;

        for (;i<len;i++) {
            ex = expr.children[i];
            if(ex instanceof ScalarValue) {
                m.addScalarRow(ex);
                prev = ex;
                continue;
            }

            var eo = ex as BitwiseOperator;

            // If it a single NOT expression
            if(eo.isNotExpression) {
                m.addOperatorRow(eo);
                var notResult = eo.evaluate();
                m.addExpressionResultRow(notResult);
                prev = notResult;
            }
            else if(eo.isShiftExpression){
                prev = eo.evaluate(prev as ScalarValue);
                m.addShiftExpressionResultRow(eo, prev);
            } else {

                prev = eo.evaluate(prev as ScalarValue);
                m.addOperatorRow(eo);
                m.addExpressionResultRow(prev);
            }
        }

        m.maxNumberOfBits = BitwiseResultViewModel.applyEmphasizeBytes(m.maxNumberOfBits, m.emphasizeBytes);
        return m;
    };

    addScalarRow(expr: ScalarValue) {
        const bits = calc.numberOfBitsDisplayed(expr.value);
        this.maxNumberOfBits = Math.max(bits, this.maxNumberOfBits);
        this.items.push({ 
            sign:'', 
            css: '',
            expression: expr,
            allowFlipBits: this.allowFlipBits,
            label: '',
            maxBitSize: expr.value.maxBitSize,
        });
    };

    addOperatorRow(expr: BitwiseOperator) {
        
        const resultNumber = expr.isNotExpression ? expr.evaluate() : expr.getUnderlyingScalarOperand();
        const bits = calc.numberOfBitsDisplayed(resultNumber.value);
        
        this.maxNumberOfBits = Math.max(bits, this.maxNumberOfBits);
        
        this.items.push({ 
            sign: expr.operator, 
            css: '',
            label: this.getLabel(resultNumber),
            expression: expr.operand,
            allowFlipBits: this.allowFlipBits,
            maxBitSize: resultNumber.value.maxBitSize
        });
    };
 
    addShiftExpressionResultRow(expr : BitwiseOperator, resultExpr : ScalarValue) {
        const bits = calc.numberOfBitsDisplayed(resultExpr.value);
        this.maxNumberOfBits = Math.max(bits, this.maxNumberOfBits);
        const child = expr.operand.getUnderlyingScalarOperand();
        this.items.push({
            sign: expr.operator + formatter.numberToString(child.value, child.base),
            css: 'expression-result',
            expression: resultExpr,
            allowFlipBits: false,
            label: '',
            maxBitSize: resultExpr.value.maxBitSize
        });
    };

    addExpressionResultRow(expr : ScalarValue) {
        const bits = calc.numberOfBitsDisplayed(expr.value);
        this.maxNumberOfBits = Math.max(bits, this.maxNumberOfBits);
        this.items.push({ 
            sign:'=', 
            css: 'expression-result',
            expression: expr, 
            allowFlipBits: false,
            label: '',
            maxBitSize: expr.value.maxBitSize
        });
    };

    getLabel (op: ScalarValue) : string {

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

    static createModel(expr : Expression, emphasizeBytes: boolean) : BitwiseResultViewModel {
        if(expr instanceof ListOfNumbersExpression) {
            return BitwiseResultViewModel.buildListOfNumbers(expr, { 
                emphasizeBytes: emphasizeBytes, 
                allowFlipBits: true 
            });
        }

        if(expr instanceof BitwiseOperationExpression) {
            return BitwiseResultViewModel.buildBitwiseOperation(expr, { 
                emphasizeBytes: emphasizeBytes,
                allowFlipBits: true 
            });
        }

        throw new Error("Cannot build BitwiseExpressionViewModel out of expression " + expr);
    }
}