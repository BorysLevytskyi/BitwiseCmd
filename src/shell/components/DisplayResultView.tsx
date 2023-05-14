import { faTrashAlt, faHashtag, faLink, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import AppState from '../AppState';
import loglevel from 'loglevel';


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

        const appState = props.appState;
        const link = window.location.origin + window.location.pathname + '#' + props.inputHash;
        const [copied, setCopied] = useState(false);
        const copiedText = copied ? 'copied' : '';

        async function copyLink(e: any) {
            try {
                await navigator.clipboard.writeText(link);
                setCopied(true);
                setTimeout(() => setCopied(false), 1000);
                return false;
              } catch (err) {
                loglevel.debug(err);
                return true;
              }
        }

        return <div className="result">
                        <div className="input mono">
                                <span className="cur">&gt;</span>
                                <span className="input-string">{props.input}</span>
                                    <a className="hashLink" title="Copy link for this expression" onClick={async (e) => {return await copyLink(e)}} href={link}>
                                        <FontAwesomeIcon className="icon" icon={copied ? faCheck : faLink} size="xs" />
                                    </a>
                                    <span className='soft hashLink'>{copiedText}</span>
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

