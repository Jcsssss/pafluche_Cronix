const fs = require('fs');

var CruParser = require('./CruParser');


fs.readFile("./SujetA_data/AB/edt.cru", 'utf8', function (err,data) {
    var analyzer = new CruParser(false,false);
    analyzer.parse(data);
    
    console.log(analyzer.parsedCours[0].nomCours);
});