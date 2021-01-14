import React from 'react';
import HelpResult from '../models/HelpResult';
import AboutResult from '../models/AboutResult';
import HelpResultView from './results/HelpResultView';
import AboutResultView from './results/AboutResultView';
import ExpressionResult from '../models/ExpressionResult';
import BitwiseOperationExpressionView from './results/expressions/BitwiseOperationExpressionView';
import WhatsnewResult from '../models/WhatsnewResult';
import WhatsnewResultView from './results/WhatsNewResultView';
import {UnhandledErrorResult, ErrorResult} from '../models/ErrorResults';
import StringResult from '../models/StringResult';
import IpAddressView from './results/IpAddressView';

import CommandResult from '../models/CommandResult';
import AppState from '../core/AppState';
import IpAddressResult from '../models/IpAddressResult';

type DisplayResultProps = {
    content : CommandResult,
    appState: AppState,
    inputHash: string,
    input: string,
    key: number
}

export default class DisplayResult extends React.Component<DisplayResultProps> {
    render() {

        return <div className="result">
                        <div className="input mono"><span className="cur">&gt;</span>{this.props.content.input}<a className="hashLink" title="Link for this expression" href={window.location.pathname + '#' + this.props.inputHash}>#</a></div>
                        <div className="content">
                            {this.findResultComponent(this.props.content)}
                        </div>
                    </div>;
    }

    findResultComponent(result: CommandResult) : JSX.Element  {

        if(result instanceof HelpResult) {
            return <HelpResultView  />
        }

        if(result instanceof AboutResult) {
            return <AboutResultView />
        }

        if(result instanceof ExpressionResult) {
            return <BitwiseOperationExpressionView expression={result.expression} emphasizeBytes={this.props.appState.emphasizeBytes} /> 
        }

        if(result instanceof WhatsnewResult) {
            return <WhatsnewResultView />
        }

        if(result instanceof StringResult) {
            return <p>{result.value}</p>
        }

        if (result instanceof UnhandledErrorResult) {
            return <div className="result">
                    <div className="error">(X_X) Ooops.. Something ain' right: <strong>{result.error.message}</strong></div>
               </div>
        }

        if (result instanceof ErrorResult) {
            return <div className="result">
                    <div className="error">{result.errorMessage}</div>
               </div>
        }

        if(result instanceof IpAddressResult) {
            const ipResult = result as IpAddressResult;

            return <IpAddressView ipAddresses={ipResult.ipAddresses} />
        }

        return <div className="result">
                    <div className="error">¯\_(ツ)_/¯ Sorry, i don&prime;t know what <strong>{this.props.content.input}</strong> is</div>
               </div>
    }
}