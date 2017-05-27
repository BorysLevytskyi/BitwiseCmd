import React from 'react'
import ListOfNumbersExpressionView from './ListOfNumbersExpressionView';
import BitwiseOperationExpressionView from './BitwiseOperationExpressionView';

import * as expression from '../../expression'; 

export default class ExpressionResultView extends React.Component {
    render() {
        var expr = this.props.result.expression;

        if(expr instanceof expression.ListOfNumbersExpression) {
            return <div>
                        <ListOfNumbersExpressionView expression={expr} emphasizeBytes={this.props.emphasizeBytes} />
                    </div>
        }
        if(expr instanceof expression.SingleOperandExpression || expr instanceof expression.MultipleOperandsExpression) {
            return <div>
                        <BitwiseOperationExpressionView expression={expr} emphasizeBytes={this.props.emphasizeBytes} />
                    </div>
        }

        return <b>Expression: {expr.expressionString}</b>;
    } 
}