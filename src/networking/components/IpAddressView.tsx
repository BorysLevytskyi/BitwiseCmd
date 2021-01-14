import React from 'react';
import { IpAddress, OctetNumber, getNetworkClass } from '../ip';
import formatter from '../../core/formatter'
import BinaryStringView from '../../core/components/BinaryString';
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
                        <td className="bin">
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
                        <th className='first-decimal'>{ip.firstByte}</th>
                        <th className='second-decimal'>{ip.secondByte}</th>
                        <th className='third-decimal'>{ip.thirdByte}</th>
                        <th className='fourth-decimal'>{ip.fourthByte}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='first-bin'>{this.bin(ip.firstByte, 1, ip)}</td>
                        <td className='second-bin'>{this.bin(ip.secondByte, 2, ip)}</td>
                        <td className='third-bin'>{this.bin(ip.thirdByte, 3, ip)}</td>
                        <td className='fourth-bin'>{this.bin(ip.fourthByte, 4, ip)}</td>
                    </tr>
                    {/* <tr>
                        <td colSpan={2} className="ip-address-info">
                            <a href="https://www.wikiwand.com/en/Classful_network" target="_blank">Network Class: {getNetworkClass(ip).toUpperCase()}</a>
                        </td>
                    </tr> */}
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