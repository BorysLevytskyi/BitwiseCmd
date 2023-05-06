import { INT_MAX_VALUE } from '../core/const';
import formatter from '../core/formatter';
import ScalarToken from './ScalarToken';
import { ExpressionToken } from './expression-interfaces';

export default class OperatorToken implements ExpressionToken {
    operand: ExpressionToken;
    operator: string;
    isOperator: boolean;
    isShiftExpression: boolean;
    isNotExpression: boolean;

    constructor(operand : ExpressionToken, operator : string) {

        if(operand instanceof ScalarToken) {            
            const o = operand.getUnderlyingScalarOperand();
            if(Math.abs(o.value) > INT_MAX_VALUE) {
                const n = formatter.numberToString(o.value, o.base);
                throw new Error(`${n} has more than 32 bits. JavaScript converts all numbers to 32-bit integers when applying bitwise operators. BitwiseCmd currently uses the JavaScript engine of your browser for results calculation and supports numbers in the range from ${-INT_MAX_VALUE} to ${INT_MAX_VALUE}.`);
            }
        }

        this.operand = operand;
        this.operator = operator;
        this.isOperator = true;
        this.isShiftExpression = this.operator.indexOf('<') >= 0 || this.operator.indexOf('>')>= 0;
        this.isNotExpression = this.operator === '~';
    }
        
    evaluate(operand?: ScalarToken) : ScalarToken {
        if (operand instanceof OperatorToken) {
            throw new Error('value shouldnt be expression'); 
        }

        var evaluatedOperand = this.operand.evaluate();

        var str = '';
        if(this.operator == '~'){
            str = '~' + evaluatedOperand.value;
        } else {
            if(operand == null)
                throw new Error("Other is required for this expression");

            str = operand.value + this.operator + evaluatedOperand.value;
        }

        return ScalarToken.create(eval(str), evaluatedOperand.base);
    }

    getUnderlyingScalarOperand() : ScalarToken {
        return this.operand.getUnderlyingScalarOperand();
    }

    toString(): string {
        return this.operator + this.operand.toString();
    }
}