import React from 'react';
import * as expression from '../../expression';
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

        if(expr instanceof expression.ListOfNumbersExpression) {
            model = BitwiseExpressionViewModel.buildListOfNumbers(expr, { 
                emphasizeBytes: this.props.emphasizeBytes, 
                allowFlipBits: true });
        }

        if(expr instanceof expression.SingleOperandExpression) {
            model = BitwiseExpressionViewModel.buildNot(expr, { emphasizeBytes: this.props.emphasizeBytes });
        }

        if(expr instanceof expression.MultipleOperandsExpression) {
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
        const { sign, label, bin, other, css, maxNumberOfBits, emphasizeBytes, allowFlipBits, operand } = this.props;
        
        return <tr className={css}>
                    <td className="sign">{sign}</td>
                    <td className="label">{this.getLabel(operand)}</td>
                    <td className="bin">
                        <BinaryStringView 
                            emphasizeBytes={emphasizeBytes} 
                            binaryString={formatter.padLeft(operand.bin, maxNumberOfBits, '0')} 
                            allowFlipBits={allowFlipBits} 
                            onFlipBit={idx => this.flipBit(idx)}/>
                    </td>
                    <td className="other">{operand.other}</td>
                </tr>;
    }

    getLabel(op) {
        return op.kind == 'bin' ? op.dec : op.toString();
    }

     flipBit(index) {    

        var op = this.props.operand;
        const binaryString = formatter.padLeft(op.bin, this.props.maxNumberOfBits, '0');
        var arr = binaryString.split('');
        // TODO: this code looks ugly
        arr[index] = arr[index] == '0' ? '1' : '0';
        var bin = arr.join('');

        console.log('new bin: '+ bin);
        op.setValue(parseInt(bin, 2));

        this.setState({ operand: op });
    }
}