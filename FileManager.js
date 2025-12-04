const fs = require('fs');
const CruParser = require('./CruParser.js');
const CreneauEnseignement = require('./CreneauEnseignement.js');
const Cours = require('./Cours.js');
const HeureMinute = require('./HeureMinute.js');

class FileManager{

    static folders = ["AB","CD","EF","GH","IJ","KL","MN","OP","QR","ST"];
    static index = 0;
    static root = ".";

    /**
     * Return a relative file path according to the first letter of the argument <nomCours>. The files are expected to be found at, starting from projet root, "/SujetA_data/".
     * Courses are then sorted in alphabetical order inside sub-repositories, example : "/SujetA_data/AB/edt.cru" for courses starting with A or B.
     * Caution : function only returns the path to the expected file, does not check if the file contains the course.
     * 
     * @param {String} nomCours nom du cours dont on cherche le fichier
     * @returns relative file path to the supposed .cru file containing the course
     */
    static findFileWithCourse(nomCours){
        let filePath;
        switch(nomCours[0]){
            case "A" :
                filePath=FileManager.root+"/SujetA_data/AB/edt.cru";
                break;
            case "B" :
                filePath=FileManager.root+"/SujetA_data/AB/edt.cru";
                break;
            case "C" :
                filePath=FileManager.root+"/SujetA_data/CD/edt.cru";
                break;
            case "D" :
                filePath=FileManager.root+"/SujetA_data/CD/edt.cru";
                break;
            case "E" :
                filePath=FileManager.root+"/SujetA_data/EF/edt.cru";
                break;
            case "F" :
                filePath=FileManager.root+"/SujetA_data/EF/edt.cru";
                break;
            case "G" :
                filePath=FileManager.root+"/SujetA_data/GH/edt.cru";
                break;
            case "H" :
                filePath=FileManager.root+"/SujetA_data/GH/edt.cru";
                break;
            case "I" :
                filePath=FileManager.root+"/SujetA_data/IJ/edt.cru";
                break;
            case "J" :
                filePath=FileManager.root+"/SujetA_data/IJ/edt.cru";
                break;
            case "K" :
                filePath=FileManager.root+"/SujetA_data/KL/edt.cru";
                break;
            case "L" :
                filePath=FileManager.root+"/SujetA_data/KL/edt.cru";
                break;
            case "M" :
                filePath=FileManager.root+"/SujetA_data/MN/edt.cru";
                break;
            case "N" :
                filePath=FileManager.root+"/SujetA_data/MN/edt.cru";
                break;
            case "O" :
                filePath=FileManager.root+"/SujetA_data/OP/edt.cru";
                break;
            case "P" :
                filePath=FileManager.root+"/SujetA_data/OP/edt.cru";
                break;
            case "Q" :
                filePath=FileManager.root+"/SujetA_data/QR/edt.cru";
                break;
            case "R" :
                filePath=FileManager.root+"/SujetA_data/QR/edt.cru";
                break;
            case "S" :
                filePath=FileManager.root+"/SujetA_data/ST/edt.cru";
                break;
            case "T" :
                filePath=FileManager.root+"/SujetA_data/ST/edt.cru";
                break;
            default:
                return -1;
        }
        

        return filePath
    }
    
    /**
     * Set the static object FileManager.index to 0. Always used before getting all file paths.
     * 
     * To get all the relative file paths, always proceed as such :
     * 
     * FileManager.initialize();
     * while(FileManager.hasNext()){
     *      FileManager.next();
     * }
     */
    static initialize(){
        this.index=0;
    }

    /**
     * Returns the next relative file path to come.
     * 
     * To get all the relative file paths, always proceed as such :
     * 
     * FileManager.initialize();
     * while(FileManager.hasNext()){
     *      FileManager.next();
     * }
     * 
     * @returns relative file path to the next .cru file.
     */
    static next(){
        const returnValue = this.folders[this.index];
        this.index++;
        return (FileManager.root+"/SujetA_data/"+returnValue+"/edt.cru");
    }

    /**
     * Returns if there is a next file path.
     * 
     * To get all the relative file paths, always proceed as such :
     * 
     * FileManager.initialize();
     * while(FileManager.hasNext()){
     *      FileManager.next();
     * }
     * 
     * @returns true if there is still a file path to return, false if there is none
     */
    static hasNext(){
        if(this.index===this.folders.length){
            return false;
        }else{
            return true;
        }
    }


    /**
     * Vérifie si tous les créneaux de tous les fichiers ne se situent pas en même temps dans la même salle.
     * Ecrit dans la console les créneaux qui overlap si il y en a.
     * 
     * @returns true si aucun créneau n'est en même temps, false sinon
     */
    static dataConsistency(){
        FileManager.initialize();

		let listeCours=[];

		while(FileManager.hasNext()){

			let data = fs.readFileSync(FileManager.next(), 'utf8');
			let analyzer = new CruParser(false, false);
			analyzer.parse(data);
			listeCours.push(analyzer.parsedCours);
		}

        let currentCreneauEnseignement;
        let listeCreneauEnseignementIncoherent= [];
        listeCreneauEnseignementIncoherent[0]= new Array();
        let listeCoursIncoherent= [];
        let indiceListe = 0;
        let globalFoundOverlap= false;
        let foundOverlap=false;


        let verificationDoublon=false;

        listeCours.forEach((fileCourses) => {
			fileCourses.forEach((course) =>{
				if(course instanceof Cours){
					course.listeCreneauEnseignement.forEach((creneauEnseignement) => {
						if(creneauEnseignement instanceof CreneauEnseignement){

                            currentCreneauEnseignement=creneauEnseignement;

							listeCours.forEach((fileCourses2) => {
                                fileCourses2.forEach((course2) =>{
                                    if(course2 instanceof Cours){
                                        course2.listeCreneauEnseignement.forEach((creneauEnseignement2) => {
                                            if(creneauEnseignement2 instanceof CreneauEnseignement){
                                                
                                                if(creneauEnseignement2!=currentCreneauEnseignement){
                                                    if(!(currentCreneauEnseignement.doesntOverlap(creneauEnseignement2))){
                                                        
                                                        verificationDoublon=false;

                                                        if(globalFoundOverlap){
                                                            listeCreneauEnseignementIncoherent.forEach((bloc)=>{
                                                                
                                                                //console.log(JSON.stringify(bloc));
                                                                if(bloc.includes(currentCreneauEnseignement) && bloc.includes(creneauEnseignement2)){
                                                                    //console.log('Worked !');
                                                                    verificationDoublon=true;
                                                                }
                                                            });
                                                        }
                                                        if(!verificationDoublon){
                                                        
                                                            if(!foundOverlap){
                                                                listeCreneauEnseignementIncoherent[indiceListe]= new Array();
                                                                listeCoursIncoherent.push(course.nomCours);
                                                                listeCreneauEnseignementIncoherent[indiceListe].push(currentCreneauEnseignement);
                                                                
                                                            }
                                                            globalFoundOverlap=true;
                                                            foundOverlap=true;
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

                            foundOverlap=false;
                            indiceListe++;

						}
					})
				}
			})
		});


        let indiceCours=0;
        let i = 0;
        if(globalFoundOverlap){
            let message ="Créneaux incohérents trouvés :";
            listeCreneauEnseignementIncoherent.forEach((group)=>{
                message= message+"\n"
                i=0;
                group.forEach((creneau)=>{
                    if(i===0){
                        message=message + "Le créneau :\n" + listeCoursIncoherent[indiceCours]+ " : " + creneau.toString()+"\navec :\n";
                        indiceCours++;
                        i++;
                    }else{
                        message=message + listeCoursIncoherent[indiceCours]+ " : " + creneau.toString()+"\n";
                        indiceCours++;
                    }
                });
            });
            console.log(message);
            return false;
        }else{
            return true;
        }
       

    }
}
module.exports = FileManager