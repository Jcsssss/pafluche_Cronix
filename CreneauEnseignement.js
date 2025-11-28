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

CreneauEnseignement.prototype.whichIsFirst = function(compCreneauEnseignement){


    if(!(this.hourStart.isEqual(compCreneauEnseignement.hourStart))){
        if(compCreneauEnseignement.hourStart.isBeforeEqual(this.hourStart)){

            return compCreneauEnseignement;

        }else if(this.hourStart.isBeforeEqual(compCreneauEnseignement.hourStart)){

            return this;

        }
    }else{
        console.log("Erreur, les deux créneaux sont égaux.");
    }
}

CreneauEnseignement.prototype.whichIsLast = function(compCreneauEnseignement){

    if(!(this.hourStart.isEqual(compCreneauEnseignement.hourStart))){

        if(this.whichIsFirst(compCreneauEnseignement)===this){
        	return compCreneauEnseignement;
        }else{
            return this;
        }
    }else{
        console.log("Erreur, les deux créneaux sont égaux.");
    }
}


CreneauEnseignement.prototype.doesntOverlap = function(compCreneauEnseignement){
	if(this.room===compCreneauEnseignement.room){

		if(this.day===compCreneauEnseignement.day){

			if(this.hourStart.isEqual(compCreneauEnseignement.hourStart)){

				return false;
			}else{

				const first=this.whichIsFirst(compCreneauEnseignement); // CHANGE LA VALEUR DE hourStart de compCreneauEnseignement ????

				const last = this.whichIsLast(compCreneauEnseignement);
				if(first.hourEnd.isBeforeEqual(last.hourStart)){
					return true;
				}else{
					return false;
				}
			}
		}else{
			return true;
	}
	}else{
		return true;
	}
}




module.exports = CreneauEnseignement;