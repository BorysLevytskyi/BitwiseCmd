import React from 'react';
import formatter from '../../core/formatter';
import BinaryStringView, { FlipBitEventArg as BitClickedEventArg } from '../../core/components/BinaryString';
import BitwiseResultViewModel from './BitwiseResultViewModel';
import { Expression, ExpressionElement } from '../expression-interfaces';
import { Operator, Operand, ListOfNumbers } from '../expression';
import calc from '../../core/calc';
import { Integer } from '../../core/Integer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import loglevel from 'loglevel';

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
        const allowSignChange = this.props.expression instanceof ListOfNumbers;
        
        
        try
        { 
            model = BitwiseResultViewModel.createModel(this.props.expression, this.props.emphasizeBytes);
        }
        catch(err) {
            const text = (err as any).message;
            return <div className='error'>Error: {text}</div>
        }

        const showInfoColumn : boolean = model.items
            .map(i => willInfoColumnBeVisible(i.expressionElement, model!.maxNumberOfBits, allowSignChange))
            .filter(p => p == true)
            .length > 0;

        var rows = this.getRows(model!, showInfoColumn, allowSignChange);

        return <table className="expression">
            <tbody>
                {rows}
            </tbody>
        </table>
    }

    getRows(model: BitwiseResultViewModel, showInfoColumn : boolean, allowSignChange : boolean): JSX.Element[] {

        this.maxSeenLengthNumberOfBits = Math.max(model.maxNumberOfBits, this.maxSeenLengthNumberOfBits);

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
                maxNumberOfBits={this.maxSeenLengthNumberOfBits}
                showInfoColumn={showInfoColumn}
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
    showInfoColumn: boolean
}

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
        const { sign, css, maxNumberOfBits, emphasizeBytes, allowFlipBits } = this.props;
        const scalar =  this.props.expressionItem.evaluate();
        const padChar = scalar.value.value >= 0 ? '0' : '1';
        const bin = formatter.numberToString(scalar.value, 'bin').padStart(maxNumberOfBits, padChar);
        const signBitIndex = scalar.value.signed && bin.length >= scalar.value.maxBitSize ? bin.length - scalar.value.maxBitSize : -1;

        return <tr className={"row-with-bits " + css}>
            <td className="sign">{sign}</td>
            <td className="label">
                <span>{this.getLabel()}</span>
            </td>
            <td className="bin">
                <BinaryStringView
                    emphasizeBytes={emphasizeBytes}
                    binaryString={bin}
                    allowFlipBits={allowFlipBits}
                    signBitIndex={signBitIndex}
                    onBitClicked={args => this.onBitClicked(args)} />
            </td>
            <td className="other">{this.getAlternative()}</td>
            <td className="info accent1" data-test-name='ignore'>{this.props.showInfoColumn ? this.getInfo() : null}</td>
            <td className='undo' data-test-name='ignore'>
                {this.getUndoButton()}
            </td>
        </tr>;
    }

    getUndoButton(): React.ReactNode {

        return !this.originalValue.isTheSame(this.scalar.value) 
            ? <button title='Undo all changes' className='undo' data-control="undo" onClick={() => this.undo()}><FontAwesomeIcon icon={faUndo}/></button> 
            : null;
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

    undo() {
        this.changeValue(this.originalValue);
        this.props.onValueChanged();
    }

    onBitClicked(args: BitClickedEventArg) {

        const { bitIndex: index, binaryStringLength: totalLength } = args;

        const maxBitSize = this.scalar.value.maxBitSize;

        if(!args.isTypeExtend)
        {
            const pad = this.scalar.value.maxBitSize - totalLength;
            const newValue = calc.flipBit(this.scalar.value, pad + index);
            this.changeValue(newValue);
            return;
        }
        
        const space = (totalLength - index - maxBitSize);
        this.changeValue(calc.addSpace(this.scalar.value, space));
    }

    onChangeSign () {
        
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
        const signedOther = op.value.signed ? 'usigned' : 'signed'; 
        const signedTitle = `Click to change to ${signedOther} preserving the same bits`; 

        if(op.label.length > 0)
        {
            text += " (converted)";
            title += ". This number was converted to facilitate bitwise operation with an operand of a different type";
        }

        children.push(<span title={title} style={{cursor:"help"}}>{text.trim()}</span>);
                
        if(this.props.maxNumberOfBits >= op.value.maxBitSize)
        {
            if(allowSignChange)
                children.push(<button className='accent1' title={signedTitle} onClick={() => this.onChangeSign()}>{signedStr}</button>);
            else if(!op.value.signed)
                children.push(<span className='accent1'> {signedStr}</span>)
        }
        
        return <React.Fragment>{children}</React.Fragment>
    }
}

function willInfoColumnBeVisible(expr: ExpressionElement, maxNumberOfBits: number, allowSignChange : boolean) {
        
    const op = expr.getUnderlyingOperand();
    const allBitsDisplayed = op.value.maxBitSize != 32 || op.value.maxBitSize <= maxNumberOfBits;
    const hasLabel = op.label.length > 0;
    return allBitsDisplayed || hasLabel;
}