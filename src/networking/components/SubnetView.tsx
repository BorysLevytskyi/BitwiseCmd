import React from 'react';
import BinaryStringView from '../../core/components/BinaryString';
import { SubnetDefinition } from '../ip';

function SubnetView(props : {subnet : SubnetDefinition}) {
    return <table className="expression">
        <tbody>
                <tr>
                    <td className="network-address">
                        {props.subnet.toString()}
                    </td>
                </tr>
        </tbody>
    </table>
}

export default SubnetView;