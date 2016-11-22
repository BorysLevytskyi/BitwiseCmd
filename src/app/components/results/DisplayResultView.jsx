import React from 'react';
import HelpResult from '../../models/HelpResult';
import HelpResultView from './HelpResultView';
import ExpressionResult from '../../models/ExpressionResult';
import ExpressionResultView from './ExpressionResultView';

export default class DisplayResult extends React.Component {
    render() {
        return <div className="result">
                        <div className="input mono"><span className="cur">&gt;</span>{this.props.content.input}<a className="hashLink" title="Link for this expression" href={window.location.pathname + '#' + this.props.inputHash}>#</a></div>
                        <div className="content">
                            {this.findResultComponent(this.props.content)}
                        </div>
                    </div>;
    }

    findResultComponent(result, key) {
        if(result instanceof HelpResult) {
            return <HelpResultView key={key} content={result} />
        }

        if(result instanceof ExpressionResult) {
            return <ExpressionResultView key={key} result={result} /> 
        }

        console.warn('Unknow result', result);
        return <span>Unknown result {typeof result}</span>
    }
}