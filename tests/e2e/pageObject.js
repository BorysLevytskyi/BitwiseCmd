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

ExpressionResultObject.prototype.shouldBe = function(expectedResult) {
    return this.resultElement.findElements(By.tagName('tr'))
        .then(function(rows) {
            var actualLength = rows.length + 0;
            var expectedLength = expectedResult.length + 0;

            expect(actualLength).toBe(expectedLength);
            if(actualLength != expectedLength) {
                //TODO:  I don't know why but expect doesn't throw exception...
                throw new Error("Inconsistent length");
            }

            var all = null, cur, expectedRow, actualRow;
            for (var i = 0; i < rows.length; i++) {
                expectedRow = expectedResult[i];
                actualRow = rows[i];

                cur = ExpressionResultObject.assertSingleRowResult(actualRow, expectedRow);
                all = all == null ? cur : all.then(cur);
            }

            return all;
        });
};

ExpressionResultObject.assertSingleRowResult = function(actualRow, expectedRow) {

    if(expectedRow == null) {
        throw new Error("Expected row is null")
    }

    var p = actualRow.findElement(by.css('.label')).then(function (tbLabel) {
            expect(tbLabel.getText()).toBe(expectedRow.label);
        }).then(function () {
            return actualRow.findElement(by.css('.bin'));
        }).then(function (tdBin) {
            expect(tdBin.getText()).toBe(expectedRow.bin);
        }).then(function () {
            return actualRow.findElement(by.css('.other'));
        }).then(function (tdOther) {
            expect(tdOther.getText()).toBe(expectedRow.other);
        });

        if(expectedRow.sign != null) {
            console.log('has sign!!!!!!!!!!!!!!!!!!!!!!!!');
            p = p.then(function () {
                return actualRow.findElement(by.css('.sign'));
            }).then(function (tdSign) {
                expect(tdSign.getText()).toBe(expectedRow.sign);
            });
        }

        return p;
    };

module.exports = {
    BitwiseCmdPage : BitwiseCmdPage,
    ExpressionResultObject: ExpressionResultObject
};