var Cours = require('./Cours');
var CreneauEnseignement = require('./CreneauEnseignement');
var HeureMinute = require('./HeureMinute')

var CruParser = function(sTokenize, sParsedSymb){
	// The list of CreneauEnseignement parsed from the input file.
	this.parsedCours = [];
	this.symb  = ["+","1","P","H","S","/"];
	this.showTokenize = sTokenize;
	this.showParsedSymbols = sParsedSymb;
	this.errorCount = 0;
}

// Parser procedure

// tokenize : tranform the data input into a list
// <eol> = CRLF
CruParser.prototype.tokenize = function(data){
	var separator = /(\r\n|=|,|-| |:)/;
	data = data.split(separator);
	data = data.filter((val, idx) => !val.match(separator)); 					
	return data;
}

// parse : analyze data by calling the first non terminal rule of the grammar
CruParser.prototype.parse = function(data){
	var tData = this.tokenize(data);
	if(this.showTokenize){
		console.log(tData);
	}
	this.listCours(tData);
}


// Parser operand

CruParser.prototype.errMsg = function(msg, input){
	this.errorCount++;
	console.log("Parsing Error ! on "+input+" -- msg : "+msg);
}

// Read and return a symbol from input
CruParser.prototype.next = function(input){
	var curS = input.shift();
	if(this.showParsedSymbols){
		console.log(curS);
	}
	return curS
}

// accept : verify if the arg s is part of the language symbols.
CruParser.prototype.accept = function(s){
	var idx = this.symb.indexOf(s);
	// index 0 exists
	if(idx === -1){
		this.errMsg("symbol "+s+" unknown", [" "]);
		return false;
	}

	return idx;
}



// check : check whether the arg elt is on the head of the list
CruParser.prototype.check = function(s, input){
	//console.log(input);
	if(this.accept(input[0]) == this.accept(s)){
		return true;	
	}
	return false;
}

// expect : expect the next symbol to be s.
CruParser.prototype.expect = function(s, input){
	if(s == this.next(input)){
		console.log("Reckognized! "+s)
		return true;
	}else{
		this.errMsg("symbol "+s+" doesn't match", input);
	}
	return false;
}

// Parser rules

// <liste_cours> = *(<cours>)
CruParser.prototype.listCours = function(input){
	this.cours(input);
}

// <cours> = "+" <nomCours> <eol> *(<CreneauEnseignement>) 
CruParser.prototype.cours = function(input){

	if(this.check("+", input[0][0])){
		
        var nm = this.name(input);
		var c = new Cours(nm);
		this.crenEns(input, c);
		this.parsedCours.push(c);
		
		if(input.length > 0 && input[0]){
			this.cours(input);
		}
		return true;
	}else{
		return false;
	}

}


// <nomCours> = 2ALPHA 2DIGIT
CruParser.prototype.name = function(input){
	var curS = input[0];
	this.next(input);
	if(matched = curS.match(/[A-Za-a]{2}\d{2}/i)){
		return matched[0];
	}else{
		this.errMsg("Invalid name", input);
	}
}


// <CreneauEnseignement> = <index> "," <type> ",P=" <capacity> ",H=" <day> " " <hourStart> "-" <hourEnd> ",F" <subgroup> ",S=" <room> "//" <eol>
CruParser.prototype.crenEns = function (input, curCours){
	if(this.check("1", input)){
	
		var type = this.type(input);
		var capacity = this.capacity(input);
		var day = this.day(input);
		var hourStart = this.hourStart(input);
		var hourEnd = this.hourEnd(input);
		var subgroup = this.subgroup(input);
		var room = this.room(input);

		var creneauEnseignement = new CreneauEnseignement(type,capacity,day,hourStart,hourEnd,subgroup,room);
		
		curCours.addCreneauEnseignement(creneauEnseignement);
		
		if(input[0]){
			if(input.length > 0 && !this.check("+", input[0][0])){
					this.crenEns(input, curCours);
			}
		}
		return true;
	}else{
		return false;
	}
}


// <type> = [A-Z] \d
CruParser.prototype.type=function (input){
	this.expect("1",input)
	var curS = this.next(input);
	if(matched = curS.match(/[A-Z]\d/)){
		return matched[0];
	}else{
		this.errMsg("Invalid type", input);
	}
}

// <capacity> = \d{2}
CruParser.prototype.capacity=function (input){
	this.expect("P",input)
	var curS = this.next(input);
	if(matched = curS.match(/\d{2}/)){
		return matched[0];
	}else{
		this.errMsg("Invalid capacity", input);
	}
}


// <day> = L|MA|ME|J|V
CruParser.prototype.day=function (input){
	this.expect("H",input)

	var curSDay = this.next(input);
	if(matched = curSDay.match(/L|MA|ME|J|V/)){
		return matched[0];
	}else{
		this.errMsg("Invalid day", input);
	}

}


// <hourStart> = <heure> ":" <minute>
CruParser.prototype.hourStart=function (input){

	var heure = this.heure(input);
	var minute = this.minute(input);

	return new HeureMinute(heure,minute);

	
}


// <hourEnd> = <heure> ":" <minute>
CruParser.prototype.hourEnd=function (input){

	var heure = this.heure(input);
	var minute = this.minute(input);

	return new HeureMinute(heure,minute);
}


// <heure> = \d{1,2}
CruParser.prototype.heure=function (input){
	var curS = this.next(input);
	if(matched = curS.match(/\d{1,2}/)){
		return matched[0];
	}else{
		this.errMsg("Invalid heure", input);
	}
}


// <heure> = \d{2}
CruParser.prototype.minute=function (input){
	var curS = this.next(input);
	if(matched = curS.match(/\d{2}/)){
		return matched[0];
	}else{
		this.errMsg("Invalid minute", input);
	}
}

// <subgroup> = \d
CruParser.prototype.subgroup=function (input){
	var curS = this.next(input);
	if(matched = curS.match(/\d/)){
		return matched[0];
	}else{
		this.errMsg("Invalid subgroup", input);
	}
}

// <room> = ([A-Za-a]|\d)+
CruParser.prototype.room=function (input){
	this.expect("S",input)
	var curS = this.next(input);
	
	if(this.check("/",curS[4])){
		if(this.check("/",curS[5])){
			curS=curS.substring(0,4);
			if(matched = curS.match(/([A-Za-a]|\d)+/)){
				return matched[0];
			}else{
				this.errMsg("Invalid room", input);
			}
		}else{
			this.errMsg("No end for this creneau enseignement", input);
		}
	}else{
			this.errMsg("No end for this creneau enseignement", input);
	}


	
}

module.exports = CruParser;

