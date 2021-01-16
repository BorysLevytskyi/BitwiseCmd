import AppState from "../AppState";
import React from "react";
import './DebugIndicators.css';

function DebugIndicators(props:  {appState: AppState}) {

    const list = [];
    const state = props.appState;

    if(props.appState.env != 'prod') {
        list.push(state.env);
    }

    if(props.appState.debugMode) {
        list.push("debug");
    }

    if(localStorage.getItem('TrackAnalytics') === 'false') {
        list.push("notrack");
    }

    if(list.length == 0)
        return null;

    return <div className="debug-indicators">
            {list.map(i => <span title={i}>[{i.substring(0,1)}]&nbsp;</span>)}
        </div>
}

export default DebugIndicators;