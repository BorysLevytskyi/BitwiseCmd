import React from 'react';
import BinaryStringView from '../../core/components/BinaryString';
import { SubnetDefinition } from "../SubnetDefinition";
import { IpAddress } from "../IpAddress";
import './SubnetView.css';
import { getNetworkAddress, getBroadCastAddress, createSubnetMaskIp } from '../subnet-utils';
import { chunkifyString } from '../../core/utils';
import IpAddressBinaryString from './IpAddressBinaryString';

function SubnetView({subnet} : {subnet : SubnetDefinition}) {
    const maskLen = subnet.input.maskBits;

    return <React.Fragment>
        <table className="expression subnet-view">
            <tbody>
                    <SubnetRow ip={subnet.input.ipAddress} descr="Address"/>
                    <SubnetRow ip={getNetworkAddress(subnet.input)} descr="Network"/>
                    <SubnetRow ip={createSubnetMaskIp(subnet.input)} descr="Net Mask"/>
                    <SubnetRow ip={getBroadCastAddress(subnet.input)} descr="Broadcast"/>
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

function SubnetRow(props: { ip: IpAddress, descr: string}) {

    const {ip, descr} = props;

    return <tr>
            <td className="description soft">{descr}</td>
                <td className="ip">
                   {ip.toString()}
                </td>
                <td className="class-part">
                    <IpAddressBinaryString ip={ip} />
            </td>
        </tr>;

    function addDots(bin: string) {
        return chunkifyString(bin, 8).map((s, i) => <BinaryStringView binaryString={s} key={i} />)
    }
}

export default SubnetView;