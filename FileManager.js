const fs = require('fs');

class FileManager{

    static folders = ["AB","CD","EF","GH","IJ","KL","MN","OP","QR","ST"];
    static index = 0;

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
                filePath="./SujetA_data/AB/edt.cru";
                break;
            case "B" :
                filePath="./SujetA_data/AB/edt.cru";
                break;
            case "C" :
                filePath="./SujetA_data/CD/edt.cru";
                break;
            case "D" :
                filePath="./SujetA_data/CD/edt.cru";
                break;
            case "E" :
                filePath="./SujetA_data/EF/edt.cru";
                break;
            case "F" :
                filePath="./SujetA_data/EF/edt.cru";
                break;
            case "G" :
                filePath="./SujetA_data/GH/edt.cru";
                break;
            case "H" :
                filePath="./SujetA_data/GH/edt.cru";
                break;
            case "I" :
                filePath="./SujetA_data/IJ/edt.cru";
                break;
            case "J" :
                filePath="./SujetA_data/IJ/edt.cru";
                break;
            case "K" :
                filePath="./SujetA_data/KL/edt.cru";
                break;
            case "L" :
                filePath="./SujetA_data/KL/edt.cru";
                break;
            case "M" :
                filePath="./SujetA_data/MN/edt.cru";
                break;
            case "N" :
                filePath="./SujetA_data/MN/edt.cru";
                break;
            case "O" :
                filePath="./SujetA_data/OP/edt.cru";
                break;
            case "P" :
                filePath="./SujetA_data/OP/edt.cru";
                break;
            case "Q" :
                filePath="./SujetA_data/QR/edt.cru";
                break;
            case "R" :
                filePath="./SujetA_data/QR/edt.cru";
                break;
            case "S" :
                filePath="./SujetA_data/ST/edt.cru";
                break;
            case "T" :
                filePath="./SujetA_data/ST/edt.cru";
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
        return ("./SujetA_data/"+returnValue+"/edt.cru");
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
}
module.exports = FileManager