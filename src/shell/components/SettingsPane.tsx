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
                    <FontAwesomeIcon size='xl' icon={appState.emphasizeBytes ? faToggleOn : faToggleOff} /> Emphasize Bytes
                </button>
                <p className='description'>
                    {appState.emphasizeBytes 
                        ? "Binary strings are padded with extra bits to have a length that is multiple of 8." 
                        : "Binary strings are not padded with extra bits."} 
                </p>
            </div>
            <div className='setting'>
                <button onClick={() => appState.toggleDimExtrBits()}>
                    <FontAwesomeIcon size='xl' icon={appState.dimExtraBits ? faToggleOn : faToggleOff} /> Dim Extra Bits
                </button>
                <p className='description'>
                    {appState.dimExtraBits 
                        ? "Extra bits used for padding are now dimmed." 
                        : "No bits are dimmed."} 
                </p>
            </div>
            <div className='setting'>
                <button onClick={() => appState.toggleAnnotateTypes()}>
                    <FontAwesomeIcon size='xl' icon={appState.annotateTypes ? faToggleOn : faToggleOff} /> Annotate Data Types
                </button>
                <p className='description'>
                    {appState.annotateTypes 
                        ? "Binary are displayed as they are stored in memory. Integer size is shown." 
                        : "Information about the size of integers is hidden."} 
                </p>
            </div>
        </div>
    </div>
}

export default SettingsPane;