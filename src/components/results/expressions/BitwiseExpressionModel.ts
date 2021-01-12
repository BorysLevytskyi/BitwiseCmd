import { NumericOperand, ListOfNumbersExpression, BitwiseOperationExpression, ExpressionOperand } from '../../../expression/expression';
import { ExpressionInputItem, ExpressionInput } from '../../../expression/expression-interfaces';

type Config = {
    emphasizeBytes: boolean;
    allowFlipBits: boolean;
}

type ExpressionItemModel = {
    sign: string;
    css: string;
    expressionItem: ExpressionInputItem;
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
        expr.numbers.forEach(op => model.addOperandRow(op));
        model.maxNumberOfBits = BitwiseExpressionViewModel.getNumberOfBits(model.maxNumberOfBits, model.emphasizeBytes);
        return model;
    }

    static buildMultiple (expr : BitwiseOperationExpression, config : Config) {

        var op = expr.expressionItems[0],
            i = 0, len = expr.expressionItems.length,
            ex, m = new BitwiseExpressionViewModel(config);

        var prev : NumericOperand | null = null;

        for (;i<len;i++) {
            ex = expr.expressionItems[i];
            if(ex instanceof NumericOperand) {
                m.addOperandRow(ex);
                prev = ex;
                continue;
            }

            var eo = ex as ExpressionOperand;

            // If it a single NOT expression
            if(eo.isNotExpression) {
                m.addExpressionOperandRow(eo);
                var notResult = eo.evaluate();
                m.addExpressionResultRow(notResult);
                prev = notResult;
            }
            else if(eo.isShiftExpression){
                prev = eo.evaluate(prev as NumericOperand);
                m.addShiftExpressionResultRow(eo, prev);
            } else {

                prev = eo.evaluate(prev as NumericOperand);
                m.addExpressionOperandRow(eo);
                m.addExpressionResultRow(prev);
            }
        }

        m.maxNumberOfBits = BitwiseExpressionViewModel.getNumberOfBits(m.maxNumberOfBits, m.emphasizeBytes);
        return m;
    };

    static buildNot (expression: ExpressionOperand, config : Config) {
        
        var m = new BitwiseExpressionViewModel(config);
        m.addExpressionOperandRow(expression);
        m.addExpressionResultRow(expression.evaluate());
        m.maxNumberOfBits = BitwiseExpressionViewModel.getNumberOfBits(m.maxNumberOfBits, m.emphasizeBytes);
        return m;
    };

    addOperandRow(operand: NumericOperand) {
        this.maxNumberOfBits = Math.max(operand.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({ 
            sign:'', 
            css: '',
            expressionItem: operand,
            allowFlipBits: this.allowFlipBits,
            label: ''
        });
    };

    addExpressionOperandRow(expression: ExpressionOperand) {
        const resultNumber = expression.isNotExpression ? expression.evaluate() : expression.getUnderlyingOperand();
        this.maxNumberOfBits = Math.max(resultNumber.getLengthInBits(), this.maxNumberOfBits);
        
        this.items.push({ 
            sign: expression.sign, 
            css: '',
            label: this.getLabel(resultNumber),
            expressionItem: expression.operand,
            allowFlipBits: this.allowFlipBits
        });
    };

    addShiftExpressionResultRow(expression : ExpressionOperand, resultOperand : NumericOperand) {
        this.maxNumberOfBits = Math.max(resultOperand.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({
            sign: expression.sign + expression.operand.toString(),
            css: 'expression-result',
            expressionItem: resultOperand,
            allowFlipBits: false,
            label: ''
        });
    };

    addExpressionResultRow(operand : NumericOperand) {
        this.maxNumberOfBits = Math.max(operand.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({ 
            sign:'=', 
            css: 'expression-result',
            expressionItem: operand, 
            allowFlipBits: false,
            label: '',
        });
    };

    getLabel (op: NumericOperand) : string {
        
        if(op.base == 'bin') {
            return op.toString("dec");
        }

        return op.toString();
    }

    // TODO: move this method elsewhere. It is also used in LisOfNumbersExpressionView.js
    static getNumberOfBits = function (bits : number, emphasizeBytes : boolean) : number {
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