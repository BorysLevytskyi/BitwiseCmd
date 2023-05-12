import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SettingsPane.css';
import { faClose, faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { type } from 'os';
import AppState from '../AppState';

type SettingsPaneProps = {
    appState : AppState
}

function SettingsPane(props : SettingsPaneProps) {

    const {appState} = props;    

    return <div id="settings" className='settings-container'>
        <div className="inner">
            <h3>Settings</h3>
            <div className='setting'>
                <button onClick={() => appState.toggleEmphasizeBytes()}>
                    <FontAwesomeIcon icon={appState.emphasizeBytes ? faToggleOn : faToggleOff} /> Emphasize Bytes
                </button>
                <p className='description'>
                    {appState.emphasizeBytes ? 
                        "Each binary string is extended to contain at least 8 bits. White space is be added between each group of 8 bits which signify a bytes so it is easier to tell them apart." 
                        : "Binary strings are not modified."} 
                </p>
            </div>
            <div className='setting'>
                <button onClick={() => appState.toggleAnnotateTypes()}>
                    <FontAwesomeIcon icon={appState.annotateTypes ? faToggleOn : faToggleOff} /> Annotate Data Types
                </button>
                <p className='description'>
                    {appState.annotateTypes 
                        ? "BitwiseCmd shows the integer size as well as indication whether the data type is signed or not. BitwiseCmd also allows to flip between signed/usigned versions of certain values preserving their binary representation." 
                        : "Infomration about size of integers used in calculation is hidden."} 
                </p>
            </div>
           
        </div>
    </div>
}

export default SettingsPane;