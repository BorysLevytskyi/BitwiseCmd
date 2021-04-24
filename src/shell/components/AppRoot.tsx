import React from 'react';
import InputBox from './InputBox';
import DisplayResultView from './DisplayResultView';
import AppState, { CommandResultView } from '../AppState';
import cmd from '../cmd';
import log from 'loglevel';
import DebugIndicators from './DebugIndicators';
import hash from '../../core/hash';
import TopLinks from './TopLinks';
import Toggle from './Toggle';


type AppRootProps = {
    appState: AppState,    
};

type AppRootState = {
    uiTheme: string,
    emphasizeBytes: boolean,
    commandResults: CommandResultView[]
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

        var results = this.state.commandResults.map((r, i) => 
            <DisplayResultView resultIndex={i} resultKey={r.key} key={r.key} input={r.input} inputHash={hash.encodeHash(r.input)} appState={this.props.appState}>
                {r.view}
            </DisplayResultView>);
        return results;
    }

    toggleEmphasizeBytes() {
        this.props.appState.toggleEmphasizeBytes();
    }

    render() {
        return <div className={`app-root ${this.state.uiTheme}`}>
                    <DebugIndicators appState={this.props.appState} />
                    <div className="header">
                        <h1>Bitwise<span className="header-cmd">Cmd</span>
                        </h1>
                       <TopLinks />
                    </div>

                    <div className="expressionInput-container">
                        <InputBox onCommandEntered={(input) => cmd.execute(input)} />

                        <span className="configPnl">
                            <Toggle elementId="emphasizeBytes" text="[em]" isOn={this.state.emphasizeBytes} onClick={() => this.toggleEmphasizeBytes()} title="Toggle Emphasize Bytes"  />                            
                        </span>
                    </div>

                    <div id="output">
                    {this.getResultViews()}
                    </div>
                </div>;
    }
}