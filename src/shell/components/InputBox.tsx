import React from 'react';
import log from 'loglevel';

export interface IInputBoxProps
{
    onCommandEntered: (input :string) => void;
}

export default class InputBox extends React.Component<IInputBoxProps> {
    history: string[];
    historyIndex: number;
    nameInput:  HTMLInputElement | null;

    constructor(props: IInputBoxProps) {
        super(props);
        this.nameInput = null;
        this.history = [];
        this.historyIndex = -1;
    }

    componentDidMount(){
        if(this.nameInput != null)
            this.nameInput.focus();
    }

    render() {
        return <React.Fragment>
                <span className='input-p'>&gt;</span>
                <input id="in" type="text"
                      ref={(input) => { this.nameInput = input; }} 
                      onKeyUp={e => this.onKeyUp(e)}
                      onKeyDown={e => this.onKeyDown(e)}
                      className="expressionInput mono"
                      placeholder="type an expression like '1>>2' or 'help' "
                      autoComplete="off"/>
            </React.Fragment>
    }

    onKeyUp(e: any) {
        var input = e.target;
        if (e.keyCode != 13 || input.value.trim().length == 0) {
            return;
        }
        
        var commandInput = input.value;
        this.history.unshift(commandInput);
        this.historyIndex = -1;

        input.value = '';        
        this.props.onCommandEntered(commandInput);
    }

    onKeyDown(args: any) {

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