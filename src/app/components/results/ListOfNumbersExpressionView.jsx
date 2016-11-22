import React from 'react';
import formatter from '../../formatter';

export default class ListOfNumersExpressionView extends React.Component {
    render() {
        const expr = this.props.expression;
        const numberViews = expr.numbers.map((n, i) => <OperandView key={i} operand={n} maxBitsLegnth={expr.maxBitsLegnth} />) 
        return <table className="expression" cellspacing="0">
                    {numberViews}        
               </table>
    }
}

class OperandView extends React.Component {
    render() {
        const op = this.props.operand;
        console.log(this.props);
        // const bitsSize = this.propsю;
         // .padLeft(m.bitsSize, '0')
        return  <tr data-kind={op.kind}>
            <td className="label">{op.input}</td>
            <td className="bin">{formatter.padLeft(op.bin, this.props.maxBitsLegnth, '0')}</td>
            <td className="other">{op.other}</td>
        </tr>
    };
}