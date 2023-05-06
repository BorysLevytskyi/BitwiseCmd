import {numberParser} from './numberParser';
import { Expression as Expression } from './expression-interfaces';
import { NumberBase } from '../core/formatter';

var globalId : number = 1;


// Represents scalar numeric value
export default class ScalarExpression implements Expression {
    id: number;
    value: number;
    base: NumberBase;
    isOperator: boolean;

    constructor(value : number, base?: NumberBase) {
        
        this.id = globalId++;
        this.value = value;
        this.base = base || "dec";
        this.isOperator = false;
    }
            
    setValue(value : number) {
        this.value = value;
    }

    evaluate() : ScalarExpression {
        return this;
    }

    getUnderlyingScalarOperand() : ScalarExpression  {
        return this
    }

    static create(value : number, base? : NumberBase) {
        return new ScalarExpression(value, base || "dec");
    };

    static parse(input: string) : ScalarExpression {
                    
        var parsed = ScalarExpression.tryParse(input);

        if(parsed == null) {
            throw new Error(input + " is not a valid number");
        }

        return parsed;
    }

    static tryParse(input: string) : ScalarExpression | null {
                    
        var parsed = numberParser.parse(input);

        if(!parsed) {
            return null;
        }

        return new ScalarExpression(parsed.value, parsed.base);
    }
  
}