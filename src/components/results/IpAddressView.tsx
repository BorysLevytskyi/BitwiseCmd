import React from 'react';
import { IpAddress, OctetNumber } from '../../ipaddress/ip';
import formatter from '../../core/formatter'
import BinaryStringView from './BinaryString';

type IpAddressViewProps = {
    ipAddress: IpAddress
};

export class IpAddressView extends React.Component<IpAddressViewProps> 
{
    
    render() {
        
        const ip = this.props.ipAddress;

        return <div>
            <table>
                {this.octet(ip.firstByte, 1)}
                {this.octet(ip.secondByte, 2)}
                {this.octet(ip.thirdByte, 3)}
                {this.octet(ip.fourthByte, 4)}
            </table>
            
        </div>
    }

    octet(number: number, octetNumber: OctetNumber) {
        return <tr>
        <td>{number}</td>
            <td>
                <BinaryStringView 
                    binaryString={fmt(number)} 
                    key={2} 
                    emphasizeBytes={false} 
                    allowFlipBits={true} 
                    onFlipBit={e => this.onFlippedBit(e.newBinaryString, octetNumber)} />
            </td>
        </tr>
    }
    
    onFlippedBit(binaryString: string, number: OctetNumber) {
        this.props.ipAddress.setOctet(number, parseInt(binaryString, 2));
        this.forceUpdate();
    }
};

function fmt(num: number) : string {
    return formatter.padLeft(formatter.formatString(num, 'bin'), 8, '0');
}

export default IpAddressView;