const Cours = require('../Cours');
const HeureMinute = require('../HeureMinute');
const CreneauEnseignement = require('../CreneauEnseignement');


describe("Test of Cours class", function(){
	
	beforeAll(function() {

        this.cours1 = new Cours("CR00");


	});
	
	it("can add a Creneau to a Cours", function(){

        const creneau1 = new CreneauEnseignement("C1","25","L",new HeureMinute("9","00"),new HeureMinute("11","00"),"F1","M500");
        this.cours1.addCreneauEnseignement(creneau1);

		expect(this.cours1.listeCreneauEnseignement[0]).toEqual(creneau1);
		expect(this.cours1.listeCreneauEnseignement[0]).toEqual(jasmine.objectContaining({type: "C1"}));
		
	});

    it("can check if a course has a given name", function(){

        expect(this.cours1.isNamed("CR00")).toBeTrue();
		expect(this.cours1.isNamed("IT02")).toBeFalse();
		
	});
});