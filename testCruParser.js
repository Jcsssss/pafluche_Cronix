const fs = require('fs');

var CruParser = require('./CruParser');


fs.readFile("./edt.cru", 'utf8', function (err,data) {
    var analyzer = new CruParser(true, true);
    analyzer.parse(data);
});