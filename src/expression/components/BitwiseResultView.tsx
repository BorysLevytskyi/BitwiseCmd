import React from 'react';
import formatter from '../../core/formatter';
import BinaryStringView, { FlipBitEventArg as BitClickedEventArg } from '../../core/components/BinaryString';
import BitwiseResultViewModel from './BitwiseResultViewModel';
import { Expression, ExpressionElement } from '../expression-interfaces';
import { Operator, Operand, ListOfNumbers } from '../expression';
import calc from '../../core/calc';
import { Integer } from '../../core/Integer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faUndo } from '@fortawesome/free-solid-svg-icons';
import loglevel from 'loglevel';
import IconWithToolTip from '../../shell/components/IconWithTooltip';

type BitwiseResultViewProps = {
    expression: Expression;
    emphasizeBytes: boolean;
    annotateTypes: boolean,
    dimExtrBits: boolean
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

        let model: BitwiseResultViewModel | null = null
        const allowSignChange = this.props.expression instanceof ListOfNumbers;


        try {
            model = BitwiseResultViewModel.createModel(this.props.expression, this.props.emphasizeBytes, this.props.annotateTypes);
        }
        catch (err) {
            const text = (err as any).message;
            return <div className='error'>Error: {text}</div>
        }

        const rows = this.getRows(model!, allowSignChange);

        let css = "expression";

        if(this.props.dimExtrBits)
            css += " dim-extra-bits";

        return <React.Fragment>
                    <table className={css}>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
        </React.Fragment>
    }

    getRows(model: BitwiseResultViewModel, allowSignChange: boolean): JSX.Element[] {

        const maxAnnotatedSize = this.props.annotateTypes ? model.items.map(i => i.maxBitSize).sort().reverse()[0] :0;        
        
        this.maxSeenLengthNumberOfBits = Math.max(model.maxNumberOfBits, this.maxSeenLengthNumberOfBits);

        const finalMaxBits = Math.max(this.maxSeenLengthNumberOfBits, maxAnnotatedSize);

        return model.items.map((itm, i) =>
            <ExpressionElementTableRow
                key={i}
                sign={itm.sign}
                css={itm.css}
                bitSize={itm.maxBitSize}
                allowFlipBits={itm.allowFlipBits}
                allowSignChange={allowSignChange}
                expressionItem={itm.expressionElement}
                emphasizeBytes={this.props.emphasizeBytes}
                maxNumberOfBits={finalMaxBits}
                annotateTypes={this.props.annotateTypes}
                onValueChanged={() => this.onValueChanged()} />);
    }

    onValueChanged() {
        loglevel.debug("onValueChanged()");
        this.forceUpdate();
    }
}

type ExpressionElementRowProps = {
    sign: string,
    css: string,
    bitSize: number,
    maxNumberOfBits: number,
    emphasizeBytes: boolean,
    allowFlipBits: boolean,
    allowSignChange: boolean,
    expressionItem: ExpressionElement,
    onValueChanged: any,
    annotateTypes: boolean
};

class ExpressionElementTableRow extends React.Component<ExpressionElementRowProps> {

    infoWasShown: boolean = false;
    originalValue: Integer;
    scalar: Operand;

    constructor(props: ExpressionElementRowProps) {
        super(props);
        this.state = { operand: null };
        this.scalar = this.props.expressionItem.getUnderlyingOperand();
        this.originalValue = this.scalar.value;
    }

    render() {
        const { sign, css, maxNumberOfBits, emphasizeBytes, allowFlipBits, annotateTypes } = this.props;
        const scalar = this.props.expressionItem.evaluate();
        const bin = formatter.numberToString(scalar.value, 'bin', maxNumberOfBits);
        const signBitIndex = scalar.value.signed && bin.length >= scalar.value.maxBitSize ? bin.length - scalar.value.maxBitSize : -1;
        const valueSize = annotateTypes ? scalar.value.maxBitSize : calc.numberOfBitsDisplayed(scalar.value);

        return <tr className={"row-with-bits " + css}>
            <td className="sign">{sign}</td>
            <td className="label">
                {this.getLabel()}
            </td>
            <td className="bin">
                <BinaryStringView
                    emphasizeBytes={emphasizeBytes}
                    binaryString={bin}
                    allowFlipBits={allowFlipBits}
                    signBitIndex={signBitIndex}
                    valueBitSize={valueSize}
                    onBitClicked={args => this.onBitClicked(args)} />
            </td>
            <td className="other">{this.getAlternative()}</td>
            <td className="info accent1" data-test-name='ignore'>{this.props.annotateTypes ? this.getInfo() : null}</td>
            <td className='undo' data-test-name='ignore'>
                {this.getControlButtons()}
            </td>
        </tr>;
    }

    getControlButtons(): React.ReactNode {

        const buttons = [];

        if (this.scalar.value.value < 0)
            buttons.push(<IconWithToolTip icon={faInfoCircle}>
               <div className='accent1 tooltip-header'>Two's Complement</div>
                    <p>
                        This is a negative number. It's binary representation is <u>inverted</u> using <strong>Two's Complement</strong> operation.
                    </p>
                    {this.props.annotateTypes ? null : <p>To see full in-memory binary representation, go to <b>Settings</b> and enable <b>Annotate Data Types</b> toggle. </p>}
            </IconWithToolTip>)

        if (!this.originalValue.isTheSame(this.scalar.value))
            buttons.push(<button title='Undo all changes' className='undo' data-control="undo" onClick={() => this.undo()}><FontAwesomeIcon icon={faUndo} /></button>);

        return <React.Fragment>{buttons}</React.Fragment>
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
        return formatter.numberToString(op.value, op.base === 'bin' ? 'dec' : op.base);
    }

    undo() {
        this.changeValue(this.originalValue);
        this.props.onValueChanged();
    }

    onBitClicked(args: BitClickedEventArg) {

        const { bitIndex, binaryStringLength } = args;

        const maxBitSize = this.scalar.value.maxBitSize;

        const rightIndex = binaryStringLength - bitIndex;

        if (rightIndex <= maxBitSize) {
            const pad = this.scalar.value.maxBitSize - binaryStringLength;
            const newValue = calc.flipBit(this.scalar.value, pad + bitIndex);
            this.changeValue(newValue);
            return;
        }


        const space = (binaryStringLength - bitIndex - maxBitSize);
        this.changeValue(calc.addSpace(this.scalar.value, space));
        loglevel.debug("Operand size changed");
    }

    onChangeSign() {

        var op = this.props.expressionItem.getUnderlyingOperand();

        this.changeValue(op.value.signed ? op.value.toUnsigned() : op.value.toSigned());

        this.forceUpdate();
    }

    changeValue(newValue: Integer) {
        this.scalar.setValue(newValue);
        this.props.onValueChanged();
    }

    getInfo() {

        const op = this.props.expressionItem.getUnderlyingOperand();
        const { allowSignChange } = this.props;

        this.infoWasShown = true;

        const children = [];
        let title = `BitwiseCmd treats this number as ${op.value.maxBitSize}-bit integer`;
        let text = `${op.value.maxBitSize}-bit `;

        const signedStr = op.value.signed ? 'signed' : 'unsigned';
        const signedOther = op.value.signed ? 'unsigned' : 'signed';
        const signedButtonTitle = `Click to change to ${signedOther} preserving the same bits`;

        if (op.label.length > 0) {
            text += " (converted)";
            title += ". This number was converted to facilitate bitwise operation with an operand of a different type.";
        }

        children.push(<span title={title} style={{ cursor: "help" }}>{text.trim()}</span>);

        if (allowSignChange)
            children.push(<button className='accent1 link-button' title={signedButtonTitle} onClick={() => this.onChangeSign()}>{signedStr}</button>);
        else
            children.push(<span className='accent1'>&nbsp;{signedStr}</span>)

        return <React.Fragment>{children}</React.Fragment>
    }
}