import React from 'react';
import BinaryStringView from '../../core/components/BinaryString';
import { IpAddress } from '../IpAddress';
import formatter from '../../core/formatter';

function IpAddressBinaryString({ip}: {ip:IpAddress}) {

   return <React.Fragment>
        <BinaryStringView binaryString={formatter.emBin(ip.firstByte)} />
                    <span className="soft">.</span>
                    <BinaryStringView binaryString={formatter.emBin(ip.secondByte)} />
                    <span className="soft">.</span>
                    <BinaryStringView binaryString={formatter.emBin(ip.thirdByte)} />
                    <span className="soft">.</span>
                    <BinaryStringView binaryString={formatter.emBin(ip.fourthByte)} />
   </React.Fragment>;
}

export default IpAddressBinaryString;