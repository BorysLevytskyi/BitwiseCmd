import React from 'react'
import CommandLink from '../misc/CommandLink'

export default class WhatsnewResultView extends React.Component {
    render() {
        return <div className="changelog">
                    <h3>BitwiseCmd Changelog</h3>    
                    <div className="item">
                        <p><span className="soft">May 20th, 2017</span> New <CommandLink text="Midnight" /> theme added. </p>
                    </div>  
                    <div className="item">
                        <p><span className="soft">May 16th, 2017</span> Complete rewrite using React. Old implementation is available at <a href="http://bitwisecmd.com/old">http://bitwisecmd.com/old</a>.</p>
                        <p>Please let me know if you have problems with this release by <a href="https://github.com/BorysLevytskyi/BitwiseCmd/issues">creating issue</a> in Github Repo.</p>
                    </div>  
              </div>;
    }
}