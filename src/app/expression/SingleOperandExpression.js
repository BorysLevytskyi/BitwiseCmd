import Operand from './Operand';

export default class SingleOperandExpression {
    constructor(expressionString, operand, sign) {
        this.expressionString = expressionString;
        this.operand1 = operand;
        this.sign = sign;
        this.isExpression = true;
        this.isShiftExpression = this.sign.indexOf('<') >= 0 || this.sign.indexOf('>')>= 0;
        this.isNotExpression = this.sign == '~';
    }
    
    apply(operand) {
         if (operand instanceof SingleOperandExpression) {
             console.error("value shouldnt be expression", value);
            throw new Error('value shouldnt be expression'); 
         }

         console.log('operand', operand);

          var str = '';
          if(this.sign == '~'){
              str = '~' + this.operand1.apply().value;
          } else {
              str = operand.value + this.sign + this.operand1.apply().value;
          }

         console.log('eval:' + str, this); 
         const resultValue = eval(str);

         var resultOp = Operand.create(eval(str), this.operand1.kind || this.operand1.operand1.kind);
         console.log(resultValue, resultOp);

         return resultOp;
    };

    toString() {
        return this.sign + this.operand1.toString();
    }
}