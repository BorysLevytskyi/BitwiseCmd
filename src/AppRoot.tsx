import React from 'react';
import InputBox from './components/InputBox';
import DisplayResultView from './components/DisplayResultView';
import AppState from './core/AppState';
import cmd from './core/cmd';
import CommandResult from './models/CommandResult';
import log from 'loglevel';
import Indicators from './components/Indicators';

type AppRootProps = {
    appState: AppState,    
};

type AppRootState = {
    uiTheme: string,
    emphasizeBytes: boolean,
    commandResults: CommandResult[]
}

export default class AppRoot extends React.Component<AppRootProps, AppRootState> {
    
    componentWillMount() {
        this.refresh();
        this.props.appState.onChange(() => this.refresh());
    }

    refresh() {
        this.setState(this.props.appState);
    }
    
    getIndicator(value : boolean) {
        return value ? 'on' : 'off';
    }

    getResultViews() : JSX.Element[] {
        log.debug('getting result views')
        var results = this.state.commandResults.map((r, i) => <DisplayResultView key={i} content={r} input={r.input} inputHash={r.inputHash} appState={this.props.appState} />);
        return results;
    }

    toggleEmphasizeBytes() {
        this.props.appState.toggleEmphasizeBytes();
    }

    render() {
        return <div className={`app-root ${this.state.uiTheme}`}>
                    <Indicators appState={this.props.appState} />
                    <div className="header">
                        <h1>Bitwise<span className="header-cmd">Cmd</span>
                        </h1>
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
                        <InputBox onCommandEntered={(input) => cmd.execute(input)} />

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