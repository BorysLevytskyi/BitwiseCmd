import AppState from "./AppState";
import { CmdShell } from "./cmd";

export type Env = 'prod' | 'stage';

export type AppModule = {
    setup: (appState: AppState, cmd: CmdShell) => void;
};