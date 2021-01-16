import React from 'react';
import formatter from '../../core/formatter'
import BinaryStringView from '../../core/components/BinaryString';
import './IpAddressView.css';
import { IpAddress, OctetNumber } from '../models';

type IpAddressViewProps = {
    ipAddresses: IpAddress[]
};

export class IpAddressView extends React.Component<IpAddressViewProps> 
{
    
    render() {        
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