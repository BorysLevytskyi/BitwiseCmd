import React from 'react';
import CommandLink from '../../core/components/CommandLink';
import './HelpResultView.css';
import { INT32_MAX_VALUE, INT32_MIN_VALUE } from '../../core/const';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

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
                        <li><code><CommandLink text="127.0.0.1" /></code> — enter single or multiple IP addresses (separated by space) to see their binary representation</li>
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
                    <div className="section-title soft">Supported Operations</div>
                    <ul>
                        <li><code>&amp;</code> — bitwise AND</li>
                        <li><code>|</code> — bitwise inclusive OR</li>
                        <li><code>^</code> — bitwise exclusive XOR</li>
                        <li><code>~</code> — bitwise NOT</li>
                        <li><code>&lt;&lt;</code> — left shift</li>
                        <li><code>&gt;&gt;</code> — sign propagating right shift</li>
                        <li><code>&gt;&gt;&gt;</code> — zero-fill right shift</li>
                    </ul>                    
                    <ul>
                        <li><code>+</code> — addition</li>
                        <li><code>-</code> — subtraction</li>
                        <li><code>*</code> — multiplication</li>
                        <li><code>/</code> — division (truncates toward zero*)</li>
                    </ul>
                    <div className='important-note'>
                        <FontAwesomeIcon icon={faCircleExclamation} size='lg'/> <a target='_blank' href='https://en.cppreference.com/w/c/language/operator_precedence' rel="noreferrer">Operator precedence</a> is IGNORED. Operators are executed <strong>left-to-right</strong>.
                    </div>
                    <p className='description'>
                        * “Truncates toward zero” means the fractional part is discarded and the quotient is rounded toward 0.
                        For example: <code>7/2 = 3</code>, <code>-7/2 = -3</code>.
                        Learn more:
                        <a target='_blank' rel='noreferrer' href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Division#bigint_division'> JS BigInt division</a>,
                        <a target='_blank' rel='noreferrer' href='https://en.cppreference.com/w/c/language/operator_arithmetic#Integer_arithmetic'> C integer division</a>.
                    </p>
                </div>
                <div className="section soft-border">
                    <div className="section-title soft">Supported Number Types</div>
                    <p>
                    BitiwseCmd no longer uses the browser's JavaScript engine for the execution of bitwise operations. It has its own calculator implementation which brings supports bitwise operations on the following <i>signed</i> and <i>unsigned</i> data types:
                    </p>
                    <ul>
                        <li><code>8-bit integer</code> - a.k.a Byte. Numbers entered with <code>b</code> or <code>ub</code> suffixes for signed and unsigned versions respectively (e.g. <CommandLink text='10b 10ub' />).</li>
                        <li><code>16-bit integer</code> - a.k.a Short. Numbers entered with <code>s</code> or <code>us</code> suffixes for signed and unsigned versions respectively (e.g. <CommandLink text='10s 10us' />).</li>
                        <li><code>32-bit integer</code> - numbers entered without suffixes that fall in range of {INT32_MIN_VALUE} and {INT32_MAX_VALUE}. Use <code>u</code> suffix to denote an unsigned version of 32-bit integer. This is a default number type.</li>
                        <li><code>64-bit integer</code> - a.k.a Long. Numbers entered without suffixes and exceed the 32-bit range or entered with <code>l</code> and <code>ul</code> suffixes for signed and unsigned versions respectively (e.g. <CommandLink text='10l 10ul' />).</li>
                    </ul>
                </div>
                <div className="section">
                    <strong className="section-title  soft">Tip</strong>
                    <p>
                        You can click on bits to flip them in number inputs (e.g. <CommandLink text="2 4" />) or IP addresses (e.g. <CommandLink text="192.168.0.0/8" />).
                    </p>
                </div>
            </div>
        </div>
    </div>;
}

export default HelpResultView;

