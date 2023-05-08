import calc from "../core/calc";
import { JsNumber, asBoundedNumber } from "../core/types";
import ScalarValue from "./ScalarValue";

const engine = {
    applyNotOperator(operand: ScalarValue) : ScalarValue {
        return new ScalarValue(calc.not(operand.value), operand.base);
    },
    applyOperator(op1 : ScalarValue, operator: string, op2 : ScalarValue) : ScalarValue {
       
        const result = evalute(op1, operator, op2);

        return new ScalarValue(result, op2.base);
    }
};

function evalute(op1 : ScalarValue, operator: string, op2 : ScalarValue) : JsNumber{
    
    const b1 = op1.value;
    const b2 = op2.value;

    switch(operator) {
        case ">>": return calc.rshift(b1, b2.value).value;
        case ">>>": return calc.urshift(b1, b2.value).value;
        case "<<": return calc.lshift(b1, b2.value).value;
        case "&": return calc.and(b1,b2).value;
        case "|": return calc.or(b1,b2).value;
        case "^": return calc.xor(b1,b2).value;
        default: throw new Error(operator + " operator is not supported");
    }
}

function equalizeType(source : JsNumber, dest : JsNumber) : JsNumber {
    return typeof source == 'bigint' && typeof dest != 'bigint'
        ? BigInt(dest)
        : dest;
}



export default engine;