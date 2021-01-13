import React from 'react';
import { IpAddress, OctetNumber, getNetworkClass } from '../../ipaddress/ip';
import formatter from '../../core/formatter'
import BinaryStringView from './BinaryString';
import './IpAddressView.css';
type IpAddressViewProps = {
    ipAddress: IpAddress
};

export class IpAddressView extends React.Component<IpAddressViewProps> 
{
    
    render() {
        
        const ip = this.props.ipAddress;

        return <div>
            <table>
                <thead>
                    <tr>
                    <th>{ip.firstByte}</th>
                    <th>{ip.secondByte}</th>
                    <th>{ip.thirdByte}</th>
                    <th>{ip.fourthByte}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{this.bin(ip.firstByte, 1)}</td>
                        <td>{this.bin(ip.secondByte, 2)}</td>
                        <td>{this.bin(ip.thirdByte, 3)}</td>
                        <td>{this.bin(ip.fourthByte, 4)}</td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="ip-address-info">
                            <a href="https://www.wikiwand.com/en/Classful_network" target="_blank">Network Class: {getNetworkClass(this.props.ipAddress).toUpperCase()}</a>
                        </td>
                    </tr>
                </tbody>
            </table>            
        </div>
    }

    bin(value: number, octetNumber: OctetNumber) {
        return <BinaryStringView 
            binaryString={fmt(value)} 
            key={2} 
            emphasizeBytes={false} 
            allowFlipBits={true} 
            onFlipBit={e => this.onFlippedBit(e.newBinaryString, octetNumber)} />;
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