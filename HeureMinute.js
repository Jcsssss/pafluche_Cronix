var HeureMinute = function(heure,minute){
    this.heure=heure;
    this.minute= minute;
}

HeureMinute.prototype.isBeforeEqual = function(compHeureMin){
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
}

HeureMinute.prototype.isAfterEqual = function(){
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
}

module.exports = HeureMinute;