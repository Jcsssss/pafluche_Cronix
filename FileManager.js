/**
 * @fileoverview Gestionnaire de fichiers pour l'accès et la manipulation des fichiers CRU.
 * Les fichiers sont organisés alphabétiquement dans des sous-dossiers (AB, CD, EF, etc.)
 * 
 * @module FileManager
 * @requires fs
 * @requires ./CruParser
 * @requires ./CreneauEnseignement
 * @requires ./Cours
 * @requires ./HeureMinute
 */

const fs = require('fs');
const CruParser = require('./CruParser.js');
const CreneauEnseignement = require('./CreneauEnseignement.js');
const Cours = require('./Cours.js');
const HeureMinute = require('./HeureMinute.js');

/**
 * Classe statique pour gérer l'accès aux fichiers CRU organisés alphabétiquement.
 * Fournit des méthodes pour naviguer dans les fichiers et vérifier la cohérence des données.
 * 
 * @class FileManager
 * @static
 * 
 * @example
 * // Parcourir tous les fichiers
 * FileManager.initialize();
 * while(FileManager.hasNext()) {
 *     const filePath = FileManager.next();
 *     // Traiter le fichier
 * }
 */
class FileManager {

    /**
     * Liste des dossiers contenant les fichiers CRU.
     * Organisés par paires de lettres alphabétiques (AB, CD, EF, etc.)
     * 
     * @static
     * @type {string[]}
     */
    static folders = ["AB","CD","EF","GH","IJ","KL","MN","OP","QR","ST"];
    
    /**
     * Index courant pour la navigation dans la liste des dossiers.
     * Utilisé par les méthodes hasNext() et next().
     * 
     * @static
     * @type {number}
     */
    static index = 0;
    
    /**
     * Répertoire racine où se trouvent les dossiers de données.
     * Par défaut "." (répertoire courant).
     * Peut être modifié pour pointer vers overlappedData lors des tests.
     * 
     * @static
     * @type {string}
     */
    static root = ".";

    /**
     * Trouve le chemin du fichier CRU contenant un cours donné.
     * Utilise la première lettre du nom du cours pour déterminer le dossier.
     * 
     * @static
     * @param {string} nomCours - Le nom du cours à rechercher
     * @returns {string|number} Le chemin relatif du fichier .cru ou -1 si le cours ne correspond à aucun dossier
     * 
     * @example
     * // Rechercher le cours "AP03"
     * const filePath = FileManager.findFileWithCourse("AP03");
     * // Retourne: "./SujetA_data/AB/edt.cru"
     * 
     * @example
     * // Cours inexistant
     * const filePath = FileManager.findFileWithCourse("ZZ99");
     * // Retourne: -1
     */
    static findFileWithCourse(nomCours) {
        let filePath;
        
        // Extraction de la première lettre du nom du cours
        const firstLetter = nomCours[0];
        
        switch(firstLetter) {
            case "A":
            case "B":
                filePath = FileManager.root + "/SujetA_data/AB/edt.cru";
                break;
            case "C":
            case "D":
                filePath = FileManager.root + "/SujetA_data/CD/edt.cru";
                break;
            case "E":
            case "F":
                filePath = FileManager.root + "/SujetA_data/EF/edt.cru";
                break;
            case "G":
            case "H":
                filePath = FileManager.root + "/SujetA_data/GH/edt.cru";
                break;
            case "I":
            case "J":
                filePath = FileManager.root + "/SujetA_data/IJ/edt.cru";
                break;
            case "K":
            case "L":
                filePath = FileManager.root + "/SujetA_data/KL/edt.cru";
                break;
            case "M":
            case "N":
                filePath = FileManager.root + "/SujetA_data/MN/edt.cru";
                break;
            case "O":
            case "P":
                filePath = FileManager.root + "/SujetA_data/OP/edt.cru";
                break;
            case "Q":
            case "R":
                filePath = FileManager.root + "/SujetA_data/QR/edt.cru";
                break;
            case "S":
            case "T":
                filePath = FileManager.root + "/SujetA_data/ST/edt.cru";
                break;
            default:
                // Lettre non supportée (U-Z ou caractères spéciaux)
                return -1;
        }
        
        return filePath;
    }
    
    /**
     * Initialise l'index de navigation à 0.
     * DOIT être appelé avant de commencer à parcourir les fichiers avec hasNext() et next().
     * 
     * @static
     * @returns {void}
     * 
     * @example
     * FileManager.initialize();
     * while(FileManager.hasNext()) {
     *     const filePath = FileManager.next();
     *     console.log(filePath);
     * }
     */
    static initialize() {
        this.index = 0;
    }

    /**
     * Retourne le chemin du fichier CRU suivant et incrémente l'index.
     * Utilise le dossier correspondant à l'index courant.
     * 
     * @static
     * @returns {string} Le chemin relatif du fichier .cru suivant
     * 
     * @example
     * FileManager.initialize();
     * const firstFile = FileManager.next();
     * // Retourne: "./SujetA_data/AB/edt.cru"
     * const secondFile = FileManager.next();
     * // Retourne: "./SujetA_data/CD/edt.cru"
     */
    static next() {
        const returnValue = this.folders[this.index];
        this.index++;
        return (FileManager.root + "/SujetA_data/" + returnValue + "/edt.cru");
    }

    /**
     * Vérifie s'il reste des fichiers à parcourir.
     * 
     * @static
     * @returns {boolean} true s'il reste des fichiers, false sinon
     * 
     * @example
     * FileManager.initialize();
     * while(FileManager.hasNext()) {
     *     // Traiter les fichiers
     * }
     */
    static hasNext() {
        return this.index !== this.folders.length;
    }

    /**
     * Vérifie la cohérence de toute la base de données.
     * Parcourt tous les fichiers CRU et détecte les chevauchements de créneaux dans une même salle.
     * 
     * Algorithme :
     * 1. Parse tous les fichiers CRU
     * 2. Pour chaque créneau, vérifie s'il ne chevauche pas d'autres créneaux dans la même salle
     * 3. Regroupe les chevauchements détectés
     * 4. Affiche les détails si demandé
     * 
     * @static
     * @param {boolean} showValue - Si true, affiche les détails des chevauchements détectés
     * @returns {boolean} true si aucun chevauchement n'est détecté, false sinon
     * 
     * @example
     * // Vérification simple
     * if(FileManager.dataConsistency(false)) {
     *     console.log("Base de données cohérente");
     * }
     * 
     * @example
     * // Vérification avec affichage des détails
     * if(!FileManager.dataConsistency(true)) {
     *     console.log("Des conflits ont été détectés (voir ci-dessus)");
     * }
     */
    static dataConsistency(showValue) {
        // Initialisation de la navigation dans les fichiers
        FileManager.initialize();

        // Collection de tous les cours de tous les fichiers
        let listeCours = [];

        // Parcours de tous les fichiers CRU
        while(FileManager.hasNext()) {
            let data = fs.readFileSync(FileManager.next(), 'utf8');
            let analyzer = new CruParser(false, false);
            analyzer.parse(data);
            listeCours.push(analyzer.parsedCours);
        }

        // Variables pour la détection des chevauchements
        let currentCreneauEnseignement;
        let listeCreneauEnseignementIncoherent = [];
        listeCreneauEnseignementIncoherent[0] = new Array();
        let listeCoursIncoherent = [];
        let indiceListe = 0;
        let globalFoundOverlap = false;
        let foundOverlap = false;
        let verificationDoublon = false;

        // Parcours de tous les cours pour détecter les chevauchements
        listeCours.forEach((fileCourses) => {
            fileCourses.forEach((course) => {
                if(course instanceof Cours) {
                    course.listeCreneauEnseignement.forEach((creneauEnseignement) => {
                        if(creneauEnseignement instanceof CreneauEnseignement) {
                            currentCreneauEnseignement = creneauEnseignement;

                            // Comparaison avec tous les autres créneaux
                            listeCours.forEach((fileCourses2) => {
                                fileCourses2.forEach((course2) => {
                                    if(course2 instanceof Cours) {
                                        course2.listeCreneauEnseignement.forEach((creneauEnseignement2) => {
                                            if(creneauEnseignement2 instanceof CreneauEnseignement) {
                                                
                                                // Ne pas comparer un créneau avec lui-même
                                                if(creneauEnseignement2 != currentCreneauEnseignement) {
                                                    // Détection du chevauchement
                                                    if(!(currentCreneauEnseignement.doesntOverlap(creneauEnseignement2))) {
                                                        
                                                        verificationDoublon = false;

                                                        // Vérifier si ce chevauchement n'a pas déjà été enregistré
                                                        if(globalFoundOverlap) {
                                                            listeCreneauEnseignementIncoherent.forEach((bloc) => {
                                                                if(bloc.includes(currentCreneauEnseignement) && 
                                                                   bloc.includes(creneauEnseignement2)) {
                                                                    verificationDoublon = true;
                                                                }
                                                            });
                                                        }
                                                        
                                                        // Enregistrement du nouveau chevauchement
                                                        if(!verificationDoublon) {
                                                            if(!foundOverlap) {
                                                                listeCreneauEnseignementIncoherent[indiceListe] = new Array();
                                                                listeCoursIncoherent.push(course.nomCours);
                                                                listeCreneauEnseignementIncoherent[indiceListe].push(currentCreneauEnseignement);
                                                            }
                                                            globalFoundOverlap = true;
                                                            foundOverlap = true;
                                                            listeCoursIncoherent.push(course2.nomCours);
                                                            listeCreneauEnseignementIncoherent[indiceListe].push(creneauEnseignement2);
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }
                                });
                            });

                            foundOverlap = false;
                            indiceListe++;
                        }
                    });
                }
            });
        });

        // Affichage des résultats si demandé
        let indiceCours = 0;
        let i = 0;
        if(globalFoundOverlap) {
            if(showValue) {
                let message = "Créneaux incohérents trouvés :";
                listeCreneauEnseignementIncoherent.forEach((group) => {
                    message = message + "\n";
                    i = 0;
                    group.forEach((creneau) => {
                        if(i === 0) {
                            message = message + "Le créneau :\n" + 
                                     listeCoursIncoherent[indiceCours] + " : " + 
                                     creneau.toString() + "\navec :\n";
                            indiceCours++;
                            i++;
                        } else {
                            message = message + listeCoursIncoherent[indiceCours] + " : " + 
                                     creneau.toString() + "\n";
                            indiceCours++;
                        }
                    });
                });
                console.log(message);
            }
            return false;
        } else {
            return true;
        }
    }
}

module.exports = FileManager;
