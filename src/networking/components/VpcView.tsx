import React, { useState } from 'react';
import BinaryStringView from '../../core/components/BinaryString';
import './SubnetView.css';
import { getNetworkAddress, getBroadCastAddress, createSubnetMaskIp, getAddressSpaceSize } from '../subnet-utils';
import { chunkifyString } from '../../core/utils';
import IpAddressBinaryString from './IpAddressBinaryString';
import { IpAddress, IpAddressWithSubnetMask, SubnetCommand, VpcCommand } from '../models';
import { padLeft } from '../../core/formatter';

function SubnetView(props : {vpc : VpcCommand}) {

    const [vpc, setVpc] = useState(VpcModel.create(props.vpc));

    const subnetMask = vpc.cidr.maskBits + vpc.subnetBits;
    const vpcPart = getNetworkAddress(vpc.cidr).toBinaryString(true).substring(0, vpc.cidr.maskBits);
    const subnetsPart = padLeft("0", vpc.subnetBits, "0");
    const lastPart = padLeft("0", 32 - (vpc.cidr.maskBits + vpc.subnetBits), "0");

    const decrSubnet = () => setVpc(vpc.changeSubnetBits(vpc.subnetBits-1));
    const incrSubnet = () => setVpc(vpc.changeSubnetBits(vpc.subnetBits+1));
    const incrVpc = () => setVpc(vpc.changeVpcCidr(new IpAddressWithSubnetMask(vpc.cidr.ipAddress, vpc.cidr.maskBits+1)));
    const decrVpc = () => setVpc(vpc.changeVpcCidr(new IpAddressWithSubnetMask(vpc.cidr.ipAddress, vpc.cidr.maskBits-1)));

    return <React.Fragment>
        <div className="expression vpc-view">
            <table>
                <tr>
                    <td>
                        VPC Address Space
                    </td>
                    <td>
                        <BinaryStringView binaryString={vpcPart} /><BinaryStringView binaryString={subnetsPart} className="accent-background" /><BinaryStringView binaryString={lastPart} />
                       </td>
                    </tr>
                <tr>
                    <td>
                        VPC Mask: 
                    </td>
                    <td>
                        <button onClick={decrVpc} disabled={vpc.cidr.maskBits <= 1} title="Increase vpc space">-</button>
                            /{vpc.cidr.maskBits}
                        <button onClick={incrVpc} disabled={subnetMask >= 31} title="Decrease vpc space">+</button>
                    </td>
                </tr>
                <tr>
                    <td>                        
                            Subnet Mask:                    
                    </td>
                    <td>
                        <button onClick={decrSubnet} disabled={vpc.subnetBits <= 1} title="Increase subnet space">-</button>
                        /{subnetMask}
                        <button onClick={incrSubnet} disabled={vpc.cidr.maskBits + vpc.subnetBits >= 31} title="Decrease subnet space">+</button>
                    </td>
                </tr>
                <tr>
                    <td>
                        Max Subnets:
                    </td>
                    <td>
                    {Math.pow(2, vpc.subnetBits)}
                    </td>
                </tr>
                <tr>
                    <td>
                        Subnet Network Size:
                    </td>
                    <td>
                    {getAddressSpaceSize(subnetMask)}
                    </td>
                </tr>
            </table>       
        </div>
    </React.Fragment>;
}

function VpcRow(props: { ip: IpAddress, descr: string}) {

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

class VpcModel {
    cidr: IpAddressWithSubnetMask;
    subnetBits: number;
    subnetNum: number;
    
    constructor(cidr: IpAddressWithSubnetMask, subnetBits: number) {
        this.cidr = cidr;
        this.subnetBits = subnetBits;
        this.subnetNum = 0;
    }

    static create(vpc: VpcCommand) {
        return new VpcModel(vpc.cidr, vpc.subnetBits);
    }

    changeSubnetBits(n: number) {
        return new VpcModel(this.cidr, n);
    }

    changeVpcCidr(newCidr: IpAddressWithSubnetMask) {
        return new VpcModel(newCidr, this.subnetBits);
    }
}
