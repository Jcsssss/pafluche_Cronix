const fs = require('fs');

class FileManager{

    static folders = ["AB","CD","EF","GH","IJ","KL","MN","OP","QR","ST"];
    static index = 0;

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
    
    static initialize(){
        this.index=0;
    }

    static next(){
        const returnValue = this.folders[this.index];
        this.index++;
        return ("./SujetA_data/"+returnValue+"/edt.cru");
    }

    static hasNext(){
        if(this.index===this.folders.length){
            return false;
        }else{
            return true;
        }
    }
}
module.exports = FileManager