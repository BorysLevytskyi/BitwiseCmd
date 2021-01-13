import React from 'react';

export type BinaryStringViewProps = {
    allowFlipBits: boolean;
    binaryString: string;
    onFlipBit?: (input: FlipBitEventArg) => void;
    emphasizeBytes: boolean;
};

export type FlipBitEventArg = {
    index: number;
    binaryString: string;
    $event: any;
};

export default class BinaryStringView extends React.Component<BinaryStringViewProps> {
    render() {
        return <span>{this.getChildren()}</span>
    }

    onBitClick(index: number, e : any) {
        if(!this.props.allowFlipBits) {
            return;
        }

        if(this.props.onFlipBit) {
            this.props.onFlipBit({ index: index, binaryString: this.props.binaryString, $event: e });
        }
    }

    getChildren() {
        var bits = this.createBits(this.props.binaryString.split(''));
        
        if(this.props.emphasizeBytes) {
            return this.splitIntoBytes(bits);
        }

        return bits;
    }

    createBits(bitChars:string[]) : JSX.Element[] {
        const allowFlipBits = this.props.allowFlipBits || false;
        const css = allowFlipBits ? ' flipable' : ''

        return bitChars.map((c, i) => {
            var className = c == '0' ? `zero${css}` : `one${css}`;
            return <span className={className} key={i} onClick={e => this.onBitClick(i, e)}>{c}</span>
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