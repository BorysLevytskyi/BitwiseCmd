import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import cmd from '../../shell/cmd';

type CommandLinkProps = {
    command?:string;
    text:string;
    icon?: IconDefinition
}

function CommandLink({icon, command, text}: CommandLinkProps) {
    
    const onClick = () => cmd.execute(command || text);

    if(icon != null)
        return <a href="javascript:void(0)" onClick={onClick}><FontAwesomeIcon icon={icon} className="icon" />{text}</a>;

    return <a href="javascript:void(0)" onClick={onClick}>{text}</a>;
}

export default CommandLink;