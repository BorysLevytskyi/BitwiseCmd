import React from 'react';
import { Operand, ListOfNumbersExpression, SingleOperandExpression, MultipleOperandsExpression } from '../../expression';
import formatter from '../../formatter';
import BinaryStringView from './BinaryStringView';
import BitwiseExpressionViewModel from './models/BitwiseExpressionViewModel';
import log from 'loglevel';

export default class BitwiseOperationEpxressionView extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
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
                allowFlipBits: true 
            });
        }

        if(expr instanceof MultipleOperandsExpression) {
            model = BitwiseExpressionViewModel.buildMultiple(expr, { 
                emphasizeBytes: this.props.emphasizeBytes,
                allowFlipBits: false 
            });
        }

        log.info('Render model', model);

        return model.items.map((itm, i) => 
            <ExpressionRow 
                key={i} 
                {...itm} 
                emphasizeBytes={this.props.emphasizeBytes} 
                maxNumberOfBits={model.maxNumberOfBits} 
                onBitFlipped={() => this.onBitFlipped()} />);
    }

    onBitFlipped() {
        console.log('bit flipped');
        this.setState({d:new Date()});
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
                            binaryString={formatter.padLeft(operand.apply().toBinaryString(), maxNumberOfBits, '0')} 
                            allowFlipBits={allowFlipBits} 
                            onFlipBit={idx => this.flipBit(idx)}/>
                    </td>
                    <td className="other">{this.getOther(operand)}</td>
                </tr>;;
    }

    getLabel(op) {
        if(op.isExpression) {
            return op.toString();
        }
        return op.toString(op.kind == 'bin' ? 'dec' : op.kind);
    }

    getOther(op) {
        if(op.isExpression) {
            return op.apply().toString();
        }
        return op.toString(op.getOtherKind());
    }

     flipBit(args) {    

        const op  = this.props.operand;
        const { index, binaryString } = args;

        var arr = binaryString.split('');
        arr[index] = arr[index] == '0' ? '1' : '0';
        var bin = arr.join('');

        var newValue = parseInt(bin, 2);
        console.log('flipped \n%s to \n%s from \n%s to \n%s', binaryString, bin, op.value, newValue);
        op.setValue(newValue);

        this.props.onBitFlipped();
    }
}