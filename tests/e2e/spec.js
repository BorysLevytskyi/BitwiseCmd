browser.ignoreSynchronization = true;

var By = protractor.By;
var driver = browser.driver;
var appUrl = browser.params.appUrl || 'http://localhost:63342/BitwiseCmd/src/#clear';
var Key = protractor.Key;

describe('launch of application', function() {
    it('should have title', function() {
        goToApp().then(function() {
            expect(driver.getTitle()).toEqual('BitwiseCmd');
        });
    });

    it('should have no errors title', function() {
        goToApp().then(function() {
            driver.findElements(By.css('.result .error')).then(function(els) {
                expect(els.length).toBe(0, "There should be no errors on auto launch");
            });
        });
    });

    it('should execute clear command', function() {
        goToApp()
            .then(function() { return sendCommand('clear')})
            .then(function () {
                return driver.findElements(By.css('.result')).then(function(list) {
                    expect(list.length).toBe(0, "There should be no results after clear");
                });
        });
    });

    it('should execute list of commands without errors', function() {

        goToApp()
            .then(function() { return sendCommand('clear')})
            .then(function() { return sendCommand('1')})
            .then(function() { return sendCommand('1|2')})
            .then(function() { return sendCommand('1^2')})
            .then(function() { return sendCommand('0x1>>>0xf')})
            .then(function() { return sendCommand('0x1 0xf')})
            .then(function() { return sendCommand('0x1 | 0xf')})
            .then(function() { return sendCommand('0x1 ^ 123')})
            .then(function() { return sendCommand('dark')})
            .then(function() { return sendCommand('light')})
            .then(assertNoErrors);
    });

    it('should execute list of numbers', function() {

        goToApp()
            .then(function() { return sendCommand('clear')})
            .then(function() { return sendCommand('3 0xf')})
            .then(assertNoErrors)
            .then(function() {
                return assertExpressionResult(driver,
                    [{ label: '3', bin:'00000011', other: '0x3'},
                     { label: '0xf', bin:'00001111', other: '15'}])
            });
    });

    it('should do a shift operation', function() {

        return assertOperation('1<<1',
            [{ label: '1', bin:'00000001', other: '0x1'},
                { label: '1<<1=2', bin:'00000010', other: '0x2'}])
    });

    it('should do a ignroe sign RIGHT shift operation', function() {

        return assertOperation('-1>>>1',
            [{ label: '-1', bin:'11111111111111111111111111111111', other: '-0x1'},
                { label: '-1>>>1=2147483647', bin:'01111111111111111111111111111111', other: '0x7fffffff'}])
    });

    it('should do NOT operation', function() {

        return assertOperation('~1',
            [{ label: '1', bin:'00000000000000000000000000000001', other: '0x1'},
             { label: '~1=-2', bin:'11111111111111111111111111111110', other: '-0x2'}])
    });

    it('should execute multiple expressions from hash arguments', function() {
        return goToApp("16,15||16&15")
            .then(function() { return driver.navigate().refresh(); })
            .then(assertNoErrors)
            .then(function() {
                return assertMultipleExpressionResults(driver, [
                    //16&15
                    [{ label: '16', bin:'00010000', other: '0x10'},
                        { label: '15', bin:'00001111', other: '0xf'},
                        { label: '0', bin:'00000000', other: '0x0'}],

                    //16 15
                    [{ label: '16', bin:'00010000', other: '0x10'},
                        { label: '15', bin:'00001111', other: '0xf'}]
                ])
            })
    });

    it('should do OR operation', function() {

        return assertOperation('1|2',
            [{ label: '1', bin:'00000001', other: '0x1'},
                { label: '2', bin:'00000010', other: '0x2'},
                { label: '3', bin:'00000011', other: '0x3'}])
    });

    it('should do XOR or large numbers', function() {

        return assertOperation('0x0001000000003003^0x3001800400000fc1',
            [{ label: '0x0001000000003003', bin:'0000000000000001000000000000000000000000000000000011000000000011', other: '281474976722947'},
                { label: '0x3001800400000fc1', bin:'0011000000000001100000000000010000000000000000000001000000000000', other: '3459186743465480000'},
                { label: '0x2003', bin:'0000000000000000000000000000000000000000000000000010000000000011', other: '8195'}])
    });

    it('should do prefer hex result', function() {

        return assertOperation('1|0x2',
            [{ label: '1', bin:'00000001', other: '0x1'},
                { label: '0x2', bin:'00000010', other: '2'},
                { label: '0x3', bin:'00000011', other: '3'}])
    });


    it('should create hashlink', function() {
        var expected = [{ label: '1', bin:'00000001', other: '0x1'},
            { label: '0x2', bin:'00000010', other: '2'},
            { label: '0x3', bin:'00000011', other: '3'}];

        return assertOperation('1|0x2', expected).then(function(){
            return driver.findElement(By.css('.hashLink'));
        }).then(function(el) {
            return el.getAttribute('href');
        }).then(function(hrefUrl) {
            return driver.get(hrefUrl + "||-notrack"); // TODO: temp solution. Need to implement better tracking handling logic
        }).then(function() {
            return driver.findElements(By.css('.result'));
        }).then(function(list) {
            expect(list.length).toBeGreaterThan(0);
            return assertExpressionResult(list[0], expected);
        });

    });

    xit('should emphasize bytes', function() {

        goToApp()
            .then(function() { return sendCommand('clear')})
            .then(function() { return sendCommand('1')})
            .then(function() {
                return assertExpressionResult(driver, [{ label: '1', bin:'00000001', other: '0x1'}])
            })
            .then(function() { return sendCommand('clear')})
 //           .then(function() { return sendCommand('em')})
            .then(assertNoErrors)
            .then(function() { return sendCommand('1 3')})
            .then(function() {
                return assertExpressionResult(driver, [{ label: '1', bin:'01', other: '0x1'}, { label: '3', bin:'11', other: '0x3'}])
            });
    });
});

function sendCommand(cmd) {
    return driver.findElement(By.id('in')).then(function (el) {
        return el.sendKeys(cmd + Key.ENTER);
    });
}

function assertNoErrors() {
    return driver.findElements(By.css('.result .error')).then(function(els) {
        expect(els.length).toBe(0, "There should be no errors");
    });
}

function assertMultipleExpressionResults(contaier, array) {

    return contaier.findElements(By.css('.result'))
        .then(function (results){
            expect(results.length).toBe(array.length, 'Expression results number mismatch');
            var all= null, cur;
            for(var i=0; i<results.length;i++) {
                var expected = array[i];
                cur = assertExpressionResult(results[i], expected);
                all = all == null ? cur : all.then(cur);
            }
            return all;
        });
}

function assertExpressionResult(contaier, array) {

    return contaier.findElement(By.css('.expression'))
        .then(function (tableExpr){
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
            return row.findElement(by.css('.bin'));
        }).then(function (tdBin) {
            expect(tdBin.getText()).toBe(bin);
        }).then(function () {
            return row.findElement(by.css('.other'));
        }).then(function (tdOther) {
            expect(tdOther.getText()).toBe(other);
        });
}

function assertOperation(op, expected) {
    return goToApp().then(function() {
        return sendCommand(op)
            .then(assertNoErrors)
            .then(function() {
                return assertExpressionResult(driver, expected)
            });
    })
}

function goToApp(hashValue) {

    var url = appUrl;
    var hash = hashValue || '-notrack';

    if(hash.indexOf('-notrack') < 0) {
        hash += "||-notrack";
    }

    if(url.indexOf("#") < 0) {
        url += "#" + hash;
    } else {
        url += "||" + hash;
    }

    console.log('---------- accessing url: ' + url);

    return driver.get(url);
}