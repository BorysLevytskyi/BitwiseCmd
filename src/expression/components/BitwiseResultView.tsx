import React from 'react';
import formatter from '../../core/formatter';
import BinaryStringView, { FlipBitEventArg } from '../../core/components/BinaryString';
import BitwiseResultViewModel from './BitwiseResultViewModel';
import { Expression, ExpressionElement } from '../expression-interfaces';
import { Operator, Operand } from '../expression';
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
        const scalar =  this.props.expressionItem.evaluate();
        const bin = formatter.numberToString(scalar.value, 'bin').padStart(maxNumberOfBits, '0');
        const signBitIndex = scalar.value.signed && bin.length >= scalar.value.maxBitSize ? bin.length - scalar.value.maxBitSize : -1;

        return <tr className={"row-with-bits " + css}>
            <td className="sign">{sign}</td>
            <td className="label">{this.getLabel()}</td>
            <td className="bin">
                <BinaryStringView
                    emphasizeBytes={emphasizeBytes}
                    binaryString={bin}
                    allowFlipBits={allowFlipBits}
                    signBitIndex={signBitIndex}
                    onFlipBit={args => this.flipBit(args)} />
            </td>
            <td className="other">{this.getAlternative()}</td>
            <td className="info accent1" data-test-name='ignore'>{this.getInfo(maxNumberOfBits)}</td>
        </tr>;;
    }

    getLabel(): string {

        // For expressions like |~2 
        // TODO: find a better way...
        if (this.props.expressionItem.isOperator) {
            const ex = this.props.expressionItem as Operator;
            return ex.operator + this.getLabelString(ex.getUnderlyingOperand());
        }

        return this.getLabelString(this.props.expressionItem.getUnderlyingOperand());
    }

    getAlternative() {

        if (this.props.expressionItem.isOperator) {
            const ex = this.props.expressionItem as Operator;
            const res = ex.evaluate();

            return formatter.numberToString(res.value, res.base);
        }

        const v = this.props.expressionItem.evaluate();
        const altBase = formatter.getAlternativeBase(v.base);
        return formatter.numberToString(v.value, altBase);
    }

    getLabelString(op: Operand): string {
        return formatter.numberToString(op.value, op.base == 'bin' ? 'dec' : op.base);
    }

    flipBit(args: FlipBitEventArg) {

        const op = this.props.expressionItem.getUnderlyingOperand();
        const { bitIndex: index, binaryStringLength: totalLength } = args;

        const maxBitSize = op.value.maxBitSize;
        const space = (totalLength - index - maxBitSize);
        if(totalLength > op.value.maxBitSize && space > 0) {
            op.setValue(calc.addSpace(op.value, space));
        }

        const pad = op.value.maxBitSize - totalLength;
        const newValue = calc.flipBit(op.value, pad + index);
        op.setValue(newValue);
        this.props.onBitFlipped();
    }

    getInfo(maxNumberOfBits:number) {
        var op = this.props.expressionItem.getUnderlyingOperand();

        if((op.value.maxBitSize != 32 || op.value.maxBitSize <= maxNumberOfBits) || op.label.length > 0)
        {
            let title = `BitwiseCmd treats this number as ${op.value.maxBitSize}-bit integer`;
            let text = `${op.value.maxBitSize}-bit `;
            
            if(!op.value.signed)
                text += " unsigned ";

            if(op.label.length > 0)
            {
                text += " (converted)";
                title += ". This number was converted to facilitate bitwise operation with an operand of a different type";
            }

            return <span title={title} style={{cursor:"help"}}>{text}</span>;
        }

        return null;
        
    }
}