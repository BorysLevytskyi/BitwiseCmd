import React from 'react';

export default class ListOfNumersExpressionView extends React.Component {
    render() {
        const expr = this.props.expression;
        const numberViews = expr.numbers.map((n, i) => <OperandView key={i} operand={n} />) 
        return <table className="expression" cellspacing="0">
                    {numberViews}        
               </table>
    }
}

class OperandView extends React.Component {
    render() {
        const op = this.props.operand;
        console.log(op);
        // const bitsSize = this.propsю;
         // .padLeft(m.bitsSize, '0')
        return  <tr data-kind={op.kind}>
            <td className="label">{op.input}</td>
            <td className="bin">{op.bin}</td>
            <td className="other">{op.other}</td>
        </tr>
    };
}