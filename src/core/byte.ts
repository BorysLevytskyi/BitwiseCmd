function flipBitsToZero(byte: number, numberOfBits : number) : number {
    if(numberOfBits == 0)
        return byte;
    
    const zerouOutMask = Math.pow(2, 8-numberOfBits)-1<<numberOfBits; // E.g. 11111000 for flipping first three bits
    const result = byte & zerouOutMask; 

    return result;
}

// TODO: continue here to implement getting broadcast address

function flipBitsToOne(byte : number, numberOfBits : number) : number {
    if(numberOfBits == 0) return byte;

    const zerouOutMask = Math.pow(2, numberOfBits)-1; // E.g. 00000111 for flipping first three bits
    const result = byte | zerouOutMask; 

    return result;
}

function createSubnetMaskByte(numberOfBits: number) {
    return 255<<(8-numberOfBits)&255;;
}

export {flipBitsToZero, createSubnetMaskByte, flipBitsToOne};