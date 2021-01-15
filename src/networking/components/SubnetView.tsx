import React from 'react';
import BinaryStringView from '../../core/components/BinaryString';
import formatter from '../../core/formatter';
import { IpAddress, SubnetDefinition } from '../ip';
import './SubnetView.css';

function SubnetView({subnet} : {subnet : SubnetDefinition}) {
    const maskLen = subnet.input.maskBits;

    return <React.Fragment>
        <table className="expression subnet-view">
            <thead>
                <tr className='soft'>
                        <th></th>
                        <th></th>
                        <th className="class-part small-text part">Mask</th>
                        <th className="address-space small-text part" colSpan={2}>Address Space</th>
                    </tr>
            </thead>
            <tbody>
                    <SubnetRow addr={subnet.input.ipAddress} maskLen={maskLen} descr="Address"/>
                    <SubnetRow addr={subnet.getNetworkAddress()} maskLen={maskLen} descr="Network"/>
                    {/* TODO: <SubnetRow addr={subnet.getBroadcastAddress()} maskLen={maskLen} descr="Broadcast"/> */}
                    <SubnetRow addr={subnet.input.createSubnetMaskIp()} maskLen={maskLen} descr="Net Mask"/>
                    <tr>
                        <td className="description soft">
                            <span>Mask Length</span>
                        </td>
                        <td>
                            {subnet.input.maskBits}
                        </td>
                    </tr>
                    <tr>
                        <td className="description soft">
                            <span>Network Size</span>
                        </td>
                        <td>
                            {subnet.getAdressSpaceSize()}
                        </td>
                    </tr>
            </tbody>
        </table>
        <div>
    </div>
    </React.Fragment>;
}

function SubnetRow(props: { addr: IpAddress, descr: string, maskLen: number }) {

    const {addr, descr, maskLen} = props;

    const addrBin = `${formatter.emBin(addr.firstByte)}${formatter.emBin(addr.secondByte)}${formatter.emBin(addr.thirdByte)}${formatter.emBin(addr.fourthByte)}`;

    const classPart = addrBin.substr(0, maskLen);
    const spacePart = addrBin.substr(maskLen);

    return <tr>
            <td className="description soft">{descr}</td>
                <td className="ip">
                   {addr.toString()}
                </td>
                <td className="class-part">
                <BinaryStringView binaryString={classPart} />
            </td>
            <td className="address-space">
                <BinaryStringView binaryString={spacePart} allowFlipBits={true} />
            </td>
        </tr>;
}

export default SubnetView;