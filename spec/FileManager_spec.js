const FileManager = require('../FileManager');

describe("Test of FileManager", function(){
	
	beforeAll(function() {

        const FileManager = require('../FileManager');
	});
	
	it("can find a cru file with the course's name", function(){

        
        expect(FileManager.findFileWithCourse("CM10")).toBe("./SujetA_data/CD/edt.cru");
        expect(FileManager.findFileWithCourse("ZT00")).toBe(-1);
		
	});

    it("can initialize the index to 0", function(){

        FileManager.initialize();
        expect(FileManager.index).toBe(0);
		
	});

    it("can go through the list of folders", function(){

        FileManager.initialize();
        expect(FileManager.index).toBe(0);
        let i = 0;
        while(FileManager.hasNext()){
            expect(FileManager.next()).toBe("./SujetA_data/"+FileManager.folders[i]+"/edt.cru");
            i++;
        }

        expect(FileManager.hasNext()).toBeFalse;
		
	});

    it("can check if the whole database has no overlapped timeslot", function(){

           expect(FileManager.dataConsistency(false)).toBeTrue;
           
           //Changing the root from which the database is taken to a root where the datas are overlapped.
           FileManager.root="./overlappedData";

           expect(FileManager.dataConsistency(false)).toBeFalse;

           FileManager.root=".";

    });
});