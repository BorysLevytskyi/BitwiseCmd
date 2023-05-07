import React from 'react';
import formatter from '../../core/formatter';
import BinaryStringView, { FlipBitEventArg } from '../../core/components/BinaryString';
import BitwiseResultViewModel from './BitwiseResultViewModel';
import { Expression, ExpressionToken } from '../expression-interfaces';
import { OperatorToken, ScalarToken } from '../expression';
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
        var rows = this.getRows();

        return <table className="expression">
            <tbody>
                {rows}
            </tbody>
        </table>
    }

    getRows(): JSX.Element[] {

        var model = BitwiseResultViewModel.createModel(this.props.expression, this.props.emphasizeBytes);
        this.maxSeenLengthNumberOfBits = Math.max(model.maxNumberOfBits, this.maxSeenLengthNumberOfBits);

        return model.items.map((itm, i) =>
            <ExpressionRow
                key={i}
                sign={itm.sign}
                css={itm.css}
                bitSize={itm.bitSize}
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
    expressionItem: ExpressionToken,
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
            <td className="info" data-test-name='ignore'>{this.getInfo(maxNumberOfBits)}</td>
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
            const ex = this.props.expressionItem as OperatorToken;
            return ex.operator + this.getLabelString(ex.getUnderlyingScalarOperand());
        }

        return this.getLabelString(this.props.expressionItem.getUnderlyingScalarOperand());
    }

    getAlternative() {

        if (this.props.expressionItem.isOperator) {
            const ex = this.props.expressionItem as OperatorToken;
            const res = ex.evaluate();

            return formatter.numberToString(res.value, res.base);
        }

        const v = this.props.expressionItem.evaluate();
        const altBase = formatter.getAlternativeBase(v.base);
        return formatter.numberToString(v.value, altBase);
    }

    getLabelString(op: ScalarToken): string {
        return formatter.numberToString(op.value, op.base == 'bin' ? 'dec' : op.base);
    }

    flipBit(args: FlipBitEventArg) {

        const op = this.props.expressionItem.getUnderlyingScalarOperand();
        const { index, binaryString } = args;

        if(binaryString.length > op.bitSize()) {
            op.setValue(calc.promoteToBigInt(op.value as number));
        }

        console.log(op.bitSize());
        const pad = op.bitSize() - binaryString.length;
        console.log(pad + index);
        const newValue = calc.flipBit(op.value, pad + index);
        op.setValue(newValue);
        this.props.onBitFlipped();
    }

    getInfo(maxNumberOfBits:number) {
        var op = this.props.expressionItem.getUnderlyingScalarOperand();

        if (op.isBigInt())
        {
            const title = `BigInt JavaScript type is used to reprsent this number. All bitwise operations that involve this number have their operands converted to BigInt. BitwiseCmd treats this number as 64-bit number`;

            return <span title={title} style={{cursor:"help"}}>(64-bit BigInt)</span>;
        }

        if(op.bitSize() == 32 && maxNumberOfBits >= 32)
        {
            const title = "BitwiseCmd treats this number as 32-bit integer. First bit is a sign bit. Try clicking on the first bit and see what will happen.";

            return <span title={title} style={{cursor:"help"}}>(32-bit Number)</span>;
        }

        return null;
        
    }
}