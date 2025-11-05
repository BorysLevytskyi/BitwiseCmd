import log from 'loglevel';

export type AnalyticsEvent = {
    eventCategory: string,
    eventAction: string,
    eventLabel?: string
};

export type AnalyticsHandler = (evt: AnalyticsEvent) => boolean;

function sendAnalyticsEvent(evt : AnalyticsEvent) {
    const handler = (window as any).bitwiseCmdAnalyticsHandler;
    if(handler === null || handler === undefined) {
        log.debug('ERROR!!!: Analytics event was not sent. Handler not found');
        return;
    }

    const delivered = (handler as AnalyticsHandler)(evt);
    log.debug('Analytics event sent. Delivery response: ' + delivered, evt)
}

export {sendAnalyticsEvent};
