import React from 'react';

export default class BinaryStringView extends React.Component {
    render() {
        return <span>{this.getChildren()}</span>
    }

    onBitClick(index, e) {
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

    createBits(bitChars) {
        const allowFlipBits = this.props.allowFlipBits || false;
        const css = allowFlipBits ? ' flipable' : ''
        const classNames = { '0': `zero${css}`, '1' : `one ${css}` };
        return bitChars.map((c, i) => <span className={classNames[c]} key={i} onClick={e => this.onBitClick(i, e)}>{c}</span>);
    }

    splitIntoBytes(bits) {
        const bytes = [];

        var key = 0;
        while(bits.length > 0) {
            bytes.push(<span key={key++} className="byte">{bits.splice(0, 8)}</span>);
        }
        
        return bytes;
    }
}