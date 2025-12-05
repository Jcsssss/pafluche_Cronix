
/**
 * Constructeur de la classe HeureMinute. La classe HeureMinute permet de stocker et de manipuler une heure.
 * 
 * @param {String} heure 
 * @param {String} minute 
 */
var HeureMinute = function(heure,minute){
    
    this.heure= Number(heure);
    this.minute= Number(minute);

}

/**
 * Permet de vérifier qu'une heure est valide. C'est à dire que son heure est bien entre 0 et 23 et que sa minute est bien entre 0 et 59.
 * 
 * @returns {Boolean} vrai si l'heure est valide, faux sinon
 */
HeureMinute.prototype.isValidHour = function(){
    if(this.heure>=0 && this.heure<=23 && this.minute>=0 && this.minute<=59){
        return true;
    }else{
        return false;
    }
}

/**
 * Vérifie l'égalité entre deux heures.
 * 
 * @param {HeureMinute} compHeureMin 
 * @returns {Boolean} vrai si les deux heures sont égales, faux sinon
 */
HeureMinute.prototype.isEqual = function(compHeureMin){
    if(this.isValidHour&&compHeureMin.isValidHour){
        if(this.heure===compHeureMin.heure&&this.minute===compHeureMin.minute){
            return true;
        }else{
            return false;
        }
    }else{
        console.log("Erreur : heure invalide.")
    }
}

    
/**
 * Vérifie qu'une heure soit avant ou en même temps qu'une autre.
 * 
 * @param {HeureMinute} compHeureMin 
 * @returns {Boolean} Renvoie vraie si this est avant ou en même temps que l'heure comparée. Renvoie faux sinon.
 */
HeureMinute.prototype.isBeforeEqual = function(compHeureMin){
    if(this.isValidHour&&compHeureMin.isValidHour){
        if(this.heure<compHeureMin.heure){
            return true;
        }else if(this.heure===compHeureMin.heure){
            if(this.minute<=compHeureMin.minute){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }else{
        console.log("Erreur : heure invalide.")
    }
}

/**
 * Vérifie qu'une heure soit après ou en même temps qu'une autre.
 * 
 * @param {HeureMinute} compHeureMin 
 * @returns {Boolean} Renvoie vraie si this est après ou en même temps que l'heure comparée. Renvoie faux sinon.
 */
HeureMinute.prototype.isAfterEqual = function(compHeureMin){
    if(this.isValidHour&&compHeureMin.isValidHour){
        if(this.heure>compHeureMin.heure){
            return true;
        }else if(this.heure===compHeureMin.heure){
            if(this.minute>=compHeureMin.minute){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }else{
        console.log("Erreur : heure invalide.")
    }
}

/**
 * Renvoie l'heure sous forme de chaîne de caractères, prêt pour l'affichage.
 * 
 * @returns {String}
 */
HeureMinute.prototype.toString = function(){

    message = this.heure.toString();
    message = message + ":";
    if(this.minute === 0){
        message = message + "00";
    } else {
        message = message + this.minute.toString();
    }
    

    return message;

}

module.exports = HeureMinute;