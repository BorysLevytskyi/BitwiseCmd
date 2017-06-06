import React from 'react'
import CommandLink from '../misc/CommandLink'

export default class WhatsnewResultView extends React.Component {
    render() {
        return <div className="changelog">
                    <h3>Changelog</h3>
                    <div className="item item-new">
                        <p><span className="soft date">Jun 6th, 2017</span> <br/>
                        Added <code><CommandLink text="guid" /></code> command. Use it for generating v4 GUIDs </p>
                    </div>
                    <div className="item">
                        <p><span className="soft date">May 27th, 2017</span> <br/>
                        Added support of binary number notation (e.g. <code><CommandLink text="0b10101" /></code>). </p>
                    </div>  
                    <div className="item">
                        <p><span className="soft">May 20th, 2017</span> <br/>
                        New <CommandLink text="Midnight" /> theme added. </p>
                    </div>  
                    <div className="item">
                        <p><span className="soft">May 16th, 2017</span> <br/>
                        Complete rewrite using React. Old implementation is available at <a href="http://bitwisecmd.com/old">http://bitwisecmd.com/old</a>. Please let me know if you have problems with this release by <a href="https://github.com/BorysLevytskyi/BitwiseCmd/issues">creating issue</a> in Github Repo.</p>
                    </div>  
              </div>;
    }
}