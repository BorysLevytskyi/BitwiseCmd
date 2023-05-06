import ScalarExpression from './ScalarExpression';
import { Expression } from './expression-interfaces';

export default class OperatorExpression implements Expression {
    expressionString: string;
    operand: Expression;
    sign: string;
    isOperator: boolean;
    isShiftExpression: boolean;
    isNotExpression: boolean;

    constructor(expressionString : string, operand : Expression, sign : string) {
        this.expressionString = expressionString;
        this.operand = operand;
        this.sign = sign;
        this.isOperator = true;
        this.isShiftExpression = this.sign.indexOf('<') >= 0 || this.sign.indexOf('>')>= 0;
        this.isNotExpression = this.sign === '~';
    }
        
    evaluate(operand?: ScalarExpression) : ScalarExpression {
        if (operand instanceof OperatorExpression) {
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

        return ScalarExpression.create(eval(str), evaluatedOperand.base);
    }

    getUnderlyingScalarOperand() : ScalarExpression {
        return this.operand.getUnderlyingScalarOperand();
    }

    toString(): string {
        return this.sign + this.operand.toString();
    }
}