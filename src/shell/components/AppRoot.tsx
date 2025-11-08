import React, { MouseEventHandler } from 'react';
import InputBox from './InputBox';
import DisplayResultView from './DisplayResultView';
import AppState, { CommandResultView } from '../AppState';
import cmd from '../cmd';
import DebugIndicators from './DebugIndicators';
import hash from '../../core/hash';
import TopLinks from './TopLinks';
import SettingsPane from './SettingsPane';
import CommandLink from '../../core/components/CommandLink';
import { faGear, faL, faPersonRunning } from '@fortawesome/free-solid-svg-icons';
import CookieDisclaimerFooter from './CookieDisclaimerFooter';
import bladerunner from '../Bladerunner';


type AppRootProps = {
    appState: AppState,    
};

type AppRootState = {
    uiTheme: string,
    emphasizeBytes: boolean,
    commandResults: CommandResultView[],
    centeredLayout: boolean
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

    componentDidMount(): void {
        bladerunner.start(this.props.appState);
    }

    render() {

        const enableNewUi = this.props.appState.env !== 'prod' || true;
        const newUi = enableNewUi ? 'new-ui' : '';
        const settingsCss = "settings-button" + (this.props.appState.showSettings ? '' : ' soft');

        const layoutClass = this.state.centeredLayout ? 'layout-centered' : 'layout-stretched';
        return <div className={`app-root ${this.state.uiTheme} ${newUi} ${layoutClass}`}>
                    <div className="header-pane">
                        <DebugIndicators appState={this.props.appState} />
                        <div className="header">
                            <h1 onClick={() => bladerunner.toggleLights()}>
                                Bitwise<span className="header-cmd">Cmd</span>
                            </h1>
                        <TopLinks />
                        </div>

                        <div className="expressionInput-container">
                            <InputBox onCommandEntered={(input) => cmd.execute(input)} />
                            
                            <span className={settingsCss}>
                                <CommandLink text="" command='settings' icon={faGear} />
                            </span>

                        </div>
                    </div>
                    <div className="content-pane">
                        {this.props.appState.showSettings ? <SettingsPane appState={this.props.appState} /> : null}
                            <div id="output">
                            {this.getResultViews()}
                            </div>
                    </div>
                    <CookieDisclaimerFooter appState={this.props.appState} />
                    <div className="bladerunner-easter-egg">
                        <CommandLink text="" command='bladerunner-easter' icon={faPersonRunning} />
                    </div>
                </div>;
    }
}


