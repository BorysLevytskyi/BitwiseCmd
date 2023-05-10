import { faTrashAlt, faHashtag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import AppState from '../AppState';


type DisplayResultProps = {
    appState: AppState,
    inputHash: string,
    input: string,
    resultKey: number,
    resultIndex: number,
    onRemove?: (i: number) => void,
    children: JSX.Element
}

const DisplayResultView: React.FunctionComponent<DisplayResultProps> = (props) => {

        const resultKey : number = props.resultKey;
        const appState = props.appState;

        return <div className="result">
                        <div className="input mono">
                                <span className="cur">&gt;</span>
                                <span className="input-string">{props.input}</span>
                                    <a className="hashLink" title="Link for this expression" href={window.location.pathname + '#' + props.inputHash}>
                                        <FontAwesomeIcon className="icon" icon={faHashtag} size="xs" />
                                    </a>
                                    <button className="hashLink" title="Remove this result" onClick={() => appState.removeResult(props.resultIndex)}>
                                        <FontAwesomeIcon className="icon" icon={faTrashAlt} size="xs" />
                                    </button>
                            </div>
                        <div className="content">
                            {props.children}
                        </div>
                    </div>;
}

export default DisplayResultView;

