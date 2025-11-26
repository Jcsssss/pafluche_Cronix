const CreneauEnseignement = require("./CreneauEnseignement");

var Cours = function(nomCours){
    this.nomCours=nomCours;
    this.listeCreneauEnseignement= [];
}

Cours.prototype.addCreneauEnseignement = function(creneauEnseignement){
    this.listeCreneauEnseignement.push(creneauEnseignement);
};

module.exports = CreneauEnseignement;