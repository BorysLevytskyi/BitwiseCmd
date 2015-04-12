browser.ignoreSynchronization = true;
var By = protractor.By;
var driver = browser.driver;
var appUrl = 'http://localhost:63342/BitwiseCmd/src/';
var Key = protractor.Key;

describe('a quick test', function(){
    it('should be true', function(){
        expect(true).toBe(true);
    });
});

describe('launch of application', function() {
    it('should have title', function() {
        driver.get(appUrl).then(function() {
            expect(driver.getTitle()).toEqual('BitwiseCmd');
        });
    });

    it('should have no errors title', function() {
        driver.get(appUrl).then(function() {
            driver.findElements(By.css('.result .error')).then(function(els) {
                expect(els.length).toBe(0, "There should be no errors on auto launch");
            });
        });
    });

    it('should execute clear command', function() {
        driver.get(appUrl)
            .then(function() { return sendCommand('clear')})
            .then(function () {
                console.log('before assert');

                driver.findElements(By.css('.result')).then(function(els) {
                    expect(els.length).toBe(0, "There should be no results after clear");
                });
        });
    });

    it('should execute list of commands without errors', function() {

        driver.get(appUrl)
            .then(function() { return sendCommand('clear')})
            .then(function() { return sendCommand('1')})
            .then(function() { return sendCommand('1|2')})
            .then(function() { return sendCommand('1^2')})
            .then(function() { return sendCommand('0x1>>>0xf')})
            .then(function() { return sendCommand('0x1 0xf')})
            .then(function() { return sendCommand('0x1 | 0xf')})
            .then(function() { return sendCommand('0x1 ^ 123')})
            .then(assertNoErrors);
    });

    it('should execute list of numbers', function() {

        driver.get(appUrl)
            .then(function() { return sendCommand('clear')})
            .then(function() { return sendCommand('3 0xf')})
            .then(assertNoErrors)
            .then(function() {
                return assertBitwiseNumbersResults(driver,
                    [{ label: '3', bin:'00000011', other: '0x3'},
                     { label: '0xf', bin:'00001111', other: '15'}])
            });
    });
});

function sendCommand(cmd) {
    return driver.findElement(By.id('in')).then(function (el) {
        return el.sendKeys(cmd + Key.ENTER);
    });
}

function assertNoErrors(cmd) {
    return driver.findElements(By.css('.result .error')).then(function(els) {
        expect(els.length).toBe(0, "There should be no errors");
    });
}

function assertBitwiseNumbersResults(contaier, array) {

    return contaier.findElement(By.css('.expression')).then(function (tableExpr){
        return tableExpr.findElements(By.tagName('tr')).then(function(rows) {
            expect(rows.length).toBe(array.length, 'Rows number mismatch');

            var all= null, cur;
            for(var i=0; i<rows.length;i++) {
                var expected = array[i];
                cur = assertSingleRowResult(rows[i], expected.label, expected.bin, expected.other);
                all = all == null ? cur : all.then(cur);
            }
        });
    });

}

function assertSingleRowResult(row, label, bin, other) {
        return row.findElement(by.css('.label')).then(function (tbLabel) {
            expect(tbLabel.getText()).toBe(label);
        }).then(function () {
            return row.findElement(by.css('.bin')).then(function (tdBin) {
                expect(tdBin.getText()).toBe(bin);
            })
        }).then(function () {
            return row.findElement(by.css('.other')).then(function (tdOther) {
                expect(tdOther.getText()).toBe(other);
            })
        });
}