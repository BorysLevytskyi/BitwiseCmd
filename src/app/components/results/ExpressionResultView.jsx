import React from 'react'
import ListOfNumbersExpressionView from './ListOfNumbersExpressionView';
import * as expression from '../../expression'; 

export default class ExpressionResultView extends React.Component {
    render() {
        var expr = this.props.result.expression;

        if(expr instanceof expression.ListOfNumbersExpression) {
            return <div>
                <b>Expression: {expr.expressionString}</b>
                <ListOfNumbersExpressionView expression={expr} />
            </div>
        }

        return <b>Expression: {expr.expressionString}</b>;
    } 
}