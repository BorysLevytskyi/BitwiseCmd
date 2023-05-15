import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SettingsPane.css';
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
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
                    <FontAwesomeIcon size='lg' icon={appState.emphasizeBytes ? faToggleOn : faToggleOff} /> Emphasize Bytes
                </button>
                <p className='description'>
                    {appState.emphasizeBytes 
                        ? "Each binary string is extended to contain at least 8 bits. A white space is added between each group of 8 bits so it easy to tell bytes apart." 
                        : "Binary strings are not modified."} 
                </p>
            </div>
            <div className='setting'>
                <button onClick={() => appState.toggleAnnotateTypes()}>
                    <FontAwesomeIcon size='lg' icon={appState.annotateTypes ? faToggleOn : faToggleOff} /> Annotate Data Types
                </button>
                <p className='description'>
                    {appState.annotateTypes 
                        ? "BitwiseCmd shows the integer size and indicates whether the data type is signed or unsigned." 
                        : "Information about the size of integers used in the calculation is hidden."} 
                </p>
            </div>
           
        </div>
    </div>
}

export default SettingsPane;