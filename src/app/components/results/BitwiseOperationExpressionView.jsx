import React from 'react';
import { Operand, ListOfNumbersExpression, SingleOperandExpression, MultipleOperandsExpression } from '../../expression';
import formatter from '../../formatter';
import BinaryStringView from './BinaryStringView';
import BitwiseExpressionViewModel from './models/BitwiseExpressionViewModel';
import log from 'loglevel';

export default class BitwiseOperationEpxressionView extends React.Component {
    render() {
        var rows = this.getRows();
        if(!rows) {
            return null;
        }

        return <table className="expression">
                    <tbody>
                            {rows}
                    </tbody>
                </table>
    }

    getRows() {
        const expr = this.props.expression;
        var model = null;

        if(expr instanceof ListOfNumbersExpression) {
            model = BitwiseExpressionViewModel.buildListOfNumbers(expr, { 
                emphasizeBytes: this.props.emphasizeBytes, 
                allowFlipBits: true });
        }

        if(expr instanceof SingleOperandExpression) {
            model = BitwiseExpressionViewModel.buildNot(expr, { emphasizeBytes: this.props.emphasizeBytes });
        }

        if(expr instanceof MultipleOperandsExpression) {
            model = BitwiseExpressionViewModel.buildMultiple(expr, { emphasizeBytes: this.props.emphasizeBytes });
        }

        log.info('Render model', model);
        return model.items.map((itm, i) => <ExpressionRow key={i} {...itm} emphasizeBytes={this.props.emphasizeBytes} maxNumberOfBits={model.maxNumberOfBits} allowFlipBits={model.allowFlipBits} />);
    }
}

class ExpressionRow extends React.Component {
    constructor() {
       super();
       this.state = { operand: null };
   }
    render() {
        const { sign, css, maxNumberOfBits, emphasizeBytes, allowFlipBits, operand } = this.props;
        
        return <tr className={css}>
                    <td className="sign">{sign}</td>
                    <td className="label">{this.getLabel(operand)}</td>
                    <td className="bin">
                        <BinaryStringView 
                            emphasizeBytes={emphasizeBytes} 
                            binaryString={formatter.padLeft(operand.toBinaryString(), maxNumberOfBits, '0')} 
                            allowFlipBits={allowFlipBits} 
                            onFlipBit={idx => this.flipBit(idx)}/>
                    </td>
                    <td className="other">{this.getOther(operand)}</td>
                </tr>;;
    }

    getLabel(op) {
        return op.toString(op.kind == 'bin' ? 'dec' : op.kind);
    }

    getOther(op) {
        return op.toString(op.getOtherKind());
    }

     flipBit(args) {    

        const op  = this.props.operand;
        const { index, binaryString } = args;
        
        var arr = binaryString.split('');
        arr[index] = arr[index] == '0' ? '1' : '0';
        var bin = arr.join('');

        op.setValue(parseInt(bin, 2));

        this.setState({ operand: op });
    }
}