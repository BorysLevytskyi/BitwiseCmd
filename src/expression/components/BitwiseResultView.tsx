import React from 'react';
import formatter from '../../core/formatter';
import BinaryStringView, { FlipBitEventArg } from '../../core/components/BinaryString';
import BitwiseResultViewModel from './BitwiseResultViewModel';
import { ExpressionInput, Expression } from '../expression-interfaces';
import { OperatorExpression, ScalarExpression } from '../expression';

type BitwiseOperationExpressionViewProps = {
    expression: ExpressionInput;
    emphasizeBytes: boolean;
}

type BitwiseOperationExpressionViewState = {

}

export default class BitwiseResultView extends React.Component<BitwiseOperationExpressionViewProps, BitwiseOperationExpressionViewState>  {
    constructor(props: BitwiseOperationExpressionViewProps) {
        super(props);
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

    getRows() : JSX.Element[] | null {
        var model = BitwiseResultViewModel.createModel(this.props.expression, this.props.emphasizeBytes);

        return model.items.map((itm, i) => 
            <ExpressionRow 
                key={i} 
                sign={itm.sign}
                css={itm.css}
                allowFlipBits={itm.allowFlipBits}
                expressionItem={itm.expression}
                emphasizeBytes={this.props.emphasizeBytes} 
                maxNumberOfBits={model.maxNumberOfBits} 
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
    maxNumberOfBits: number, 
    emphasizeBytes: boolean, 
    allowFlipBits: boolean, 
    expressionItem: Expression,
    onBitFlipped: any
}

class ExpressionRow extends React.Component<ExpressionRowProps> {
    constructor(props: ExpressionRowProps) {
       super(props);
       this.state = { operand: null };
   }
    render() {
        const { sign, css, maxNumberOfBits, emphasizeBytes, allowFlipBits } = this.props;
        
        return <tr className={css}>
                    <td className="sign">{sign}</td>
                    <td className="label">{this.getLabel()}</td>
                    <td className="bin">
                        <BinaryStringView
                            emphasizeBytes={emphasizeBytes} 
                            binaryString={formatter.padLeft(this.getBinaryString(), maxNumberOfBits, '0')} 
                            allowFlipBits={allowFlipBits} 
                            onFlipBit={args => this.flipBit(args)}/>
                    </td>
                    <td className="other">{this.getAlternative()}</td>
                </tr>;;
    }

    getBinaryString() : string {       
        var v = this.props.expressionItem.evaluate();
        return formatter.numberToString(v.value, 'bin');
    }

    getLabel(): string {

        // For expressions like |~2 
        // TODO: find a better way...
        if(this.props.expressionItem.isOperator) {
            const ex = this.props.expressionItem as OperatorExpression;
            return ex.operator + this.getLabelString(ex.getUnderlyingScalarOperand());
        }

        return this.getLabelString(this.props.expressionItem.getUnderlyingScalarOperand());         
    }

    getAlternative() {

        if(this.props.expressionItem.isOperator) {
            const ex = this.props.expressionItem as OperatorExpression;
            const res = ex.evaluate();

            return formatter.numberToString(res.value, res.base);
        }

        const v = this.props.expressionItem.evaluate();
        const altBase = formatter.getAlternativeBase(v.base);
        return formatter.numberToString(v.value, altBase);
    }

    getLabelString (op: ScalarExpression) : string {
        return formatter.numberToString(op.value, op.base == 'bin' ? 'dec' : op.base);
    }

     flipBit(args: FlipBitEventArg) {    

        const op  = this.props.expressionItem.getUnderlyingScalarOperand();
        const { index, binaryString } = args;

        var arr = binaryString.split('');
        arr[index] = arr[index] == '0' ? '1' : '0';
        var bin = arr.join('');

        var newValue = parseInt(bin, 2);
        op.setValue(newValue);

        this.props.onBitFlipped();
    }
}