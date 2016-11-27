import React from 'react';
import * as expression from '../../expression';
import formatter from '../../formatter';

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
            const m = BitwiseExpressionViewModel.buildNot(expr);
            return m.items.map((itm, i) => <ExpressionRow key={i} {...itm} maxNumberOfBits={m.maxNumberOfBits} />);
        }

        if(expr instanceof expression.MultipleOperandsExpression) {
            const m = BitwiseExpressionViewModel.buildMultiple(expr);
            console.log('Render model', m);
            return m.items.map((itm, i) => <ExpressionRow key={i} {...itm} maxNumberOfBits={m.maxNumberOfBits} />);
        }

        return null;
    }
}

class ExpressionRow extends React.Component {
    render() {
        const { sign, label, bin, other, css, maxNumberOfBits } = this.props;
        
        var tr = <tr className={css}>
                    <td className="sign">{sign}</td>
                    <td className="label">{label}</td>
                    <td className="bin">{formatter.padLeft(bin, maxNumberOfBits, '0')}</td>
                    <td className="other">{other}</td>
                </tr>;

        return tr;
    }
}

class BitwiseExpressionViewModel {

    constructor() {
        this.items = [];
        this.maxNumberOfBits = 0;
    }

    static buildMultiple (expr) {
        var op = expr.expressions[0],
            i = 1, l = expr.expressions.length,
            ex, m = new BitwiseExpressionViewModel();

        m.addOperand(op);

        for (;i<l;i++) {
            ex = expr.expressions[i];
            op = ex.apply(op.value);

            if(ex.isShiftExpression()){
                m.addShiftExpressionResult(ex, op);
            } else {
                m.addExpression(ex);
                m.addExpressionResult(op);
            }
        }

        m.maxNumberOfBits = m.emphasizeBytes(m.maxNumberOfBits);
        return m;
    };

    static buildNot (expression) {
        var m = new BitwiseExpressionViewModel();
        m.addExpression(expression);
        m.addExpressionResult(expression.apply());
        m.maxNumberOfBits = m.emphasizeBytes(m.maxNumberOfBits);
        return m;
    };

    addOperand(operand) {
        this.maxNumberOfBits = Math.max(operand.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({ sign:'', label: operand.toString(), bin: operand.bin, other: operand.other, css: ''});
    };

    addExpression(expression) {
        this.maxNumberOfBits = Math.max(expression.operand1.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({ sign: expression.sign, label: expression.operand1.toString(), bin: expression.operand1.bin, other: expression.operand1.other, css: ''});
    };

    addShiftExpressionResult(expression, resultOperand) {
        this.maxNumberOfBits = Math.max(resultOperand.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({
            sign: expression.sign + expression.operand1.input,
            label: resultOperand.toString(),
            bin: resultOperand.bin,
            other: resultOperand.other,
            css: 'expression-result'});
    };

    addExpressionResult(operand) {
        this.maxNumberOfBits = Math.max(operand.getLengthInBits(), this.maxNumberOfBits);
        this.items.push({ sign:'=', label: operand.toString(), bin: operand.bin, other: operand.other, css: 'expression-result'});
    };

    emphasizeBytes = function (bits) {
        // var cmdConfig = app.get('cmdConfig');
        // if(cmdConfig.emphasizeBytes && bits % 8 != 0) {
        //     if(bits < 8) {
        //         return 8;
        //     }

        //     var n = bits - (bits % 8);
        //     return n + 8;
        // }
        console.warn('[BitwiseExpressionViewModel] emphasizeBytes() not implemented');
        return bits;
    };
}