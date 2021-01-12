import React from 'react';
import formatter from '../../../core/formatter';
import BinaryStringView, { FlipBitEventArg } from '../BinaryString';
import BitwiseExpressionViewModel from './BitwiseExpressionModel';
import { ExpressionInput, ExpressionInputItem } from '../../../expression/expression-interfaces';
import { ExpressionOperand, NumericOperand } from '../../../expression/expression';

type BitwiseOperationExpressionViewProps = {
    expression: ExpressionInput;
    emphasizeBytes: boolean;
}

type BitwiseOperationExpressionViewState = {

}

export default class BitwiseOperationExpressionView extends React.Component<BitwiseOperationExpressionViewProps, BitwiseOperationExpressionViewState>  {
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
        var model = BitwiseExpressionViewModel.createModel(this.props.expression, this.props.emphasizeBytes);

        return model.items.map((itm, i) => 
            <ExpressionRow 
                key={i} 
                sign={itm.sign}
                css={itm.css}
                allowFlipBits={itm.allowFlipBits}
                expressionItem={itm.expressionItem}
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
    expressionItem: ExpressionInputItem,
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
                    <td className="other">{this.getOther()}</td>
                </tr>;;
    }

    getBinaryString() : string {            
        return this.props.expressionItem.evaluate().toBinaryString();
    }

    getLabel(): string {

        // For expressions like |~2 
        // TODO: find a better way...
        if(this.props.expressionItem.isExpression) {
            const ex = this.props.expressionItem as ExpressionOperand;
            return ex.sign + this.getLabelString(ex.getUnderlyingOperand());
        }

        return this.getLabelString(this.props.expressionItem.getUnderlyingOperand());         
    }

    getOther() {

        if(this.props.expressionItem.isExpression) {
            const ex = this.props.expressionItem as ExpressionOperand;
            const op = ex.evaluate();

            return op.toString();
        }

        return this.props.expressionItem.evaluate().toOtherKindString();
    }

    getLabelString (op: NumericOperand) : string {
        return op.toString(op.base == 'bin' ? 'dec' : op.base);
    }

     flipBit(args: FlipBitEventArg) {    

        const op  = this.props.expressionItem.getUnderlyingOperand();
        const { index, binaryString } = args;

        var arr = binaryString.split('');
        arr[index] = arr[index] == '0' ? '1' : '0';
        var bin = arr.join('');

        var newValue = parseInt(bin, 2);
        op.setValue(newValue);

        this.props.onBitFlipped();
    }
}