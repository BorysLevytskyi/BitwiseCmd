describe("App test", function() {
    var app = window.app;

    it("shouldn't be null", function() {
        console.log(app);
        expect(app.constructor).notBeNull();
    });
});