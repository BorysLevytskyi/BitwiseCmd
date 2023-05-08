import calc from "../core/calc";
import { JsNumber, asBoundedNumber } from "../core/types";
import ScalarValue from "./ScalarValue";

const engine = {
    applyNotOperator(operand: ScalarValue) : ScalarValue {
        return new ScalarValue(~operand.value, operand.base);
    },
    applyOperator(op1 : ScalarValue, operator: string, op2 : ScalarValue) : ScalarValue {
       
        const result = evalute(op1.value, operator, op2.value);

        return new ScalarValue(result, op2.base);
    }
};

function evalute(op1 : JsNumber, operator: string, op2 : JsNumber) : JsNumber{
    const o1 = equalizeType(op2, op1);
    const o2 = equalizeType(op1, op2);
    
    const a = o1 as any;
    const b = o2 as any;

    switch(operator) {
        case ">>": return (a >> b) as (JsNumber);
        case ">>>": return (a >>> b) as (JsNumber);
        case "<<": return calc.lshift(asBoundedNumber(o1), o2).value;
        case "&": return (b & a) as (JsNumber);
        case "|": return (b | a) as (JsNumber);
        case "^": return (b ^ a) as (JsNumber);
        default: throw new Error(operator + " operator is not supported");
    }
}

function equalizeType(source : JsNumber, dest : JsNumber) : JsNumber {
    
    return typeof source == 'bigint' && typeof dest != 'bigint'
        ? BigInt(dest)
        : dest;
}



export default engine;