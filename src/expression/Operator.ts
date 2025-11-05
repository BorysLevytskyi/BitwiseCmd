import calc from '../core/calc';
import Operand from './Operand';
import { ExpressionElement } from './expression-interfaces';

export default class Operator implements ExpressionElement {
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
        
    evaluate(operand?: Operand) : Operand {
        
        if (operand instanceof Operator)
            throw new Error('operand must be scalar value'); 
        
        if( this.operator !== "~" && (operand === undefined || operand === null))
            throw new Error("operand is required");

        var evaluatedOperand = this.operand.evaluate();

        return this.operator === "~"
            ? applyNotOperator(this.operand.getUnderlyingOperand())
            : applyOperator(operand!, this.operator, evaluatedOperand);
    }

    getUnderlyingOperand() : Operand {
        return this.operand.getUnderlyingOperand();
    }

    toString(): string {
        return this.operator + this.operand.toString();
    }
}

function applyNotOperator(operand: Operand) : Operand {
    return new Operand(calc.not(operand.value), operand.base);
}

function applyOperator(op1 : Operand, operator: string, op2 : Operand) : Operand {
    
    const isShift = /<|>/.test(operator);

    if(!isShift)
    {
        if(op1.value.maxBitSize === op2.value.maxBitSize && op1.value.signed !== op2.value.signed)
            throw new Error("Operator `" + operator + "` cannot be applied to signed and unsigned operands of the same " + op2.value.maxBitSize + " -bit size");

        equalizeSize(op1, op2);
    }

    const result = calc.operation(op1.value, operator, op2.value);
    return new Operand(result, op2.base);
}

function equalizeSize(op1: Operand, op2: Operand) {
    
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