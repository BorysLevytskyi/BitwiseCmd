import React from 'react';
import CommandLink from '../../core/components/CommandLink';
import './HelpResultView.css';
import { INT32_MAX_VALUE, INT32_MIN_VALUE } from '../../core/const';

function HelpResultView() {

    return <div className="help helpResultTpl">
        <div className="panel-container">
            <div className="left-panel">
                <div className="section">
                    <div className="section-title soft">Bitwise Calculation Commands</div>
                    <ul>
                        <li><code><CommandLink text="23 | 34" /></code> — type bitwise expression to see the result in binary</li>
                        <li><code><CommandLink text="23 34" /></code> — type one or more numbers to see their binary representations</li>
                    </ul>                   
                </div>
                <div className="section">
                    <div className="section-title  soft">IP Address & Networking Commands</div>
                    <ul>
                        <li><code><CommandLink text="127.0.0.1" /></code> — enter a single or multiple IP addresses (separated by space) to see their binary representation</li>
                        <li><code><CommandLink text="192.168.0.1/8" /></code> — subnet mask notations are supported as well</li>
                        <li><code><CommandLink text="subnet 192.168.24.1/14" /></code> — display information about a subnet (network address, broadcast address, etc.)</li>
                        <li><code><CommandLink text="vpc 192.168.24.1/24" /></code> — see how VPC network address bits are divided between VPC address, Subnets, and Hosts</li>
                    </ul>
                </div>
                <div className="section">
                    <div className="section-title  soft">Color Theme Commands</div>
                    <ul>
                        <li><code><CommandLink text="light" /></code> — set the Light color theme</li>
                        <li><code><CommandLink text="dark" /></code> — set the Dark color theme</li>
                        <li><code><CommandLink text="midnight" /></code> — set the Midnight color theme</li>
                    </ul>
                </div>
                <div className="section">
                    <div className="section-title  soft">Other Commands</div>
                    <ul>
                        <li><code><CommandLink text="clear" /></code> — clear output pane</li>
                        <li><code><CommandLink text="help" /></code> — display this help</li>
                        <li><code><CommandLink text="whatsnew" /></code> — display changelog</li>
                        <li><code><CommandLink text="em" /></code> — turn On/Off Emphasize Bytes</li>
                        <li><code><CommandLink text="about" /></code> — about the app</li>
                        <li><code><CommandLink text="guid" /></code> — generate <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_.28random.29">v4</a> GUID</li>
                    </ul>
                </div>
            </div>
            <div className="right-panel">
                <div className="section">
                    <div className="section-title soft">Supported Bitwise Operations</div>
                    <ul>
                        <li><code>&amp;</code> — bitwise AND</li>
                        <li><code>|</code> — bitwise inclusive OR</li>
                        <li><code>^</code> — bitwise exclusive XOR</li>
                        <li><code>~</code> — bitwise NOT</li>
                        <li><code>&lt;&lt;</code> — left shift</li>
                        <li><code>&gt;&gt;</code> — sign propagating right shift</li>
                        <li><code>&gt;&gt;&gt;</code> — zero-fill right shift</li>
                    </ul>
                </div>
                <div className="section soft-border">
                    <div className="section-title soft">Supported Number Types <sup className='accent1'>NEW</sup></div>
                    <p>
                        BitiwseCmd no longer uses browser's JavaScript engine for execution of bitwise operations. It has it's own calculation engine which bring supports bitwise operations on the following <i>signed</i> and <i>unsigned</i> data types:
                    </p>
                    <ul>
                        <li><code>8-bit integer</code> - numbers entered with and <code>b</code> suffix (e.g. <CommandLink text='10b' />).</li>
                        <li><code>64-bit integer</code> - numbers entered with and <code>s</code> suffix (e.g. <CommandLink text='10s' />).</li>
                        <li><code>32-bit integer</code> - numbers beetween {INT32_MIN_VALUE} and {INT32_MAX_VALUE} entered without suffixes. This is a default number type.</li>
                        <li><code>64-bit integer</code> - numbers that exceed 32-bit range or entered with and <code>l</code> suffix (e.g. <CommandLink text='10l' />).</li>
                    </ul>
                </div>
                <div className="section">
                    <strong className="section-title  soft">Tip</strong>
                    <p>
                        You can click on bits to flip them in number inputs (e.g. <CommandLink text="2 4" />) or IP addresses (e.g. <CommandLink text="192.168.0.0/8" />)
                    </p>
                </div>
            </div>
        </div>
    </div>;
}

export default HelpResultView;
