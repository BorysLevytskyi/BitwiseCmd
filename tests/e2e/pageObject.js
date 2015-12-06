var Key = protractor.Key;
var By = protractor.By;

function BitwiseCmdPage(driver, appUrl) {
    this.driver = driver;
    this.appUrl = appUrl;
}

BitwiseCmdPage.prototype.goToApp = function (hashValue) {
    var url = this.appUrl;
    var hash = hashValue || '-notrack';

    if(hash.indexOf('-notrack') < 0) {
        hash += "||-notrack";
    }

    if(url.indexOf("#") < 0) {
        url += "#" + hash;
    } else {
        url += "||" + hash;
    }

    return this.driver.get(url);
};

BitwiseCmdPage.prototype.sendCommand = function(cmd) {
    console.log('\r\nSend command: ' + cmd + "\r\n");
    return this.driver.findElement(By.id('in')).then(function (el) {
        return el.sendKeys(cmd + Key.ENTER);
    });
};

BitwiseCmdPage.prototype.clearResults = function () {
    return this.sendCommand("clear");
};

BitwiseCmdPage.prototype.executeExpression = function(expr) {
    var self = this;
    return this.clearResults().then(function() {
        return self.sendCommand(expr);
    })
};

module.exports = BitwiseCmdPage;