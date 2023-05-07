import calc from '../core/calc';
import { INT_MAX_VALUE } from '../core/const';
import formatter from '../core/formatter';
import ScalarToken from './ScalarToken';
import engine from './engine';
import { ExpressionToken } from './expression-interfaces';

export default class OperatorToken implements ExpressionToken {
    operand: ExpressionToken;
    operator: string;
    isOperator: boolean;
    isShiftExpression: boolean;
    isNotExpression: boolean;

    constructor(operand : ExpressionToken, operator : string) {

        this.operand = operand;
        this.operator = operator;
        this.isOperator = true;
        this.isShiftExpression = this.operator.indexOf('<') >= 0 || this.operator.indexOf('>')>= 0;
        this.isNotExpression = this.operator === '~';
    }
        
    evaluate(operand?: ScalarToken) : ScalarToken {
        
        if (operand instanceof OperatorToken)
            throw new Error('operand must be scalar value'); 
        
        if( this.operator != "~" && operand == null)
            throw new Error("operand is required");

        var evaluatedOperand = this.operand.evaluate();

        return this.operator == "~"
            ? engine.applyNotOperator(this.operand.getUnderlyingScalarOperand())
            : engine.applyOperator(operand!, this.operator, evaluatedOperand);
    }

    getUnderlyingScalarOperand() : ScalarToken {
        return this.operand.getUnderlyingScalarOperand();
    }

    toString(): string {
        return this.operator + this.operand.toString();
    }
}