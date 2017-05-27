var Key = protractor.Key;
var By = protractor.By;
var resultTableReader = require('./resultTableReader');

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

BitwiseCmdPage.prototype.getLasExpressionResult = function() {
    return this.driver.findElement(By.css('.expression')).then(function(resultElement) {
        return new ExpressionResultObject(resultElement);
    });
};

BitwiseCmdPage.prototype.getAllResults = function() {
    return this.driver.findElements(By.css('.result')).then(function(resultElements) {
        var results = [], i= 0, len = resultElements.length;

        // TODO: Use _.map
        for(;i<len;i++) {
            results.push(new ExpressionResultObject(resultElements[i]));
        }
        return results;
    });
};

BitwiseCmdPage.prototype.shouldHaveNoErrors = function () {
    return this.driver.findElements(By.css('.result .error')).then(function(els) {
        expect(els.length).toBe(0, "There should be no errors");
    });
};

function ExpressionResultObject(resultElement) {
    this.resultElement = resultElement;
}

ExpressionResultObject.prototype.readResult = function () {
  return resultTableReader.read(this.resultElement);
};

ExpressionResultObject.prototype.shouldBe = function(expectedResult) {
    this.readResult().then(function(actualResult) {
        expect(actualResult.length).toEqual(expectedResult.length, "Unexpected result length");
        var expected, actual;
        for(var i=0;i<expectedResult.length; i++) {
            var actual = actualResult[i],
                expected = convertToExpected(expectedResult[i]);
            //console.log("actual.bin.length=" + actual.bin.length)
            expect(actual).toEqual(jasmine.objectContaining(expected));
        }
    });

};

function convertToExpected(arg) {    
    if(arg.length) {
        return convertExpectedFromArray(arg);
    }

    return arg;
}

function convertExpectedFromArray(arg) {

        var start = 0;
        if(arg.length == 4) {
            start = 1
        }

        var obj = {
            sign: arg.length == 4 ? arg[0] : '',
            label: arg[start++],
            bin: arg[start++],
            other: arg[start++]
        }

        // console.log('convert: ' + JSON.stringify(arg) + " to " + JSON.stringify(obj));

        return obj;
}

module.exports = {
    BitwiseCmdPage : BitwiseCmdPage,
    ExpressionResultObject: ExpressionResultObject
};