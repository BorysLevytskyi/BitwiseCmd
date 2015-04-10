// Theme change
app.run(function(){
    var rootView = app.get('rootView');
    var cmdConfig = app.get('cmdConfig');

    cmdConfig.observe('theme', function (theme) {
        console.log('changed theme');
        var theOther = theme == 'dark' ? 'light' : 'dark';

        if(rootView.classList.contains(theme)) {
            return;
        }

        rootView.classList.remove(theOther);
        rootView.classList.add(theme);
    });
});

// Save config in local store
app.run(function() {
    var cfg = app.get('cmdConfig');
    var storeKey = 'cmdConfig';

    load();

    cfg.observe(function(property, value){
        save();
    });

    function save() {
        localStorage.setItem(storeKey,  JSON.stringify(cfg.store()));
    }

    function load() {
        var json = localStorage.getItem(storeKey), stored;
        if(core.is.string(json)) {
            stored = JSON.parse(json);
            for(var key in stored) {
                cfg[key] = stored[key];
            }
        }
    }
});
