import { runInThisContext } from "vm";

const ipV4Rregex = /^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/gi;

const ipAddressParser = {
    parse: function(input: string) : IpAddress | null {
        const matches = ipV4Rregex.exec(input);

        if(matches == null || matches.length === 0)
            return null;

        return new IpAddress(
            parseInt(matches[1]),
            parseInt(matches[2]),
            parseInt(matches[3]),
            parseInt(matches[4]),
        )
    }
}

export class IpAddress {

    firstByte : number;
    secondByte: number;
    thirdByte : number;
    fourthByte: number

    constructor(firstByte : number, secondByte: number, thirdByte : number, fourthByte: number) {
        this.firstByte = firstByte;
        this.secondByte = secondByte;
        this.thirdByte = thirdByte;
        this.fourthByte = fourthByte;
    }

    toString() : string {
        return `${this.firstByte}.${this.secondByte}.${this.thirdByte}.${this.fourthByte}`;
    }
}

export {ipAddressParser};