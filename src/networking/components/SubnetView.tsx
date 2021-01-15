import React from 'react';
import BinaryStringView from '../../core/components/BinaryString';
import formatter from '../../core/formatter';
import { IpAddress, SubnetDefinition } from '../ip';
import './SubnetView.css';

function SubnetView({subnet} : {subnet : SubnetDefinition}) {
    const maskLen = subnet.definition.maskBits;

    return <table className="expression subnet-view">
        <thead>
            <tr>
                    <th className="label"></th>
                    <th className="class-part">Mask</th>
                    <th className="address-space">Address Space</th>
                </tr>
        </thead>
        <tbody>
                <SubnetRow addr={subnet.getNetworkAddress()} maskLen={maskLen} descr="Network Address"/>
                <SubnetRow addr={subnet.definition.ipAddress} maskLen={maskLen} descr="Host Address"/>
        </tbody>
    </table>
}

function SubnetRow(props: { addr: IpAddress, descr: string, maskLen: number }) {

    const {addr, descr, maskLen} = props;

    const addrBin = `${formatter.emBin(addr.firstByte)}${formatter.emBin(addr.secondByte)}${formatter.emBin(addr.thirdByte)}${formatter.emBin(addr.fourthByte)}`;

    const classPart = addrBin.substr(0, maskLen);
    const spacePart = addrBin.substr(maskLen);

    return <tr>
                <td className="label">
                    {addr.toString()}
                </td>
                <td className="class-part">
                <BinaryStringView binaryString={classPart} />
            </td>
            <td className="address-space">
                <BinaryStringView binaryString={spacePart} allowFlipBits={true} />
            </td>
            <td className="description soft">{descr}</td>
        </tr>;
}

export default SubnetView;