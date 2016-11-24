import React from 'react';
import formatter from '../../formatter';

export default class ListOfNumersExpressionView extends React.Component {
    render() {
        const expr = this.props.expression;
        const numberViews = expr.numbers.map((n, i) => <OperandView key={i} operand={n} maxBitsLegnth={expr.maxBitsLegnth} />) 
        return <table className="expression" cellspacing="0">
                    {numberViews}        
               </table>
    }
}

class OperandView extends React.Component {
    componentWillMount() {
        this.setState(this.props.operand);
    }
    render() {
        const op = this.state;
        const binaryString = formatter.padLeft(op.bin, this.props.maxBitsLegnth, '0');

        return <tr data-kind={op.kind}>
            <td className="label">{op.input}</td>
            <td className="bin"><ClickableBinary binaryString={binaryString} onFlipBit={i => this.flipBit(i)} /></td>
            <td className="other">{op.other}</td>
        </tr>
    };

    flipBit(index) {    
        var op = this.props.operand;
        const binaryString = formatter.padLeft(op.bin, this.props.maxBitsLegnth, '0');
        var arr = binaryString.split('');
        arr[index] = arr[index] == '0' ? '1' : '0';
        op.update(arr.join(''));
        this.setState(op);
    }
}

class ClickableBinary extends React.Component {
    render() {
        const str = this.props.binaryString;
        const chars = str.split('');
        const classNames = { '0': 'zero flipable', '1' : 'one flipable' };
        const children = chars.map((c, i) => <span className={classNames[c]} key={i} onClick={e => this.onBitClick(i, e)}>{c}</span>);
        
        return <span>{children}</span>
    }

    onBitClick(index, e) {
        if(this.props.onFlipBit) {
            this.props.onFlipBit(index);
        }
    }
}