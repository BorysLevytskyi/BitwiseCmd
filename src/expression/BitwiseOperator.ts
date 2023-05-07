import ScalarValue from './ScalarValue';
import engine from './engine';
import { ExpressionElement } from './expression-interfaces';

export default class BitwiseOperator implements ExpressionElement {
    operand: ExpressionElement;
    operator: string;
    isOperator: boolean;
    isShiftExpression: boolean;
    isNotExpression: boolean;

    constructor(operand : ExpressionElement, operator : string) {

        this.operand = operand;
        this.operator = operator;
        this.isOperator = true;
        this.isShiftExpression = this.operator.indexOf('<') >= 0 || this.operator.indexOf('>')>= 0;
        this.isNotExpression = this.operator === '~';
    }
        
    evaluate(operand?: ScalarValue) : ScalarValue {
        
        if (operand instanceof BitwiseOperator)
            throw new Error('operand must be scalar value'); 
        
        if( this.operator != "~" && operand == null)
            throw new Error("operand is required");

        var evaluatedOperand = this.operand.evaluate();

        return this.operator == "~"
            ? engine.applyNotOperator(this.operand.getUnderlyingScalarOperand())
            : engine.applyOperator(operand!, this.operator, evaluatedOperand);
    }

    getUnderlyingScalarOperand() : ScalarValue {
        return this.operand.getUnderlyingScalarOperand();
    }

    toString(): string {
        return this.operator + this.operand.toString();
    }
}