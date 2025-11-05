import type { Metric } from 'web-vitals';

type ReportHandler = (metric: Metric) => void;

type WebVitalsModule = {
  onCLS?: (callback: ReportHandler) => void;
  onFID?: (callback: ReportHandler) => void;
  onFCP?: (callback: ReportHandler) => void;
  onLCP?: (callback: ReportHandler) => void;
  onTTFB?: (callback: ReportHandler) => void;
  getCLS?: (callback: ReportHandler) => void;
  getFID?: (callback: ReportHandler) => void;
  getFCP?: (callback: ReportHandler) => void;
  getLCP?: (callback: ReportHandler) => void;
  getTTFB?: (callback: ReportHandler) => void;
};

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then((module) => {
      const {
        onCLS,
        onFID,
        onFCP,
        onLCP,
        onTTFB,
        getCLS,
        getFID,
        getFCP,
        getLCP,
        getTTFB,
      } = module as WebVitalsModule;

      (onCLS ?? getCLS)?.(onPerfEntry);
      (onFID ?? getFID)?.(onPerfEntry);
      (onFCP ?? getFCP)?.(onPerfEntry);
      (onLCP ?? getLCP)?.(onPerfEntry);
      (onTTFB ?? getTTFB)?.(onPerfEntry);
    });
  }
};

export default reportWebVitals;
