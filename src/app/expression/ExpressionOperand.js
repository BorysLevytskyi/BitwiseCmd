import Operand from './Operand';

export default class ExpressionOperand {
    constructor(expressionString, operand, sign) {
        this.expressionString = expressionString;
        this.operand = operand;
        this.sign = sign;
        this.isExpression = true;
        this.isShiftExpression = this.sign.indexOf('<') >= 0 || this.sign.indexOf('>')>= 0;
        this.isNotExpression = this.sign == '~';
    }
    
    apply(operand) {
         if (operand instanceof ExpressionOperand) {
             console.error("value shouldnt be expression", value);
            throw new Error('value shouldnt be expression'); 
         }

         console.log('operand', operand);

          var str = '';
          if(this.sign == '~'){
              str = '~' + this.operand.apply().value;
          } else {
              str = operand.value + this.sign + this.operand.apply().value;
          }

         console.log('eval:' + str, this); 
         const resultValue = eval(str);

         var resultOp = Operand.create(eval(str), this.operand.kind || this.operand.operand.kind);
         console.log(resultValue, resultOp);

         return resultOp;
    };

    toString() {
        return this.sign + this.operand.toString();
    }
}