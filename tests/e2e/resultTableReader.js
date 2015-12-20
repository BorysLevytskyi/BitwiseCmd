var promise = protractor.promise;
var resultTableReader = {
    read: function (table) {
        var self = this;
        return table.findElements(By.tagName('tr'))
            .then(function(rows) {
                var promises = [];
                for (var i = 0; i < rows.length; i++) {
                    promises.push(self.readRow(rows[i]));
                }

                return promise.all(promises);
            });
    },

    readRow: function (row) {
        var def = promise.defer();
        var dataList = [];
        var promises = [];
        var self = this;

        row.findElements(By.tagName('td')).then(function(cols) {
            for(var i=0; i<cols.length;i++){
                promises.push(self.readColumn(cols[i]).then(function(colData) { dataList.push(colData); }))
            }
        });

        promise.all(promises).then(function() {
            var rowObj = {}, colObj;
            for(var i=0; i<dataList.length; i++ ){
                colObj = dataList[i];
                rowObj[colObj.className] = colObj.text;
            }

            def.fulfill(rowObj);
        });

        return def.promise;
    },

    readColumn: function(col) {
        var def = promise.defer();
        var colData = {};
        var promises = [];

        promises.push(col.getAttribute('class').then(function(className) { colData.className = className; }))
        promises.push(col.getText().then(function(text) { colData.text = text; }))

        promise.all(promises).then(function () {
            def.fulfill(colData);
        });

        return def.promise;
    }
};
module.exports = resultTableReader;
