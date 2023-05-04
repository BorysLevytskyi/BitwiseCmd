
import React from "react";

export type ToggleProps = {
    text?: string,
    isOn: boolean,
    title: string,
    elementId?: string
    onClick: () => void,
    children?: React.ReactNode
};

const Toggle: React.FunctionComponent<ToggleProps> = (props) => {

    return <span id={props.elementId} 
        className={"indicator " + getIndicator(props.isOn)} 
        title={props.title} 
        onClick={() => props.onClick()}>
            { !props.children ? props.text : props.children }
        </span>
}

function getIndicator(value : boolean) {
    return value ? 'on' : 'off';
}

export default Toggle;