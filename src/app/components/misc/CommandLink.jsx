import React from 'react';
import cmd from '../../cmd';

export default class CommandLink extends React.Component {
    render() {
        return <a href="javascript:void(0)" onClick={e => cmd.execute(this.props.command || this.props.text)}>{this.props.text}</a>
    }
}