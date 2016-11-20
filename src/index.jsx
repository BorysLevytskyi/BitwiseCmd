import React from 'react';
import ReactDOM from 'react-dom';

var rootView = <div>
                    <div className="header">
                        <h1>Bitwise<span style={{color: "#c5c5c5"}}>Cmd</span></h1>

                        <ul className="top-links">
                            <li>
                                <a href="https://github.com/BorisLevitskiy/BitwiseCmd"><i className="icon github">&nbsp;</i><span className="link-text">Project on GitHub</span></a>
                            </li>
                            <li>
                                <a href="https://twitter.com/BitwiseCmd"><i className="icon twitter">&nbsp;</i><span className="link-text">Twitter</span></a>
                            </li>
                            <li>
                                <a href="mailto:&#098;&#105;&#116;&#119;&#105;&#115;&#101;&#099;&#109;&#100;&#064;&#103;&#109;&#097;&#105;&#108;&#046;&#099;&#111;&#109;?subject=Feedback"><i className="icon feedback">&nbsp;</i><span className="link-text">Send Feedback</span></a>
                            </li>
                        </ul>
                    </div>

                    <div className="expressionInput-container">
                        <input id="in" type="text" className="expressionInput mono" placeholder="type expression like '1>>2' or 'help' "/>

                        <span className="configPnl">
                             <span id="emphasizeBytes" data-cmd="em" className="indicator on" title="Emphasize Bytes">[em]</span>
                        </span>
                    </div>

    <div id="output">
    </div>

</div>;


ReactDOM.render(rootView, document.getElementById('root'));