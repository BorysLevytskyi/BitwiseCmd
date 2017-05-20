import React from 'react';
import cmd from '../../cmd';
import CommandLink from '../misc/CommandLink';

export default class HelpResultView extends React.Component {
    render() {
        return <div className="help helpResultTpl">
                        <div style={{overflow: "hidden"}}>
                            <div style={{float: "left", "marginRight": "20px"}}>
                                <div className="section">
                                    <strong>Supported Commands</strong>
                                <ul>
                                    <li><code><CommandLink text="23 | 34" /></code> — type bitwise expression to see result in binary (only positive integers are supported now)</li>
                                    <li><code><CommandLink text="23 34" /></code> — type one or more numbers to see their binary representations</li>
                                    <li><code><CommandLink text="clear" /></code> — clear output pane</li>
                                    <li><code><CommandLink text="help" /></code> — display this help</li>
                                    <li><code><CommandLink text="whatsnew" /></code> — display changelog</li>
                                    <li><code><CommandLink text="em" /></code> — turn On/Off Emphasize Bytes</li>
                                    <li><code><CommandLink text="light" /></code> — set Dark theme</li>
                                    <li><code><CommandLink text="dark" /></code> — set Light theme</li>
                                    <li><code><CommandLink text="midnight" /></code> — set Midnight theme</li>
                                    <li><code><CommandLink text="about" /></code> — about the app</li>
                                </ul>
                                </div>
                            </div>
                            <div style={{"float":"left"}}>
                                <div className="section">
                                    <strong>Supported Bitwise Operations</strong><br/>
                                    <small>
                                        <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators">
                                            as implemented in JavaScript engine
                                        </a>
                                    </small>
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
                          </div>
                     </div>
                 </div>;
    }
}