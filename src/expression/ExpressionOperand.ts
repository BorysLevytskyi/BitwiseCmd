import ScalarOperand from './ScalarOperand';
import { ExpressionInputItem } from './expression-interfaces';

export default class ExpressionOperand implements ExpressionInputItem {
    expressionString: string;
    operand: ExpressionInputItem;
    sign: string;
    isExpression: boolean;
    isShiftExpression: boolean;
    isNotExpression: boolean;

    constructor(expressionString : string, operand : ExpressionInputItem, sign : string) {
        this.expressionString = expressionString;
        this.operand = operand;
        this.sign = sign;
        this.isExpression = true;
        this.isShiftExpression = this.sign.indexOf('<') >= 0 || this.sign.indexOf('>')>= 0;
        this.isNotExpression = this.sign === '~';
    }
        
    evaluate(operand?: ScalarOperand) : ScalarOperand {
        if (operand instanceof ExpressionOperand) {
            throw new Error('value shouldnt be expression'); 
        }

        var evaluatedOperand = this.operand.evaluate();

        var str = '';
        if(this.sign == '~'){
            str = '~' + evaluatedOperand.value;
        } else {
            if(operand == null)
            throw new Error("Other is required for expression: " + this.expressionString)

            str = operand.value + this.sign + evaluatedOperand.value;
        }

        return ScalarOperand.create(eval(str), evaluatedOperand.base);
    }

    getUnderlyingOperand() : ScalarOperand {
        return this.operand.getUnderlyingOperand();
    }

    toString(): string {
        return this.sign + this.operand.toString();
    }
}