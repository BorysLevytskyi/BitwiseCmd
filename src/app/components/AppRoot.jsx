import React from 'react';
import InputBox from './InputBox';
import DisplayResultView from './results/DisplayResultView';

export default class AppRoot extends React.Component {
    componentWillMount() {
        this.refresh();
        this.props.appState.onChange(() => this.refresh());
    }
    refresh() {
        this.setState(this.props.appState);
    }
    
    getIndicator(value) {
        if(value) { 
            return "on";
        }

        return "off";
    }

    getResultViews() {
        var results = this.state.commandResults.map((r, i) => <DisplayResultView key={i} content={r} input={r.input} inputHash={r.inputHash} appState={this.props.appState} />);
        return results;
    }

    toggleEmphasizeBytes() {
        console.log(this.props.appState);
        this.props.appState.toggleEmphasizeBytes();
    }

    render() {
        return <div className={`app-root ${this.state.uiTheme}`}>
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
                        <InputBox />

                        <span className="configPnl">
                            <span id="emphasizeBytes" data-cmd="em" className={"indicator " + this.getIndicator(this.state.emphasizeBytes)} title="Toggle Emphasize Bytes" onClick={e => this.toggleEmphasizeBytes()}>[em]</span>
                        </span>
                    </div>

                    <div id="output">
                    {this.getResultViews()}
                    </div>
                </div>;
    }
}