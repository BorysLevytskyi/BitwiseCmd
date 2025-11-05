import React from 'react';
import InputBox from './InputBox';
import DisplayResultView from './DisplayResultView';
import AppState, { CommandResultView } from '../AppState';
import cmd from '../cmd';
import DebugIndicators from './DebugIndicators';
import hash from '../../core/hash';
import TopLinks from './TopLinks';
import SettingsPane from './SettingsPane';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import CookieDisclaimerFooter from './CookieDisclaimerFooter';


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
                {r.view()}
            </DisplayResultView>);
        return results;
    }

    render() {

        const enableNewUi = this.props.appState.env !== 'prod' || true;
        const newUi = enableNewUi ? 'new-ui' : '';
        const settingsCss = "settings-button" + (this.props.appState.showSettings ? '' : ' soft');

        return <div className={`app-root ${this.state.uiTheme} ${newUi}`}>
                    <DebugIndicators appState={this.props.appState} />
                    <div className="header">
                        <h1>Bitwise<span className="header-cmd">Cmd</span>
                        </h1>
                       <TopLinks />
                    </div>

                    <div className="expressionInput-container">
                        <InputBox onCommandEntered={(input) => cmd.execute(input)} />
                        
                        <button className={settingsCss} title='Toggle Settings' type="button" onClick={() => this.props.appState.toggleShowSettings()}>
                            <FontAwesomeIcon icon={faGear} />
                        </button>

                    </div>
                    {this.props.appState.showSettings ? <SettingsPane appState={this.props.appState} /> : null}
                    <div id="output">
                    {this.getResultViews()}
                    </div>
                    <CookieDisclaimerFooter appSate={this.props.appState} />
                </div>;
    }
}