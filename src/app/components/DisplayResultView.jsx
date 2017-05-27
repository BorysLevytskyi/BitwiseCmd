import React from 'react';
import HelpResult from '../models/HelpResult';
import AboutResult from '../models/AboutResult';
import UnknownCommandResult from '../models/UnknownCommandResult';
import HelpResultView from './results/HelpResultView';
import AboutResultView from './results/AboutResultView';
import ExpressionResult from '../models/ExpressionResult';
import ExpressionResultView from './results/ExpressionResultView';
import WhatsnewResult from '../models/WhatsnewResult';
import WhatsnewResultView from './results/WhatsnewResultView';
import ErrorResult from '../models/ErrorResult';
import * as expression from '../expression';

export default class DisplayResult extends React.Component {
    render() {

        return <div className="result">
                        <div className="input mono"><span className="cur">&gt;</span>{this.props.content.input}<a className="hashLink" title="Link for this expression" href={window.location.pathname + '#' + this.props.inputHash}>#</a></div>
                        <div className="content">
                            {this.findResultComponent(this.props.content)}
                        </div>
                    </div>;
    }

    findResultComponent(result) {
        if(result instanceof HelpResult) {
            return <HelpResultView content={result} />
        }

        if(result instanceof AboutResult) {
            return <AboutResultView />
        }

        if(result instanceof ExpressionResult) {
            return <ExpressionResultView result={result} emphasizeBytes={this.props.appState.emphasizeBytes} /> 
        }

        if(result instanceof WhatsnewResult) {
            return <WhatsnewResultView />
        }

        if (result instanceof ErrorResult) {
            return <div className="result">
                    <div className="error">(X_X) Ooops.. Something ain' right: <strong>{result.error.message}</strong></div>
               </div>
        }

        return <div className="result">
                    <div className="error">¯\_(ツ)_/¯ Sorry, i don&prime;t know what <strong>{this.props.input}</strong> is</div>
               </div>
    }
}