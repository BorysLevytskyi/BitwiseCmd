import React, { useState } from 'react';
import BinaryStringView from '../../core/components/BinaryString';
import './VpcView.css';
import { getNetworkAddress, getAddressSpaceSize } from '../subnet-utils';
import IpAddressBinaryString from './IpAddressBinaryString';
import { IpAddress, IpAddressWithSubnetMask, VpcCommand } from '../models';
import formatter from '../../core/formatter';
import Toggle from '../../shell/components/Toggle';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const MAX_NON_HOSTS_BITS = 30; // leave two bits for hosts min

function SubnetView(props: { vpc: VpcCommand }) {

    const [vpc, setVpc] = useState(VpcModel.create(props.vpc));

    const subnetMaskSize = vpc.cidr.maskBits + vpc.subnetBits;
    const maxSubnets = Math.pow(2, vpc.subnetBits);
    const hostsPerSubnet = getAddressSpaceSize(subnetMaskSize);
    const networkAddress = getNetworkAddress(vpc.cidr);

    const decrSubnet = () => setVpc(vpc.changeSubnetBits(vpc.subnetBits - 1));
    const incrSubnet = () => setVpc(vpc.changeSubnetBits(vpc.subnetBits + 1));
    const incrVpc = () => setVpc(vpc.changeVpcCidr(new IpAddressWithSubnetMask(vpc.cidr.ipAddress, vpc.cidr.maskBits + 1)));
    const decrVpc = () => setVpc(vpc.changeVpcCidr(new IpAddressWithSubnetMask(vpc.cidr.ipAddress, vpc.cidr.maskBits - 1)));

    const split = formatter.splitByMasks(networkAddress.toBinaryString(), vpc.cidr.maskBits, subnetMaskSize);

    return <React.Fragment>

        <div className="expression vpc-view">

            <div className="address-container">
                <div>
                    <span>VPC Network Address</span>
                </div>
                <div>
                    <BinaryStringView binaryString={split.vpc} disableHighlight={true} className="address-space soft" />
                    <BinaryStringView binaryString={split.subnet} disableHighlight={true} className="address-space subnet-part" />
                    <BinaryStringView binaryString={split.hosts} disableHighlight={true} className="address-space host-part" />
                    <span className="address-space decimal-part">{networkAddress.toString()}</span>
                    <Toggle text="[i]" isOn={vpc.showLegend} onClick={() => setVpc(vpc.toggleLegend())} title="Show/Hide Color Legend">
                        <FontAwesomeIcon className="icon" icon={faQuestionCircle} size="sm" />
                    </Toggle>
                </div>
                <div style={{"display" : vpc.showLegend ? '' : 'none'}}>
                    <p>
                        Color Legend
                    </p>
                    <span className="address-space soft">000</span> - VPC address bits <br/>
                    <span className="address-space subnet-part">000</span> - Bits dedicated for subnets address<br/>
                    <span className="address-space host-part">000</span> - Bits dedicated to host addresses inside each subnet
                </div>
            </div>

            <table className="vpc-details">
                <tbody>
                    <tr>
                        <td className="soft">
                            VPC CIDR Mask:
                    </td>
                        <td>
                            <button className="btn" onClick={decrVpc} disabled={vpc.cidr.maskBits <= 1} title="Decrease vpc address bits">-</button>
                         /{vpc.cidr.maskBits}
                            <button className="btn" onClick={incrVpc} disabled={subnetMaskSize >= MAX_NON_HOSTS_BITS} title="Increse vpc address bits">+</button>
                        </td>
                    </tr>
                    <tr>
                        <td className="soft">
                            Subnet CIDR Mask:
                    </td>
                        <td>
                            <button className="btn" onClick={decrSubnet} disabled={vpc.subnetBits <= 1} title="Increase subnet bits">-</button>
                        /{subnetMaskSize}
                            <button className="btn" onClick={incrSubnet} disabled={vpc.cidr.maskBits + vpc.subnetBits >= MAX_NON_HOSTS_BITS} title="Increase subnet bits">+</button>
                        </td>
                    </tr>
                    <tr>
                        <td className="soft">
                            Max Subnets in VPC:
                    </td>
                        <td>
                            <button className="btn" onClick={decrSubnet} disabled={vpc.subnetBits <= 1} title="Decrease subnet bits">-</button>
                            {maxSubnets}
                            <button className="btn" onClick={incrSubnet} disabled={vpc.cidr.maskBits + vpc.subnetBits >= MAX_NON_HOSTS_BITS} title="Increase subnet bits">+</button>
                        </td>
                    </tr>
                    <tr>
                        <td className="soft">
                            Max Hosts in VPC:
                    </td>
                        <td>
                            {maxSubnets * hostsPerSubnet}
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
                </tbody>
            </table>
        </div>
    </React.Fragment>;
}

function Indicator2(props: { ip: IpAddress, descr: string }) {

    const { ip, descr } = props;

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
    showLegend: boolean;

    constructor(cidr: IpAddressWithSubnetMask, subnetBits: number) {
        this.cidr = cidr;
        this.subnetBits = subnetBits;
        this.subnetNum = 0;
        this.showLegend = false;
    }

    static create(vpc: VpcCommand) {
        return new VpcModel(vpc.cidr, vpc.subnetBits);
    }

    clone() : VpcModel {
        return Object.assign(new VpcModel(this.cidr, this.subnetBits), this);
    }

    changeSubnetBits(n: number) {
        return new VpcModel(this.cidr, n);
    }

    changeVpcCidr(newCidr: IpAddressWithSubnetMask) {
        return new VpcModel(newCidr, this.subnetBits);
    }

    toggleLegend() {
        var n = new VpcModel(this.cidr,  this.subnetBits);
        n.showLegend = !this.showLegend;
        return n;
    }
}
