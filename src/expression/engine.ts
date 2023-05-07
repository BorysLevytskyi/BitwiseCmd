import ScalarToken from "./ScalarToken";

const engine = {
    applyNotOperator(operand: ScalarToken) : ScalarToken {
        return new ScalarToken(~operand.value, operand.base);
    },
    applyOperator(op1 : ScalarToken, operator: string, op2 : ScalarToken) : ScalarToken {
       const result = evalute(op1.value, operator, op2.value);
       return new ScalarToken(result, op1.base);
    }
};

function evalute(op1 : number | bigint, operator: string, op2 : number | bigint) : number | bigint{
    const a = op1 as any;
    const b = op2 as any;

    switch(operator) {
        case ">>": return (a >> b) as (number | bigint);
        case ">>>": return (a >>> b) as (number | bigint);
        case "<<": return (a << b) as (number | bigint);
        case "&": return (b & a) as (number | bigint);
        case "|": return (b | a) as (number | bigint);
        case "^": return (b ^ a) as (number | bigint);
        default: throw new Error(operator + " operator is not supported");
    }
}



export default engine;