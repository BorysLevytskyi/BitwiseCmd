import is from '../core/is';
import log from 'loglevel';

export type CommandInput = {
    input: string;
    options: CommandOptions
}

export type CommandOptions = {
    doNotTrack: boolean;
}

type HandleFunction = (input: CommandInput) => void;
type InputErrorHandler = (input:string, error: Error) => void;

const DEFUALT_COMMAND_OPTIONS : CommandOptions = {
    doNotTrack: false
};

export interface ICommandHandler {
    canHandle (input:string) : boolean;
    handle: HandleFunction;
}

export class CmdShell {
    debugMode: boolean;
    handlers: ICommandHandler[];
    errorHandler: InputErrorHandler | null; 
    constructor() {
        this.handlers = [];
        this.debugMode = false;
        this.errorHandler = null;
    };

    execute (rawInput: string, ops?: CommandOptions ) {

        log.debug(`Executing command: ${rawInput}`);

        ops = ops || Object.assign({}, DEFUALT_COMMAND_OPTIONS);

        var input = rawInput.trim().toLowerCase();
        var handler = this.findHandler(input);

        if(handler != null) {
            if(this.debugMode) {
                this.invokeHandler(input, handler, ops);
            } else {
                try {
                    this.invokeHandler(input, handler, ops);
                } catch (e) {
                     this.handleError(input, e as Error);
                }
            }
        }
        else {
            log.debug(`Handled is not found for command: ${rawInput}`)
            this.handleError(input, new Error("Unsupported expression: " + input.trim()));
        }
    };

    onError(h: InputErrorHandler) {
        this.errorHandler = h;
    }
   
    command (cmd : string | object, handler? : any) {
        var h = this.createHandler(cmd, handler);
        if(h == null){
            console.warn('unexpected set of arguments: ', JSON.stringify(arguments));
            return;
        }

        if(!is.aFunction(h.canHandle)) {
            console.warn('handler is missing "canHandle" function. registration denied.');
            return;
        }

        if(!is.aFunction(h.handle)) {
            console.warn('handler is missing "handle" function. registration denied.');
            return;
        }

        this.handlers.push(h);
    };

    createHandler (cmd : string | object, handler : HandleFunction) : ICommandHandler | null {
        if(is.plainObject(cmd)) {
            return cmd as ICommandHandler;
        }

        if(is.string(cmd)) {
            return { canHandle: function (input) { return input === cmd; }, handle: handler };
        }

        return null;
    }

    findHandler (input: string) : ICommandHandler | null {
        return this.handlers.filter(h => h.canHandle(input))[0];
    };

    invokeHandler (input : string, handler : ICommandHandler, options: CommandOptions) {

        var cmdResult = handler.handle({ input: input, options });
        if(cmdResult != null) {
            log.debug(cmdResult);
        }
    };

    handleError (input: string, err: Error) {
        if(this.debugMode)
            console.error(input, err);

        if(this.errorHandler != null)
            this.errorHandler(input, err);
    }
}

export default new CmdShell();