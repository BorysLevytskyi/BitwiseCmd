import { Operand, ListOfNumbers, BitwiseOperation, Operator } from '../expression';
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
    expressionElement: ExpressionElement;
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

    static buildListOfNumbers(expr : ListOfNumbers, config : Config) {
        var model = new BitwiseResultViewModel(config);
        expr.children.forEach(op => model.addScalarRow(op));
        model.maxNumberOfBits = BitwiseResultViewModel.applyEmphasizeBytes(model.maxNumberOfBits, model.emphasizeBytes);
        return model;
    }

    static buildBitwiseOperation (expr : BitwiseOperation, config : Config) {
        
        var op = expr.children[0],
            i = 0, len = expr.children.length,
            ex, m = new BitwiseResultViewModel(config);

        var prev : Operand | null = null;

        for (;i<len;i++) {
            ex = expr.children[i];
            if(ex instanceof Operand) {
                m.addScalarRow(ex);
                prev = ex;
                continue;
            }

            var eo = ex as Operator;

            // If it a single NOT expression
            if(eo.isNotExpression) {
                m.addOperatorRow(eo);
                var notResult = eo.evaluate();
                m.addExpressionResultRow(notResult);
                prev = notResult;
            }
            else if(eo.isShiftExpression){
                prev = eo.evaluate(prev as Operand);
                m.addShiftExpressionResultRow(eo, prev);
            } else {

                prev = eo.evaluate(prev as Operand);
                m.addOperatorRow(eo);
                m.addExpressionResultRow(prev);
            }
        }

        m.maxNumberOfBits = BitwiseResultViewModel.applyEmphasizeBytes(m.maxNumberOfBits, m.emphasizeBytes);
        return m;
    };

    addScalarRow(expr: Operand) {
        const bits = calc.numberOfBitsDisplayed(expr.value);
        this.maxNumberOfBits = Math.max(bits, this.maxNumberOfBits);
        this.items.push({ 
            sign:'', 
            css: '',
            expressionElement: expr,
            allowFlipBits: this.allowFlipBits,
            label: '',
            maxBitSize: expr.value.maxBitSize,
        });
    };

    addOperatorRow(expr: Operator) {
        
        const resultNumber = expr.isNotExpression ? expr.evaluate() : expr.getUnderlyingOperand();
        const bits = calc.numberOfBitsDisplayed(resultNumber.value);
        
        this.maxNumberOfBits = Math.max(bits, this.maxNumberOfBits);
        
        this.items.push({ 
            sign: expr.operator, 
            css: '',
            label: this.getLabel(resultNumber),
            expressionElement: expr.operand,
            allowFlipBits: this.allowFlipBits,
            maxBitSize: resultNumber.value.maxBitSize
        });
    };
 
    addShiftExpressionResultRow(expr : Operator, resultExpr : Operand) {
        const bits = calc.numberOfBitsDisplayed(resultExpr.value);
        this.maxNumberOfBits = Math.max(bits, this.maxNumberOfBits);
        const child = expr.operand.getUnderlyingOperand();
        this.items.push({
            sign: expr.operator + formatter.numberToString(child.value, child.base),
            css: 'expression-result',
            expressionElement: resultExpr,
            allowFlipBits: false,
            label: '',
            maxBitSize: resultExpr.value.maxBitSize
        });
    };

    addExpressionResultRow(expr : Operand) {
        const bits = calc.numberOfBitsDisplayed(expr.value);
        this.maxNumberOfBits = Math.max(bits, this.maxNumberOfBits);
        this.items.push({ 
            sign:'=', 
            css: 'expression-result',
            expressionElement: expr, 
            allowFlipBits: false,
            label: '',
            maxBitSize: expr.value.maxBitSize
        });
    };

    getLabel (op: Operand) : string {

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

        console.log(expr);

        if(expr instanceof ListOfNumbers) {
            return BitwiseResultViewModel.buildListOfNumbers(expr, { 
                emphasizeBytes: emphasizeBytes, 
                allowFlipBits: true 
            });
        }

        if(expr instanceof BitwiseOperation) {
            return BitwiseResultViewModel.buildBitwiseOperation(expr, { 
                emphasizeBytes: emphasizeBytes,
                allowFlipBits: true 
            });
        }

        throw new Error("Cannot build BitwiseExpressionViewModel out of expression " + expr);
    }
}