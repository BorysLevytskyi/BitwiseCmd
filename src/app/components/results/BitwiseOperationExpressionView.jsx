import React from 'react';
import * as expression from '../../expression';
import formatter from '../../formatter';
import BinaryStringView from './BinaryStringView';
import BitwiseExpressionViewModel from './models/BitwiseExpressionViewModel'

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

        if(expr instanceof expression.SingleOperandExpression) {
            const m = BitwiseExpressionViewModel.buildNot(expr, { emphasizeBytes: this.props.emphasizeBytes });
            return m.items.map((itm, i) => <ExpressionRow key={i} {...itm} maxNumberOfBits={m.maxNumberOfBits} />);
        }

        if(expr instanceof expression.MultipleOperandsExpression) {
            const m = BitwiseExpressionViewModel.buildMultiple(expr, { emphasizeBytes: this.props.emphasizeBytes });
            console.log('Render model', m);
            return m.items.map((itm, i) => <ExpressionRow key={i} {...itm} maxNumberOfBits={m.maxNumberOfBits} />);
        }

        return null;
    }
}

class ExpressionRow extends React.Component {
    render() {
        const { sign, label, bin, other, css, maxNumberOfBits } = this.props;
        
        return <tr className={css}>
                    <td className="sign">{sign}</td>
                    <td className="label">{label}</td>
                    <td className="bin">
                        <BinaryStringView binaryString={formatter.padLeft(bin, maxNumberOfBits, '0')} allowFlipBits={false}/>
                    </td>
                    <td className="other">{other}</td>
                </tr>;
    }
}