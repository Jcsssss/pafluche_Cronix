const HeureMinute = require('../HeureMinute');

describe("Test of HeureMinute class", function(){
	
	beforeAll(function() {

        this.h1 =9;
        this.m1 =15;
		this.hm1 = new HeureMinute(this.h1,this.m1);

	});
	
	it("can create a new HeureMinute", function(){
		
		expect(this.hm1).toBeDefined();
		// toBe is === on simple values
        console.log(this.hm1.heure);
		expect(this.hm1.heure).toBe(this.h1);
        expect(this.hm1.minute).toBe(this.m1);
		expect(this.hm1).toEqual(jasmine.objectContaining({heure: 9}));
		
	});
	
	it("can check if valid hour minute", function(){
		
        let hm2 = new HeureMinute("25","0");
        let hm3 = new HeureMinute("1","60");
        
        let hm4 = new HeureMinute("-1","0");
        let hm5 = new HeureMinute("1","-25");

		expect(this.hm1.isValidHour()).toBeTrue();

        expect(hm2.isValidHour()).toBeFalse();
        expect(hm3.isValidHour()).toBeFalse();
        expect(hm4.isValidHour()).toBeFalse();
        expect(hm5.isValidHour()).toBeFalse();

	});

	it("can check if one HeureMinute is lower or equal than another", function(){
		
        let hm2 = new HeureMinute("10","0");
        let hm3 = new HeureMinute("9","30");
        let hm4 = new HeureMinute("9","15");

        expect(this.hm1.isBeforeEqual(hm2)).toBeTrue;
        expect(hm2.isBeforeEqual(this.hm1)).toBeFalse;

        expect(this.hm1.isBeforeEqual(hm3)).toBeTrue;
        expect(hm3.isBeforeEqual(this.hm1)).toBeFalse;

        expect(this.hm1.isBeforeEqual(hm4)).toBeTrue;

	});

    it("can check if one HeureMinute is higher or equal than another", function(){
		
        let hm2 = new HeureMinute("10","0");
        let hm3 = new HeureMinute("9","30");
        let hm4 = new HeureMinute("9","15");

        expect(this.hm1.isAfterEqual(hm2)).toBeFalse;
        expect(hm2.isAfterEqual(this.hm1)).toBeTrue;

        expect(this.hm1.isAfterEqual(hm3)).toBeFalse;
        expect(hm3.isAfterEqual(this.hm1)).toBeTrue;

        expect(this.hm1.isAfterEqual(hm4)).toBeTrue;

	})

	
});