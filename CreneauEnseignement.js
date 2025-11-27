const HeureMinute = require("./HeureMinute");

var CreneauEnseignement = function(type,capacity,day,hourStart,hourEnd,subgroup,room){
		this.type = type;
		this.capacity = parseInt(capacity);
		this.day = day;
		this.hourStart = hourStart;
        this.hourEnd = hourEnd;
		this.subgroup = subgroup;
		this.room = room;
}

module.exports = CreneauEnseignement;