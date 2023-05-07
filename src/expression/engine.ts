import { NumberType } from "../core/types";
import ScalarToken from "./ScalarToken";

const engine = {
    applyNotOperator(operand: ScalarToken) : ScalarToken {
        return new ScalarToken(~operand.value, operand.base);
    },
    applyOperator(op1 : ScalarToken, operator: string, op2 : ScalarToken) : ScalarToken {
       
        const result = evalute(op1.value, operator, op2.value);

        return new ScalarToken(result, op2.base);
    }
};

function evalute(op1 : NumberType, operator: string, op2 : NumberType) : NumberType{
    const a = equalizeType(op2, op1) as any;
    const b = equalizeType(op1, op2) as any;
    
    switch(operator) {
        case ">>": return (a >> b) as (NumberType);
        case ">>>": return (a >>> b) as (NumberType);
        case "<<": return (a << b) as (NumberType);
        case "&": return (b & a) as (NumberType);
        case "|": return (b | a) as (NumberType);
        case "^": return (b ^ a) as (NumberType);
        default: throw new Error(operator + " operator is not supported");
    }
}

function equalizeType(source : NumberType, dest : NumberType) : NumberType {
    
    return typeof source == 'bigint' && typeof dest != 'bigint'
        ? BigInt(dest)
        : dest;
}



export default engine;