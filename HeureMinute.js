var HeureMinute = function(heure,minute){
    

    this.heure= Number(heure);
    this.minute= Number(minute);

}

HeureMinute.prototype.isValidHour = function(){
    if(this.heure>=0 && this.heure<=23 && this.minute>=0 && this.minute<=59){
        return true;
    }else{
        return false;
    }
}

HeureMinute.prototype.isBeforeEqual = function(compHeureMin){
    if(this.isValidHour&&compHeureMin.isValidHour){
        if(this.heure<compHeureMin.heure){
            return true;
        }else if(this.heure=compHeureMin.heure){
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

HeureMinute.prototype.isAfterEqual = function(compHeureMin){
    if(this.isValidHour&&compHeureMin.isValidHour){
        if(this.heure>compHeureMin.heure){
            return true;
        }else if(this.heure=compHeureMin.heure){
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

module.exports = HeureMinute;