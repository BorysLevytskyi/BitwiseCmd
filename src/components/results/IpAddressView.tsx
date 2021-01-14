import React from 'react';
import { IpAddress, OctetNumber, getNetworkClass } from '../../ipaddress/ip';
import formatter from '../../core/formatter'
import BinaryStringView from './BinaryString';
import './IpAddressView.css';
type IpAddressViewProps = {
    ipAddresses: IpAddress[]
};

export class IpAddressView extends React.Component<IpAddressViewProps> 
{
    
    render() {
        if(this.props.ipAddresses.length === 1)
            return this.renderSingleIp(this.props.ipAddresses[0]);
        
        return this.renderMultipleIps();
    }

    renderMultipleIps() {
        return <table className="expression">
            <tbody>
                {this.props.ipAddresses.map((ip, i) => <tr key={i}>
                        <td className="label"><strong>{ip.toString()}</strong></td>
                        <td>
                            {this.bin(ip.firstByte, 1, ip)}<span className="soft">.</span>
                            {this.bin(ip.secondByte, 2, ip)}<span className="soft">.</span>
                            {this.bin(ip.thirdByte, 3, ip)}<span className="soft">.</span>
                            {this.bin(ip.fourthByte, 4, ip)}
                        </td>
                    </tr>)}
            </tbody>
        </table>
    }

    renderSingleIp(ip: IpAddress) {
        return <table className="expression">
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
                        <td>{this.bin(ip.firstByte, 1, ip)}</td>
                        <td>{this.bin(ip.secondByte, 2, ip)}</td>
                        <td>{this.bin(ip.thirdByte, 3, ip)}</td>
                        <td>{this.bin(ip.fourthByte, 4, ip)}</td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="ip-address-info">
                            <a href="https://www.wikiwand.com/en/Classful_network" target="_blank">Network Class: {getNetworkClass(ip).toUpperCase()}</a>
                        </td>
                    </tr>
                </tbody>
            </table>;
    }

    bin(value: number, octetNumber: OctetNumber, ip: IpAddress) {
        return <BinaryStringView 
            binaryString={fmt(value)} 
            key={octetNumber} 
            emphasizeBytes={false} 
            allowFlipBits={true}
            className={`octet-${octetNumber}`}
            onFlipBit={e => this.onFlippedBit(e.newBinaryString, octetNumber, ip)} />;
    }
    
    onFlippedBit(binaryString: string, number: OctetNumber, ip : IpAddress) {
        ip.setOctet(number, parseInt(binaryString, 2));
        this.forceUpdate();
    }
};

function fmt(num: number) : string {
    return formatter.padLeft(formatter.formatString(num, 'bin'), 8, '0');
}

export default IpAddressView;