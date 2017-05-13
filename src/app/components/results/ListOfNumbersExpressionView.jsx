import React from 'react';
import formatter from '../../formatter';
import BinaryStringView from './BinaryStringView';
import BitwiseExpressionViewModel from './models/BitwiseExpressionViewModel'


export default class ListOfNumersExpressionView extends React.Component {
    render() {
        const expr = this.props.expression;
        const maxBitsLegnth = BitwiseExpressionViewModel.getNumberOfBits(expr.maxBitsLegnth, this.props.emphasizeBytes);
        const numberRows = expr.numbers.map((n, i) => <OperandView key={i} operand={n} maxBitsLegnth={maxBitsLegnth} />);
        return <table className="expression">
                        <tbody>
                            {numberRows}
                        </tbody>        
                    </table>
    }
}

class OperandView extends React.Component {
   constructor() {
       super();
       this.state = { operand: null };
   }
    render() {
        const op = this.props.operand;
        const binaryString = formatter.padLeft(op.bin, this.props.maxBitsLegnth, '0');

        return <tr data-kind={op.kind}>
                    <td className="label">{op.input}</td>
                    <td className="bin"><BinaryStringView binaryString={binaryString} allowFlipBits={true} onFlipBit={e => this.flipBit(e)} /></td>
                    <td className="other">{op.other}</td>
                </tr>;
    };

    flipBit(index) {    
        var op = this.props.operand;
        const binaryString = formatter.padLeft(op.bin, this.props.maxBitsLegnth, '0');
        var arr = binaryString.split('');
        // TODO: this code looks ugly
        arr[index] = arr[index] == '0' ? '1' : '0';
        var bin = arr.join('');
        op.setValue(parseInt(bin, 2));

        this.setState({ operand: op });
    }
}