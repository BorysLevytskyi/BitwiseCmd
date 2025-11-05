import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import cmd from '../../shell/cmd';
import './CommandLink.css';

type CommandLinkProps = {
    command?:string;
    text:string;
    textClassName?: string
    icon?: IconDefinition
}

function CommandLink({icon, command, text, textClassName}: CommandLinkProps) {

    const onClick = () => cmd.execute(command ?? text);

    return (
        <button type="button" className="command-link" onClick={onClick}>
            {icon ? <FontAwesomeIcon icon={icon} className="icon" /> : null}
            <span className={textClassName}>{text}</span>
        </button>
    );
}

export default CommandLink;