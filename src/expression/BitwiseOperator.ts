import calc from '../core/calc';
import ScalarValue from './ScalarValue';
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
            ? applyNotOperator(this.operand.getUnderlyingScalarOperand())
            : applyOperator(operand!, this.operator, evaluatedOperand);
    }

    getUnderlyingScalarOperand() : ScalarValue {
        return this.operand.getUnderlyingScalarOperand();
    }

    toString(): string {
        return this.operator + this.operand.toString();
    }
}

function applyNotOperator(operand: ScalarValue) : ScalarValue {
    return new ScalarValue(calc.not(operand.value), operand.base);
}

function applyOperator(op1 : ScalarValue, operator: string, op2 : ScalarValue) : ScalarValue {
    
    equalizeSize(op1, op2);

    const result = calc.operation(op1.value, operator, op2.value);
    return new ScalarValue(result, op2.base);
}

function equalizeSize(op1: ScalarValue, op2: ScalarValue) {
    
    const n1 = op1.value;
    const n2 = op2.value;

    if(n1.maxBitSize === n2.maxBitSize)
    {
        if(n1.signed === n2.signed) return;

        // Example int and usinged int. Poromoted both to 64 bit        
        op1.setValue(n1.resize(n1.maxBitSize*2).toSigned()).setLabel("converted");
        op2.setValue(n2.resize(n2.maxBitSize*2).toSigned()).setLabel("converted");
    }
    
    if(n1.maxBitSize > n2.maxBitSize) 
        op2.setValue(n2.convertTo(n1)).setLabel("converted");
    else 
        op1.setValue(n1.convertTo(n2)).setLabel("converted");
}