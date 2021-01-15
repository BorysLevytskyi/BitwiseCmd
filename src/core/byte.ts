function zeroOutBits(byte: number, numberOfBits : number) {
    if(numberOfBits == 0)
        return byte;
    
    const zerouOutMask = Math.pow(2, 8-numberOfBits)-1<<numberOfBits; // E.g. 11111000 for flipping first three bits
    const result = byte & zerouOutMask; 

    return result;
}

function createSubnetMaskByte(numberOfBits: number) {
    return 255<<(8-numberOfBits)&255;;
}

export {zeroOutBits, createSubnetMaskByte};