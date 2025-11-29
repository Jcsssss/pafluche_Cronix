const HeureMinute = require("./HeureMinute");


/**
 * La classe CreneauEnseignement permet de stocker et de manipuler des opérations de base pour un créneau d'enseignement.
 * 
 * @see HeureMinute
 * @param {String} type 
 * @param {String} capacity 
 * @param {String} day 
 * @param {HeureMinute} hourStart 
 * @param {HeureMinute} hourEnd 
 * @param {String} subgroup 
 * @param {String} room 
 */
var CreneauEnseignement = function(type,capacity,day,hourStart,hourEnd,subgroup,room){
	this.type = type;
	this.capacity = parseInt(capacity);
	this.day = day;
	this.hourStart = hourStart;
    this.hourEnd = hourEnd;
	this.subgroup = subgroup;
	this.room = room;
}

/**
 * Permet de renvoyer le créneau d'enseignement qui commence en premier.
 * ATTENTION, on suppose que les deux créneaux d'enseignement sont le même jour.
 * 
 * @param {CreneauEnseignement} compCreneauEnseignement 
 * @returns {CreneauEnseignement} le premier créneau des deux
 */
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

/**
 * Permet de renvoyer le créneau d'enseignement qui commence en dernier.
 * ATTENTION, on suppose que les deux créneaux d'enseignement sont le même jour.
 * 
 * @param {CreneauEnseignement} compCreneauEnseignement 
 * @returns {CreneauEnseignement} le dernier créneau des deux
 */
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

/**
 * Permet de vérifier que deux créneaux d'enseignement ne sont pas en même temps dans la même salle.
 * 
 * @param {CreneauEnseignement} compCreneauEnseignement 
 * @returns {Boolean} vraie si les deux créneaux ne sont pas en même temps, faux sinon
 */
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