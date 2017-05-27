import React from 'react';
import cmd from '../cmd';

export default class InputBox extends React.Component {
    constructor() {
        super();
        this.history = [];
        this.historyIndex = -1;
    }

    componentDidMount(){
        this.nameInput.focus();
    }

    render() {
        return <input id="in" type="text"
                      ref={(input) => { this.nameInput = input; }} 
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
        this.historyIndex = -1;

        input.value = '';        
        cmd.execute(value);
    }

    onKeyDown(args) {

        if(args.keyCode == 38) {
            var newIndex = this.historyIndex+1;

            if (this.history.length > newIndex) { // up
                args.target.value = this.history[newIndex];
                this.historyIndex = newIndex;
            }

            args.preventDefault();
            return;
        }

        if(args.keyCode == 40) {
            if(this.historyIndex > 0) { // down
                args.target.value = this.history[--this.historyIndex];
            }

            args.preventDefault();
        }
    }
}