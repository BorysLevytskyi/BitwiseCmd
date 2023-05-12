import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SettingsPane.css';
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
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
                    {appState.emphasizeBytes ? "This setting is on" : "This settings is of"} 
                </p>
            </div>
            <div className='setting'>
                <button onClick={() => appState.toggleAnnotateTypes()}>
                    <FontAwesomeIcon icon={appState.annotateTypes ? faToggleOn : faToggleOff} /> Annotate Data Types
                </button>
                <p className='description'>
                    {appState.annotateTypes ? "Bit size is shown next to each number" : "Do not show what data types BitwiseCmd uses to represent every nubmer in the results section"} 
                </p>
            </div>
        </div>
    </div>
}

export default SettingsPane;