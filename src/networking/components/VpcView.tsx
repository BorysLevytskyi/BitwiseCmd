import React, { useState } from 'react';
import BinaryStringView from '../../core/components/BinaryString';
import './VpcView.css';
import { getNetworkAddress, getBroadCastAddress, createSubnetMaskIp, getAddressSpaceSize } from '../subnet-utils';
import { chunkifyString } from '../../core/utils';
import IpAddressBinaryString from './IpAddressBinaryString';
import { IpAddress, IpAddressWithSubnetMask, SubnetCommand, VpcCommand } from '../models';
import formatter, { padLeft } from '../../core/formatter';

type ViewMode = "color" | "table";

function SubnetView(props : {vpc : VpcCommand}) {

    const mode : ViewMode = "color";

    const [vpc, setVpc] = useState(VpcModel.create(props.vpc));

    const subnetMaskSize = vpc.cidr.maskBits + vpc.subnetBits;
    const vpcPart = getNetworkAddress(vpc.cidr).toBinaryString(true).substring(0, vpc.cidr.maskBits);
    const subnetsPart = padLeft("0", vpc.subnetBits, "0");
    const lastPart = padLeft("0", 32 - (vpc.cidr.maskBits + vpc.subnetBits), "0");
    const maxSubnets = Math.pow(2, vpc.subnetBits);
    const hostsPerSubnet = getAddressSpaceSize(subnetMaskSize);
    const networkAddress = getNetworkAddress(vpc.cidr);

    const decrSubnet = () => setVpc(vpc.changeSubnetBits(vpc.subnetBits-1));
    const incrSubnet = () => setVpc(vpc.changeSubnetBits(vpc.subnetBits+1));
    const incrVpc = () => setVpc(vpc.changeVpcCidr(new IpAddressWithSubnetMask(vpc.cidr.ipAddress, vpc.cidr.maskBits+1)));
    const decrVpc = () => setVpc(vpc.changeVpcCidr(new IpAddressWithSubnetMask(vpc.cidr.ipAddress, vpc.cidr.maskBits-1)));

    
    const split = formatter.splitByMasks(networkAddress.toBinaryString(), vpc.cidr.maskBits, subnetMaskSize);

    return <React.Fragment>
        
        <div className="expression vpc-view">
        <div style={{display: mode === "color" ? '': 'none'}}>
            <BinaryStringView binaryString={split.vpc} disableHighlight={true} className="address-space soft" />
            <BinaryStringView binaryString={split.subnet} disableHighlight={true} className="address-space subnet-part"/>
            <BinaryStringView binaryString={split.hosts} disableHighlight={true} className="address-space host-part" />
        </div>
            <div style={{display: mode === "color" ? 'none': ''}}>
                <table>
                    <tr>
                        <td className="address-space-label">
                            VPC
                        </td>
                        <td className="address-space-label">
                            Subnets
                        </td>
                        <td className="address-space-label">
                            Hosts
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button onClick={decrVpc} disabled={vpc.cidr.maskBits <= 1} title="Increase vpc space">-</button>
                                <BinaryStringView binaryString={vpcPart}  className="address-space" />
                            <button onClick={incrVpc} disabled={subnetMaskSize >= 30} title="Decrease vpc space">+</button>
                        </td>
                        <td>
                            <button onClick={decrSubnet} disabled={vpc.subnetBits <= 1} title="Increase subnet space">-</button>
                                <BinaryStringView binaryString={subnetsPart} className="address-space" />
                            <button onClick={incrSubnet} disabled={vpc.cidr.maskBits + vpc.subnetBits >= 30} title="Decrease subnet space">+</button>
                        </td>
                        <td>
                            <BinaryStringView binaryString={lastPart} className="address-space" />
                        </td>
                    </tr>
                   
                </table>
            </div>
            <table className="vpc-details">
                <tr>
                    <td className="soft">
                        VPC Network Address: 
                    </td>
                    <td>
                          {getNetworkAddress(vpc.cidr).toString()}
                    </td>
                </tr>              
                <tr>
                    <td className="soft">
                        VPC CIDR Mask: 
                    </td>
                    <td>
                        <button onClick={decrVpc} disabled={vpc.cidr.maskBits <= 1} title="Increase vpc space">-</button>
                         /{vpc.cidr.maskBits}
                         <button onClick={incrVpc} disabled={subnetMaskSize >= 30} title="Decrease vpc space">+</button>
                    </td>
                </tr>
                <tr>
                    <td className="soft">
                        Subnet CIDR Mask:
                    </td>
                    <td>
                        <button onClick={decrSubnet} disabled={vpc.subnetBits <= 1} title="Increase subnet space">-</button>
                        /{subnetMaskSize}
                        <button onClick={incrSubnet} disabled={vpc.cidr.maskBits + vpc.subnetBits >= 30} title="Decrease subnet space">+</button>
                    </td>
                </tr>
                <tr>
                    <td className="soft">
                        Max Subnets in VPC:
                    </td>
                    <td>
                    {maxSubnets}
                    </td>
                </tr>
                <tr>
                    <td className="soft">
                        Max Hosts in VPC:
                    </td>
                    <td>
                        {maxSubnets*hostsPerSubnet}
                    </td>
                </tr>
                <tr>
                    <td className="soft">
                        Hosts Per Subnet:
                    </td>
                    <td>
                        {hostsPerSubnet}
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
