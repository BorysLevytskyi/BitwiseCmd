import { IpAddress, IpAddressWithSubnetMask, SubnetCommand, VpcCommand } from './models';

export type ParsedIpObject = IpAddress | IpAddressWithSubnetMask;

export type ParsingResult = ParsedIpObject[] | 
                            SubnetCommand | 
                            ParsingError | 
                            VpcCommand |
                            null;

const CMD_SUBNET = 'subnet';
const CMD_VPC = 'vpc';

const ipAddressParser = {
    parse: function(input: string) : ParsingResult {

        const result = this.parseCommand(input);

        const matches = this.getMaches(result.nextInput);
        const correctInputs = matches.filter(m => m.matches !== null && m.matches !== undefined);
        const incorrectInputs = matches.filter(m => m.matches === null || m.matches === undefined);

        if(correctInputs.length === 0)
            return null;

        if(incorrectInputs.length > 0) {
                return new ParsingError(`Value(s) ${incorrectInputs.map(v => v.input).join(',')} was not recognized as valid ip address or ip address with a subnet mask`);
        }

        const parsedObjects = matches.map(m => this.parseSingle(m.matches!, m.input));
        const parsingErrors = parsedObjects.filter(p => p instanceof ParsingError);

        if(parsingErrors.length > 0) {
            return parsingErrors[0] as ParsingError;
        }

        if(result.command !== null) {
            const cmd =
             result.command === CMD_SUBNET
                ? this.createSubnetDefinition(parsedObjects as ParsedIpObject[])
                : this.createVpcDefinition(parsedObjects as ParsedIpObject[]);
            
            return  cmd;
        } 

        return parsedObjects as ParsedIpObject[];
    },

    parseCommand(input : string) : { command: null | string, nextInput: string } {

        

        if(input.startsWith(CMD_SUBNET)) 
            return { command: CMD_SUBNET, nextInput: input.substring(CMD_SUBNET.length)};

        if(input.startsWith(CMD_VPC)) {
            return {command: CMD_VPC, nextInput: input.substring(CMD_VPC.length)};
        }

        return { command: null, nextInput: input };
    },

    getMaches(input : string) : { matches: RegExpExecArray | null, input: string }[] {

        return input
            .replace(/[\t\s]+/g, ' ')
            .split(' ')
                .filter(s => s.length>0)
                .map(s => {
                    const ipV4Regex = /^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})(\/\d+)?$/;
                    const matches = ipV4Regex.exec(s);
                    
                    if(matches === null || matches.length === 0)
                        return {matches: null, input: s};
                    
                    return {matches, input: s};
                });
    },

    parseSingle(matches : RegExpExecArray, input: string) : ParsedIpObject | ParsingError {
        const invalid = (n: number) => n < 0 || n > 255;
    
        const first = parseInt(matches[1]);
        const second = parseInt(matches[2]);
        const third = parseInt(matches[3]);
        const fourth = parseInt(matches[4]);

        if(invalid(first) || invalid(second) || invalid(third) || invalid(fourth))
            return new ParsingError(`${input} doesn't represent a valid IP address space`);

        const ipAddress = new IpAddress(first, second, third, fourth);

        if(matches[5]) {
            const maskPart = matches[5].substr(1);
            const maskBits = parseInt(maskPart);

            if(maskBits > 32) {
                return new ParsingError(`Subnet mask value in ${input} is out of range`);
            }

            return new IpAddressWithSubnetMask(ipAddress, maskBits);
        }

        return ipAddress;
    },

    createSubnetDefinition(items: ParsedIpObject[]) : SubnetCommand | ParsingError {
        if(items.length !== 1)
            return new ParsingError("Incorrect network definition");
        
        const first = items[0];
        if(first instanceof IpAddressWithSubnetMask) {
            return new SubnetCommand(first);
        }

        return new ParsingError("Network definition requires subnet mask");
    },

    createVpcDefinition(items: ParsedIpObject[]) : VpcCommand | ParsingError {

        if(items.length !== 1)
            return new ParsingError("Incorrect VPC definition");
        
        const first = items[0];
        if(first instanceof IpAddressWithSubnetMask) {
            return new VpcCommand(first);
        }

        return new ParsingError("VPC definition requires subnet mask");
    }
}

export class ParsingError {
    errorMessage: string;
    constructor(message: string) {
        this.errorMessage = message;
    }
}

export default ipAddressParser;