app.compose(function(){
    var trackedDomains = { 'bitwisecmd.com': 'UA-61569164-1', 'borislevitskiy.github.io': 'UA-61569164-1'  };

    var host = window.location.host.toLowerCase();

    if(trackedDomains.hasOwnProperty(host)) {
        var trackingCode = trackedDomains[host];
        setTimeout(doTrackAsync, 300);
    }

    function doTrackAsync() {
        try
        {
            doTrack(trackingCode);
            console.info('View tracked successfully');
        }
        catch(err) {
            console.error('Failed to start tracking:', err);
        }
    }

    function doTrack(trackingCode) {

        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        var ga = window.ga;
        ga('create', trackingCode, 'auto');
        ga('send', 'pageview');
    }
});
