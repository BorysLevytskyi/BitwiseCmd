import calc from "../core/calc";
import { JsNumber, asBoundedNumber } from "../core/types";
import ScalarValue from "./ScalarValue";

const engine = {
    applyNotOperator(operand: ScalarValue) : ScalarValue {
        return new ScalarValue(calc.not(operand), operand.base);
    },
    applyOperator(op1 : ScalarValue, operator: string, op2 : ScalarValue) : ScalarValue {
       
        const result = evalute(op1.value, operator, op2.value);

        return new ScalarValue(result, op2.base);
    }
};

function evalute(op1 : JsNumber, operator: string, op2 : JsNumber) : JsNumber{
    const o1 = equalizeType(op2, op1);
    const o2 = equalizeType(op1, op2);
    
    const b1 = asBoundedNumber(o1);
    const b2 = asBoundedNumber(o2);

    switch(operator) {
        case ">>": return calc.rshift(b1, o2).value;
        case ">>>": return calc.urshift(b1, o2).value;
        case "<<": return calc.lshift(b1, o2).value;
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