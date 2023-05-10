import React from 'react';
import './BinaryString.css';

export type BinaryStringViewProps = {
    allowFlipBits?: boolean;
    binaryString: string;
    onFlipBit?: (input: FlipBitEventArg) => void;
    emphasizeBytes?: boolean;
    className?:string;
    disableHighlight?:boolean,
    signBitIndex?: number,
};

export type FlipBitEventArg = {
    bitIndex: number;
    binaryStringLength: number;
    $event: any;
    newBinaryString: string
};

export default class BinaryStringView extends React.Component<BinaryStringViewProps> {
    render() {
        return <span className={this.props.className}>{this.getChildren()}</span>
    }

    onBitClick(index: number, e : any) {
        if(!this.props.allowFlipBits || !this.props.onFlipBit) {
            return;
        }

        const arr = this.props.binaryString.split('');
        arr[index] = arr[index] == '0' ? '1' : '0';
        const newBinaryString = arr.join('');

        this.props.onFlipBit({ bitIndex: index, binaryStringLength: this.props.binaryString.length, $event: e, newBinaryString });        
    }

    getChildren() {
        var bits = this.createBits(this.props.binaryString.split(''));
        
        if(this.props.emphasizeBytes) {
            return this.splitIntoBytes(bits);
        }

        return bits;
    }

    createBits(bitChars:string[], bitSize?: number) : JSX.Element[] {
        const allowFlipBits = this.props.allowFlipBits || false;
        const css = allowFlipBits ? ' flipable' : ''

        const disableHighlight = this.props.disableHighlight || false;

        let signBitIndex = -1;

        return bitChars.map((c, i) => {

            var className = c == '1' ? `one${css}` : `zero${css}`;
            var tooltip = '';

            if(i === this.props.signBitIndex) {
                className += ' accent1';
                tooltip = 'Signature bit. 0 means a positive number and 1 means a negative.'
            }
                
            if(disableHighlight) 
                className = css;

            return <span className={className} title={tooltip} key={i} onClick={e => this.onBitClick(i, e)}>{c}</span>
        });
    }

    splitIntoBytes(bits: JSX.Element[]) {
        const bytes = [];

        var key = 0;
        while(bits.length > 0) {
            bytes.push(<span key={key++} className="byte">{bits.splice(0, 8)}</span>);
        }
        
        return bytes;
    }
}