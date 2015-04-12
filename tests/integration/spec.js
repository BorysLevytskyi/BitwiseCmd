var By = protractor.By;
var driver = browser.driver;
var appUrl = 'http://localhost:63342/BitwiseCmd/src/';

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
                expect(els.length).toBe(0, "There should be no errors on autolaunch");
            });
        });
    });


    //el.sendKey('asd');
    //expect(el.text()).toBe('asd')
});