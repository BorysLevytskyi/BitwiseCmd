import React from 'react';
import cmd from '../core/cmd';

type CommandLinkProps = {
    command?:string;
    text:string;
}

function CommandLink(props: CommandLinkProps) {
    return <a href="javascript:void(0)" onClick={e => cmd.execute(props.command || props.text)}>{props.text}</a>
}

export default CommandLink;