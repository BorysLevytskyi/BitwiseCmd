import React from 'react';
import formatter from '../../core/formatter';
import BinaryStringView, { FlipBitEventArg } from '../../core/components/BinaryString';
import BitwiseResultViewModel from './BitwiseResultViewModel';
import { Expression, ExpressionElement } from '../expression-interfaces';
import { BitwiseOperator, ScalarValue } from '../expression';
import calc from '../../core/calc';

type BitwiseResultViewProps = {
    expression: Expression;
    emphasizeBytes: boolean;
}

type BitwiseResultViewState = {

}

export default class BitwiseResultView extends React.Component<BitwiseResultViewProps, BitwiseResultViewState>  {
    maxSeenLengthNumberOfBits: number;

    constructor(props: BitwiseResultViewProps) {
        super(props);
        this.state = {};
        this.maxSeenLengthNumberOfBits = 0;
    }

    render() {

         let model : BitwiseResultViewModel | null = null
        
        try
         { 
            model = BitwiseResultViewModel.createModel(this.props.expression, this.props.emphasizeBytes);
         }
         catch(err) {
            const text = (err as any).message;
            return <div className='error'>Error: {text}</div>
         }


        var rows = this.getRows(model!);

        return <table className="expression">
            <tbody>
                {rows}
            </tbody>
        </table>
    }

    getRows(model: BitwiseResultViewModel): JSX.Element[] {

        this.maxSeenLengthNumberOfBits = Math.max(model.maxNumberOfBits, this.maxSeenLengthNumberOfBits);

        return model.items.map((itm, i) =>
            <ExpressionRow
                key={i}
                sign={itm.sign}
                css={itm.css}
                bitSize={itm.maxBitSize}
                allowFlipBits={itm.allowFlipBits}
                expressionItem={itm.expression}
                emphasizeBytes={this.props.emphasizeBytes}
                maxNumberOfBits={this.maxSeenLengthNumberOfBits}
                onBitFlipped={() => this.onBitFlipped()} />);
    }

    onBitFlipped() {
        this.forceUpdate();
        //this.setState({d:new Date()});
    }
}

type ExpressionRowProps = {
    sign: string,
    css: string,
    bitSize: number,
    maxNumberOfBits: number,
    emphasizeBytes: boolean,
    allowFlipBits: boolean,
    expressionItem: ExpressionElement,
    onBitFlipped: any
}

class ExpressionRow extends React.Component<ExpressionRowProps> {
    constructor(props: ExpressionRowProps) {
        super(props);
        this.state = { operand: null };
    }
    render() {
        const { sign, css, maxNumberOfBits, emphasizeBytes, allowFlipBits } = this.props;
        const maxBits = Math.max()

        return <tr className={"row-with-bits " + css}>
            <td className="sign">{sign}</td>
            <td className="label">{this.getLabel()}</td>
            <td className="bin">
                <BinaryStringView
                    emphasizeBytes={emphasizeBytes}
                    binaryString={formatter.padLeft(this.getBinaryString(), maxNumberOfBits, '0')}
                    allowFlipBits={allowFlipBits}
                    bitSize={this.props.bitSize}
                    onFlipBit={args => this.flipBit(args)} />
            </td>
            <td className="other">{this.getAlternative()}</td>
            <td className="info accent1" data-test-name='ignore'>{this.getInfo(maxNumberOfBits)}</td>
        </tr>;;
    }

    getBinaryString(): string {
        var v = this.props.expressionItem.evaluate();
        return formatter.numberToString(v.value, 'bin');
    }

    getLabel(): string {

        // For expressions like |~2 
        // TODO: find a better way...
        if (this.props.expressionItem.isOperator) {
            const ex = this.props.expressionItem as BitwiseOperator;
            return ex.operator + this.getLabelString(ex.getUnderlyingScalarOperand());
        }

        return this.getLabelString(this.props.expressionItem.getUnderlyingScalarOperand());
    }

    getAlternative() {

        if (this.props.expressionItem.isOperator) {
            const ex = this.props.expressionItem as BitwiseOperator;
            const res = ex.evaluate();

            return formatter.numberToString(res.value, res.base);
        }

        const v = this.props.expressionItem.evaluate();
        const altBase = formatter.getAlternativeBase(v.base);
        return formatter.numberToString(v.value, altBase);
    }

    getLabelString(op: ScalarValue): string {
        return formatter.numberToString(op.value, op.base == 'bin' ? 'dec' : op.base);
    }

    flipBit(args: FlipBitEventArg) {

        const op = this.props.expressionItem.getUnderlyingScalarOperand();
        const { bitIndex: index, binaryStringLength: totalLength } = args;

        const maxBitSize = op.value.maxBitSize;
        if(totalLength > op.value.maxBitSize && (totalLength - index) > maxBitSize) {
            op.setValue(calc.promoteTo64Bit(op.value));
        }

        const pad = op.value.maxBitSize - totalLength;
        const newValue = calc.flipBit(op.value, pad + index);
        op.setValue(newValue);
        this.props.onBitFlipped();
    }

    getInfo(maxNumberOfBits:number) {
        var op = this.props.expressionItem.getUnderlyingScalarOperand();

        if(op.value.maxBitSize != 32 || op.value.maxBitSize <= maxNumberOfBits)
        {
            const title = `BitwiseCmd treats this number as ${op.value.maxBitSize}-bit integer`;

            return <span title={title} style={{cursor:"help"}}>{op.value.maxBitSize}-bit</span>;
        }

        return null;
        
    }
}