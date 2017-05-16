import React from 'react';
import HelpResult from '../../models/HelpResult';
import AboutResult from '../../models/AboutResult';
import UnknownCommandResult from '../../models/UnknownCommandResult';
import HelpResultView from './HelpResultView';
import AboutResultView from './AboutResultView';
import ExpressionResult from '../../models/ExpressionResult';
import ExpressionResultView from './ExpressionResultView';
import ErrorResult from '../../models/ErrorResult';

export default class DisplayResult extends React.Component {
    render() {

        if(this.props.content instanceof UnknownCommandResult) {
            return this.renderUnknown();            
        }

        if(this.props.content instanceof ErrorResult) {
            return this.renderError(this.props.content.error.message);
        }

        return <div className="result">
                        <div className="input mono"><span className="cur">&gt;</span>{this.props.content.input}<a className="hashLink" title="Link for this expression" href={window.location.pathname + '#' + this.props.inputHash}>#</a></div>
                        <div className="content">
                            {this.findResultComponent(this.props.content)}
                        </div>
                    </div>;
    }

    renderUnknown() {
        return <div className="result">
                    <div className="error">¯\_(ツ)_/¯ Sorry, i don't know what <strong>{this.props.input}</strong> is</div>
               </div>
    }

    renderError(message) {
        return <div className="result">
                    <div className="error">(X_X) Error occurred: <strong>{message}</strong></div>
               </div>
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

        console.warn('Unknown result:', result);
        return <span>Unknown result: {typeof result}</span>
    }
}