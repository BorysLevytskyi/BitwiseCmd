import React from 'react';
import CommandLink from '../../core/components/CommandLink';
import './WhatsNewResultView.css';

function WhatsNewResultView() {

    return <div className="changelog">
        <h3>Changelog</h3>
        <div className='item item-new'>
            <p>
                <span className="soft date">Nov 6th, 2025</span> <br />
            </p>
            <ul>                
                <li>Introduced a Centered Layout option that centers content on wide monitors; you can revert to the stretched layout in <CommandLink text="settings" />.</li>
            </ul>
        </div>
        <div className='item'>
            <p>
                <span className="soft date">May 10th, 2023</span> <br />
                <p>
                    Behold! After a long time of inactivity, BitwiseCmd is getting an update. Here is what changed:
                </p>
                <ul>
                    <li>The browser's JavaScript engine is no longer used for executing bitwise operations.
                        BitwiseCmd now has its own shiny, custom-built bitwise calculator that supports bitwise operations on integers of different sizes (8, 16, 32, and 64 bits), in both signed and unsigned variants. <CommandLink text='Check it out!' command='-1b 255ub -1 4294967295u -1l 18446744073709551615u' />&nbsp;
                        This calculator follows the behavior of bitwise operations as implemented in C, including edge cases.
                        For example, shifting an integer by a number of bits equal to its width is undefined behavior in C (see this <a href="https://codeyarns.com/tech/2004-12-20-c-shift-operator-mayhem.html#gsc.tab=0">link</a>).
                    </li>
                    <li>A slightly improved UI</li>
                </ul>
                <p>I'm sure there will be some bugs following such a big update. I will do my best to fix them as they are found.</p>
                <p>Many thanks to everyone who submitted issues on GitHub. Your feedback is greatly appreciated.</p>
            </p>
        </div>
        <div className='item'>
            <span className="soft date">May 5th, 2023</span> <br />
            <p>
                Fixed a <a href="https://github.com/BorysLevytskyi/BitwiseCmd/issues/13">bug</a> with the binary representation of 64-bit numbers.
            </p>
        </div>
        <div className="item">
            <p><span className="soft date">Jul 24th, 2021</span> <br />
                <ul>
                    <li>Added support for the <code>vpc</code> command to see how the VPC network address bits are divided between the VPC, subnets, and hosts. Try it out: <CommandLink text="vpc 192.168.24.1/24" /></li>
                    <li>Added the ability to remove individual results</li>
                </ul>
            </p>
        </div>
        <div className="item">
            <span className="soft date">Jun 16th, 2021</span>
            <p>
                Added support for the <code>subnet</code> command to display subnet information (network address, broadcast address, etc.). Try it out: <CommandLink text="subnet 192.168.24.1/14" />
            </p>
        </div>
        <div className="item">
            <span className="soft date">Jun 14th, 2021</span>
            <p>
                Added support for IP addresses and subnet mask notation. Try them out:
            </p>
            <ul>
                <li>A single IP address <CommandLink text="127.0.0.1" /></li>
                <li>Multiple IP addresses and subnet mask notations <CommandLink text="127.0.0.1 192.168.0.0/24" /></li>
            </ul>

        </div>
        <div className="item">
            <span className="soft date">Jun 6th, 2017</span>
            <p>
                Added the <code><CommandLink text="guid" /></code> command. Use it to generate v4 GUIDs.</p>
        </div>
        <div className="item">
            <span className="soft date">May 27th, 2017</span>
            <p>
                Added support of binary number notation (e.g. <code><CommandLink text="0b10101" /></code>). </p>
        </div>
        <div className="item">
            <span className="soft">May 20th, 2017</span>
            <p>
                A new <CommandLink text="Midnight" /> theme was added.
            </p>
        </div>
        <div className="item">
            <span className="soft">May 16th, 2017</span>
            <p>
                Complete rewrite using React. Please let me know if you have problems with this release by <a href="https://github.com/BorysLevytskyi/BitwiseCmd/issues">creating an issue</a> in Github Repo.
            </p>
        </div>
    </div>;
}

export default WhatsNewResultView;
