(function() {

    if(window.location.host != 'bitwisecmd.com' ||  window.location.hash.indexOf('-notrack') > -1) {
        console.log("Analytics not tracked")
        return;
    }

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-61569164-1', 'auto');
    ga('send', 'pageview');
})();