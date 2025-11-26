const HeureMinute = require("./HeureMinute");

var CreneauEnseignement = function(type,capacity,day,hourStart,hourEnd,subgroup,room){
    var index = this.index(input);
		this.type = type;
		this.capacity = capacity;
		this.day = day;
		this.hourStart = hourStart;
        this.hourEnd = hourEnd;
		this.subgroup = subgroup;
		this.room = room;
}

module.exports = CreneauEnseignement;