import React from 'react';

export default class BinaryStringView extends React.Component {
    render() {
        const str = this.props.binaryString;
        const chars = str.split('');
        const allowFlipBits = this.props.allowFlipBits || false;
        const css = allowFlipBits ? ' flipable' : ''
        const classNames = { '0': `zero${css}`, '1' : `one ${css}` };
        const children = chars.map((c, i) => <span className={classNames[c]} key={i} onClick={e => this.onBitClick(i, e)}>{c}</span>);
        
        return <span>{children}</span>
    }

    onBitClick(index, e) {
        if(!this.props.allowFlipBits) {
            return;
        }

        if(this.props.onFlipBit) {
            this.props.onFlipBit(index);
        }
    }
}