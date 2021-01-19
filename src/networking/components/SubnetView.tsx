import React, { useState } from 'react';
import BinaryStringView from '../../core/components/BinaryString';
import './SubnetView.css';
import { getNetworkAddress, getBroadCastAddress, createSubnetMaskIp } from '../subnet-utils';
import { chunkifyString } from '../../core/utils';
import IpAddressBinaryString from './IpAddressBinaryString';
import { IpAddress, IpAddressWithSubnetMask, SubnetCommand } from '../models';

function SubnetView(props : {subnet : SubnetCommand}) {

    const [subnet, setSubnet] = useState(props.subnet);

    const incrementMask = () => {
        const newInput = new IpAddressWithSubnetMask(subnet.input.ipAddress, subnet.input.maskBits+1);
        setSubnet(new SubnetCommand(newInput));
    };

    const decrementMask = () => {
        const newInput = new IpAddressWithSubnetMask(subnet.input.ipAddress, subnet.input.maskBits-1);
        setSubnet(new SubnetCommand(newInput));
    }

    return <React.Fragment>
        <table className="expression subnet-view">
            <tbody>
                    <SubnetRow ip={subnet.input.ipAddress} descr="Address"/>
                    <SubnetRow ip={getNetworkAddress(subnet.input)} descr="Network"/>
                    <SubnetRow ip={createSubnetMaskIp(subnet.input)} descr="Net Mask"/>
                    <SubnetRow ip={getBroadCastAddress(subnet.input)} descr="Broadcast"/>                  
                    <tr>
                        <td data-test-name="label" className="soft">
                            <span>Network Size</span>
                        </td>
                        <td data-test-name="decimal">
                            {subnet.getAdressSpaceSize()}
                        </td>
                    </tr>
                    <tr>
                        <td data-test-name="label" className="soft">
                            Mask Size
                        </td>
                        <td data-test-name="decimal">
                           
                            <button onClick={decrementMask} disabled={subnet.input.maskBits === 0} title="Decrease mask size">-</button>
                            <span>{subnet.input.maskBits}</span>
                            <button onClick={incrementMask} disabled={subnet.input.maskBits === 32} title="Increase mask size">+</button>
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
            <td className="soft" data-test-name="label">{descr}</td>
                <td data-test-name="decimal" className="ip-address-col">
                   {ip.toString()}
                </td>
                <td data-test-name="bin">
                    <IpAddressBinaryString ip={ip} />
            </td>
        </tr>;
}

export default SubnetView;