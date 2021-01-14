import React from 'react';
import AppState from '../core/AppState';


type DisplayResultProps = {
    appState: AppState,
    inputHash: string,
    input: string,
    key: number
}

export default class DisplayResult extends React.Component<DisplayResultProps> {
    render() {

        return <div className="result">
                        <div className="input mono"><span className="cur">&gt;</span>{this.props.input}<a className="hashLink" title="Link for this expression" href={window.location.pathname + '#' + this.props.inputHash}>#</a></div>
                        <div className="content">
                            {this.props.children}
                        </div>
                    </div>;
    }
}

