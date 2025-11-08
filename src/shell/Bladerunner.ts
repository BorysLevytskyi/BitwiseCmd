import AppState from "./AppState";
import log from 'loglevel';

const LIGHTS_ON_KEY = 'lightsOn';
const LIGHTS_ON_CLASS = 'lights-on';

const turnLightsOff = (): void => (getHeader()).classList.remove('lights-on')
const getLightIsOn = () : boolean => localStorage.getItem(LIGHTS_ON_KEY) !== 'false';
const setLightIsOn = (value: boolean) => localStorage.setItem(LIGHTS_ON_KEY, value.toString());
const getHeader = (): HTMLHeadElement => document.querySelector('.header h1')!;

const toggleLights = (): void => {
    const header = getHeader();

    const lightIsOn = header.classList.contains(LIGHTS_ON_CLASS);

    setLightIsOn(!lightIsOn);

    if (lightIsOn)
        turnLightsOff();           
    else
        turnLightsOn();
        
};

const turnLightsOn = (): void => {
    const header = getHeader();
    header.classList.add(LIGHTS_ON_CLASS);
}

const startLightsIfWereOnAfterDelay = (): void => {
    if (getLightIsOn())
        setTimeout(turnLightsOn, 500);
    else
        log.info("Lights are off by user preference");
};

const addStateListener = (appState: AppState) => {
    
    var oldTheme = appState.uiTheme;

    appState.onChange(() => {            

        log.info("App state changed, checking for lights theme. Current theme: " + appState.uiTheme + ", old theme: " + oldTheme);
        
        if(appState.uiTheme === 'bladerunner' && oldTheme !== 'bladerunner') {
            log.info("Starting lights because bladerunner theme is active");
            startLightsIfWereOnAfterDelay();
        }
        else if(oldTheme === "bladerunner" && appState.uiTheme !== 'bladerunner') {
            turnLightsOff();
        }

        oldTheme = appState.uiTheme;
    });
};

const start = (appState: AppState): void => {

    if(appState.uiTheme === 'bladerunner')
        startLightsIfWereOnAfterDelay();
    else 
        turnLightsOff();

    addStateListener(appState);    
};

const BladerunnerApi = { start, toggleLights };
export default BladerunnerApi;
