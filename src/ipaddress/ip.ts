const ipV4Rregex = /^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/;

export type OctetNumber = 1 | 2 | 3 | 4;

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

    setOctet(octet: OctetNumber, value : number)  {
        switch(octet) {
            case 1:
               return new IpAddress(this.firstByte, this.secondByte, this.thirdByte, this.fourthByte)
                break;
            case 2:
                this.secondByte = value;
                break;
            case 3:
                this.thirdByte = value;
                break;
            case 4:
                this.fourthByte = value;
                break;
        }
    }
}

export {ipAddressParser};