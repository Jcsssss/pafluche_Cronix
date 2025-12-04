const CreneauEnseignement = require("./CreneauEnseignement");

/**
 * La classe cours contient un nom de cours ainsi qu'une liste de tous les créneaux d'enseignement de ce cours de type CreneauEnseignement.
 * @see CreneauEnseignement
 * @param {String} nomCours 
 */
var Cours = function(nomCours){
    this.nomCours=nomCours;
    this.listeCreneauEnseignement= [];
}


/**
 * La méthode addCreneauEnseignement permet d'ajouter un objet du type CreneauEnseignement au cours.
 * @see CreneauEnseignement
 * @param {CreneauEnseignement} creneauEnseignement 
 */
Cours.prototype.addCreneauEnseignement = function(creneauEnseignement){
    this.listeCreneauEnseignement.push(creneauEnseignement);
};

/**
 * Renvoie true si le nom du cours est égal à l'argument <nom>, false sinon.
 * 
 * @param {String} nom 
 * @returns 
 */
Cours.prototype.isNamed = function(nom){
    if(this.nomCours===nom){
        return true;
    }else{
        return false;
    }
}

module.exports = Cours;