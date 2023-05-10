import React from 'react';
import CommandLink from '../../core/components/CommandLink';
import './WhatsNewResultView.css';

function WhatsnewResultView() {
    
        return <div className="changelog">
                    <h3>Changelog</h3>
                    <div className='item item-new'>
                    <p>
                            <span className="soft date">May 10th, 2023</span> <br/>
                            <p>
                                Behold! After a long time of inactivity, BitwiseCmd is getting an update. Here is what changed:
                            </p>
                            <ul>
                                <li>Browser's JavaScript engine is no longer used for the execution of bitwise operations. 
                                    BitwiseCmd has its own shiny custom-built bitwise calculator that supports operations integer of different sizes (8,16,32, and 64 bits) as well as their signed and unsigned versions. <CommandLink text='Check it out!' command='-1b 255ub -1 4294967295u -1l 18446744073709551615u' />. 
                                     This calculator tries to follow the same behavior of bitwise operations as implemented in C. 
                                     This includes shifting an integer by the number of bytes equal to its size (spoiler: you get the same number, this is undefined behavior in C. Don't believe me? Check this <a href="https://codeyarns.com/tech/2004-12-20-c-shift-operator-mayhem.html#gsc.tab=0">link</a>).</li>
                                <li>A slightly improved UI</li>
                            </ul>
                        </p>
                    </div>
                    <div className='item'>
                        <span className="soft date">May 5th, 2023</span> <br/>
                        <p>
                            Fixed <a href="https://github.com/BorysLevytskyi/BitwiseCmd/issues/13">bug</a> with incorrect binary representation of 64-bit numbers.
                        </p>
                    </div>
                    <div className="item">
                        <p><span className="soft date">Jul 24th, 2021</span> <br/>
                            <ul>
                                <li>Added support of <code>vpc</code> command to see how VPC network address is divided between VPC, Subnets, and Hosts. Try it out: <CommandLink text="vpc 192.168.24.1/24" /></li>
                                <li>Added ability to remove individual results</li>
                            </ul>
                        </p>                       
                    </div>
                    <div className="item">
                        <span className="soft date">Jun 16th, 2021</span>
                        <p>
                            Added support of <code>subnet</code> command to display information about subnet IP address such. Try it out: <CommandLink text="subnet 192.168.24.1/14" />
                        </p>                       
                    </div>
                    <div className="item">
                        <span className="soft date">Jun 14th, 2021</span>
                        <p>
                        Added support of IP addresses and subnet mask notations. Try them out: 
                        </p>
                        <ul>
                            <li>A single IP address <CommandLink text="127.0.0.1" /></li>
                            <li>Multiple IP addresses and subnet mask notations <CommandLink text="127.0.0.1 192.168.0.0/24" /></li>
                        </ul>
                        
                    </div>
                    <div className="item">
                        <span className="soft date">Jun 6th, 2017</span>
                        <p>
                        Added <code><CommandLink text="guid" /></code> command. Use it for generating v4 GUIDs </p>
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

export default WhatsnewResultView;