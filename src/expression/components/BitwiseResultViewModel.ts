import { Operand, ListOfNumbers, BitwiseOperation, Operator } from '../expression';
import { ExpressionElement, Expression } from '../expression-interfaces';
import calc from '../../core/calc';
import formatter from '../../core/formatter';

type Config = {
    emphasizeBytes: boolean;
    allowFlipBits: boolean;
    annotateDataTypes: boolean;
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
    annotateDataTypes: boolean;

    constructor({ emphasizeBytes = false, allowFlipBits = false, annotateDataTypes = false} : Config) {
        this.emphasizeBytes = emphasizeBytes;
        this.annotateDataTypes = annotateDataTypes;
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

        const len = expr.children.length;
        const m = new BitwiseResultViewModel(config);

        let prev : Operand | null = null;

        for (let i = 0; i < len; i++) {
            const ex = expr.children[i];
            if(ex instanceof Operand) {
                m.addScalarRow(ex);
                prev = ex;
                continue;
            }

            const eo = ex as Operator;

            // If it is a single NOT expression
            if(eo.isNotExpression) {
                m.addOperatorRow(eo);
                const notResult = eo.evaluate();
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
        const bits = this.calcMaxNumberOfBits(expr);
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
        const bits = this.calcMaxNumberOfBits(resultNumber);
        
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
        const bits = this.calcMaxNumberOfBits(resultExpr);
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
        
        const bits = this.calcMaxNumberOfBits(expr);
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

    calcMaxNumberOfBits (op: Operand) {
       return calc.numberOfBitsDisplayed(op.value);
    }

    getLabel (op: Operand) : string {

        return formatter.numberToString(op.value, op.base === 'bin' ? 'dec' : op.base)
    }

    static applyEmphasizeBytes (bits : number, emphasizeBytes : boolean) : number {
        
        if(emphasizeBytes && bits % 8 !== 0) {
             if(bits < 8) {
                 return 8;
             }

             var n = bits - (bits % 8);
             return n + 8;
        }

        return bits;
    };

    static createModel(expr : Expression, emphasizeBytes: boolean, annotateDataTypes: boolean) : BitwiseResultViewModel {

        if(expr instanceof ListOfNumbers) {
            return BitwiseResultViewModel.buildListOfNumbers(expr, { 
                emphasizeBytes: emphasizeBytes, 
                allowFlipBits: true,
                annotateDataTypes: annotateDataTypes
            });
        }

        if(expr instanceof BitwiseOperation) {
            return BitwiseResultViewModel.buildBitwiseOperation(expr, { 
                emphasizeBytes: emphasizeBytes,
                allowFlipBits: true,
                annotateDataTypes: annotateDataTypes
            });
        }

        throw new Error("Cannot build BitwiseExpressionViewModel out of expression " + expr);
    }
}