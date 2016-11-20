import React from 'react';
import cmd from '../cmd';

export default class InputBox extends React.Component {
    constructor() {
        super();
        this.history = [];
        this.historyIndex = 0;
    }

    render() {
        return <input type="text"
                      onKeyUp={e => this.onKeyUp(e)}
                      onKeyDown={e => this.onKeyDown(e)}
                      className="expressionInput mono"
                      placeholder="type expression like '1>>2' or 'help' "/>;
    }

    onKeyUp(e) {
        var input = e.target;
        if (e.keyCode != 13 || input.value.trim().length == 0) {
            return;
        }

        var value = input.value;
        this.history.unshift(value);

        input.value = '';        
        cmd.execute(value);
    }

    onKeyDown(args) {
        if(args.keyCode == 38) {

            if (this.history.length > this.historyIndex) { // up
                args.target.value = this.history[this.historyIndex++];
            }

            args.preventDefault();
            return;
        }

        if(args.keyCode == 40) {

            if(this.historyIndex > 0) { // up
                args.target.value = this.history[--this.historyIndex];
            }

            args.preventDefault();
        }
    }
}