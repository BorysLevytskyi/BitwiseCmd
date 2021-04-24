
import React from "react";

export type ToggleProps = {
    text: string,
    isOn: boolean,
    title: string,
    elementId?: string
    onClick: () => void
};

function Toggle(props:  ToggleProps) {
    return <span id={props.elementId} 
        className={"indicator " + getIndicator(props.isOn)} 
        title={props.title} 
        onClick={() => props.onClick()}>{props.text}</span>
}

function getIndicator(value : boolean) {
    return value ? 'on' : 'off';
}

export default Toggle;