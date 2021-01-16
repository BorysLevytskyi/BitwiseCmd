import React from 'react';
import AppState from '../AppState';


type DisplayResultProps = {
    appState: AppState,
    inputHash: string,
    input: string,
    key: number,
    onRemove?: (i: number) => void;
}

export default class DisplayResultView extends React.Component<DisplayResultProps> {
    render() {

        return <div className="result">
                        <div className="input mono">
                                <span className="cur">
                                    &gt;</span>{this.props.input}
                                    <a className="hashLink" title="Link for this expression" href={window.location.pathname + '#' + this.props.inputHash}>#</a>
                                    &nbsp;
                                    <a className="hashLink" title="Remove this result" href="javascript:void(0)">[x]</a>
                            </div>
                        <div className="content">
                            {this.props.children}
                        </div>
                    </div>;
    }
}

