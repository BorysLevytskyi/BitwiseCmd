import React from 'react';
import { IpAddress } from '../../ipaddress/ip';
import formatter from '../../core/formatter'
import BinaryStringView from './BinaryString';

type IpAddressViewProps = {
    ipAddress: IpAddress
};

function IpAddressView(props: IpAddressViewProps) {
    
    const ip = props.ipAddress;
    const em = false;
    const alloweFlipBits = false;

    return <div>
        <table>
            {octet(ip.firstByte)}
            {octet(ip.secondByte)}
            {octet(ip.thirdByte)}
            {octet(ip.fourthByte)}
        </table>
        
    </div>

    function octet(number: number) {
        return <tr>
            <td>{number}</td>
            <td><BinaryStringView binaryString={fmt(number)} key={2} emphasizeBytes={false} allowFlipBits={false} /></td>
        </tr>
    }
};

function fmt(num: number) : string {
    return formatter.padLeft(formatter.formatString(num, 'bin'), 8, '0');
}

export default IpAddressView;