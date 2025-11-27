const HeureMinute = require('../HeureMinute');
const CreneauEnseignement = require('../CreneauEnseignement');

describe("Test of CreneauEnseignement class", function(){
	
	beforeAll(function() {

        this.creneau1 = new CreneauEnseignement("C1","25","L",new HeureMinute("9","00"),new HeureMinute("11","00"),"F1","M500");

	});
	
	it("can create a new CreneauEnseignement", function(){
		
		expect(this.creneau1).toBeDefined();
		// toBe is === on simple values
                // console.log(this.hm1.heure);
		expect(this.creneau1.type).toBe("C1");
		expect(this.creneau1).toEqual(jasmine.objectContaining({type: "C1"}));
		
	});
	
	it("can check if two timeslots don't overlap", function(){
		
                let creneau2 = new CreneauEnseignement("C1","25","L",new HeureMinute("9","00"),new HeureMinute("11","00"),"F1","N101");
                expect(this.creneau1.doesntOverlap(creneau2)).toBeTrue();

                let creneau3 = new CreneauEnseignement("C1","25","MA",new HeureMinute("9","00"),new HeureMinute("11","00"),"F1","M500");
                expect(this.creneau1.doesntOverlap(creneau3)).toBeTrue();

                let creneau4 = new CreneauEnseignement("C1","25","L",new HeureMinute("9","00"),new HeureMinute("10","00"),"F1","M500");
                expect(this.creneau1.doesntOverlap(creneau4)).toBeFalse();
                        
                let creneau5 = new CreneauEnseignement("C1","25","L",new HeureMinute("10","00"),new HeureMinute("11","00"),"F1","M500");
                expect(this.creneau1.doesntOverlap(creneau5)).toBeFalse();

                let creneau6 = new CreneauEnseignement("C1","25","L",new HeureMinute("11","00"),new HeureMinute("13","00"),"F1","M500");
                expect(this.creneau1.doesntOverlap(creneau6)).toBeTrue();

                let creneau7 = new CreneauEnseignement("C1","25","L",new HeureMinute("14","00"),new HeureMinute("16","00"),"F1","M500");
                expect(this.creneau1.doesntOverlap(creneau7)).toBeTrue();


	});
});