import { NumericLiteral } from "typescript";
import ExpressionOperand from "./ExpressionOperand";
import { ScalarOperand } from "./expression";
import { ExpressionInputItem } from "./expression-interfaces";

const NUMBER_REGEX = /./;

class ExpressionParser
{
    input: string;
    pos: number;
    
    constructor(input: string) {
        this.input = input;
        this.pos = 0;
    }

    tryParse () : ExpressionInputItem[] | null {
        return null;
    } 

    parse() : ExpressionInputItem[] {
        const s = this.input;
        const p = this.pos;
        const items : ExpressionInputItem[] = [];
        
        while(p < s.length) {
            
           
           
        }

        return items;
    }

    parseSingle(): ExpressionInputItem {
        const s = this.input;
        const p = this.pos;

        const ch = s[p];

        if(ch == '~')
        {
            this.move(1); 
            const inner = this.parseSingle()
            return new ExpressionOperand("~" + inner, inner, "~");
        }

        const ss = s.substring(p);
        const scalar = ScalarOperand.tryParse(ss);

        if(scalar == null)
            throw new Error(`Expected scalar value at pos ${p}: ${ss}`);

        return {} as ExpressionInputItem;
    }

    move(step : number) {
        this.pos += step;
    }

    
}

it("parses simple expression", () => {
    const input = "1+1";
    
})