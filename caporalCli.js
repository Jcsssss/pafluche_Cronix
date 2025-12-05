const fs = require('fs');
const colors = require('colors');
const CruParser = require('./CruParser.js');
const FileManager = require('./FileManager.js');
const CreneauEnseignement = require('./CreneauEnseignement.js');
const Cours = require('./Cours.js');
const HeureMinute = require('./HeureMinute.js');

const vg = import('vega');
const vegalite = import('vega-lite');

const cli = require("@caporal/core").default;

cli
	.version('cru-parser-cli')
	// check Cru
	.command('check', 'Check if <file> is a valid CRU file')
	.argument('<file>', 'The file to check with cru parser')
	.option('-s, --showSymbols', 'log the analyzed symbol at each step', { validator : cli.BOOLEAN, default: false })
	.option('-t, --showTokenize', 'log the tokenization results', { validator: cli.BOOLEAN, default: false })
	.action(({args, options, logger}) => {
		
		fs.readFile(args.file, 'utf8', function (err,data) {
			if (err) {
				return logger.warn(err);
			}
	  
			var analyzer = new CruParser(options.showTokenize, options.showSymbols);
			analyzer.parse(data);
			
			if(analyzer.errorCount === 0){
				logger.info("The .cru file is a valid cru file".green);
			}else{
				logger.info("The .cru file contains error".red);
			}
			
			logger.debug(analyzer.parsedCours);

		});

			
	})

	//Find rooms associated to a course
	.command('find_room', 'Find all the rooms used by <courseName>')
	.alias('fdrm', 'find_room alias')
	.argument('<courseName>', 'The courses\'s name')
	.action(({args, logger})=>{
		let filePath = FileManager.findFileWithCourse(args.courseName);
		if (filePath!=-1){
			fs.readFile(filePath, 'utf8', function (err,data) {
			if (err) {
				return logger.warn(err);
			}
			var analyzer = new CruParser(false, false);
			analyzer.parse(data);

			const listeCours = analyzer.parsedCours;
			let listeSalle = [];
			let courseFound = false;
			let message;

			listeCours.forEach((element) => {
				if(element instanceof Cours){
					if(element.nomCours ===args.courseName){
						courseFound = true;
						message = ("Salles utilisées par le cours " + args.courseName + " :\n");
						element.listeCreneauEnseignement.forEach((element2) => {
							if(element2 instanceof CreneauEnseignement){
								if(!(listeSalle.includes(element2.room))){
									listeSalle.push(element2.room)
									message = message + (element2.room + "\n");
								}
							}
						})
					}
				}
				
			});
			if(courseFound){
				logger.info(message);
			}else{
				logger.info("Le cours "+ args.courseName +" ne figure pas dans la base de données.")
			}

		});
		}else{
			logger.info("Le cours "+ args.courseName +" ne figure pas dans la base de données");
		}

	})

	//Find rooms size
	.command('find_room_size', 'Find the maximum capacity of <room>')
	.alias('fdrmsz', 'find_room alias')
	.argument('<room>', 'The room\'s name')
	.action(({args, logger})=>{
		FileManager.initialize();

		let listeCours=[];

		while(FileManager.hasNext()){

			let data = fs.readFileSync(FileManager.next(), 'utf8');
			let analyzer = new CruParser(false, false);
			analyzer.parse(data);
			listeCours.push(analyzer.parsedCours);
		}

		//logger.info(JSON.stringify(listeCours));

		let roomFound = false;

		let maxCapacityFound = 0;

		listeCours.forEach((fileCourses) => {
			fileCourses.forEach((course) =>{
				
				if(course instanceof Cours){
					course.listeCreneauEnseignement.forEach((creneauEnseignement) => {
						if(creneauEnseignement instanceof CreneauEnseignement){
							if(creneauEnseignement.room===args.room){
								roomFound=true;
								if(creneauEnseignement.capacity>maxCapacityFound){
									maxCapacityFound=creneauEnseignement.capacity;
								}
							}
						}
					})
				}
			})
		});
		if(roomFound){
			logger.info("La capacité maximale de la salle "+args.room+" trouvée dans la base de données est de "+maxCapacityFound);
		}else{
			logger.info("La salle "+ args.room +" ne figure pas dans la base de données.")
		}
	})
			
	//Check database consistency : no overlapping timeslot
	.command('check_consistency', 'Check if no timeslots overlap')
	.alias('ckcstc', 'find_room alias')
	.option('-s, --showOverlapped', 'log the overlapped data', { validator : cli.BOOLEAN, default: false })
	.action(({options,logger})=>{
		
		if(FileManager.dataConsistency(options.showOverlapped)){
			logger.info("Aucun créneau ne se superpose dans la base de données");
		}else{
			logger.info("Des créneaux se superposent dans la base de données.\nIl est recommandé de voir lesquels en exécutant la même commande avec l'argument -s.\nMerci de corriger la base de données avant tout autre utilisation de cette dernière.")
		}
	})

	// check availability of a room
	.command('check_availability', 'Check when a room is available')
	.alias('ckavlb', 'check_availability alias')
	.argument('<room>', 'The room\'s name')
	.action(({args,logger})=>{

		FileManager.initialize();

		let listeCours = [];

		while(FileManager.hasNext()){
			let data = fs.readFileSync(FileManager.next(), 'utf8');
			let analyzer = new CruParser(false, false);
			analyzer.parse(data);
			if(Array.isArray(analyzer.parsedCours)){
				listeCours.push(...analyzer.parsedCours);
			}
		}

		let roomFound = false;
		let roomOccupation = [[],[],[],[],[]];

		listeCours.forEach((course) => {
			if(course instanceof Cours){
				course.listeCreneauEnseignement.forEach((creneau) => {
					if(creneau instanceof CreneauEnseignement && creneau.room === args.room){
						roomFound = true;
						const d = creneau.dayToNumber();
						if(typeof d === 'number'){
							roomOccupation[d].push({ start: creneau.hourStart, end: creneau.hourEnd });
						}
					}
				});
			}
		});

		if(!roomFound){
			logger.info("La salle rentrée n'existe pas");
			return;
		}

		const dayFull = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi'];
		let anyFree = false;

		for(let di = 0; di < roomOccupation.length; di++){
			const intervals = roomOccupation[di];

			const conv = intervals.map(it => ({ s: it.start, e: it.end }));
			conv.sort((a,b) => {
				if(a.s.heure === b.s.heure) return a.s.minute - b.s.minute;
				return a.s.heure - b.s.heure;
			});

			const merged = [];
			for(const iv of conv){
				if(merged.length === 0){
					merged.push({ s: iv.s, e: iv.e });
					continue;
				}
				const last = merged[merged.length - 1];
				if(iv.s.isBeforeEqual(last.e)){
					if(iv.e.isAfterEqual(last.e)){
						last.e = iv.e;
					}
				}else{
					merged.push({ s: iv.s, e: iv.e });
				}
			}

			// définit le début et la fin de la journée
			const DAY_START = new HeureMinute(8,0);
			const DAY_END = new HeureMinute(20,0);

			const frees = [];

			if(DAY_START.isBeforeEqual(merged[0].s) && !DAY_START.isEqual(merged[0].s)){
				frees.push({ s: DAY_START, e: merged[0].s });
			}

			for(let i=0;i<merged.length-1;i++){
				if(merged[i].e.isBeforeEqual(merged[i+1].s) && !merged[i].e.isEqual(merged[i+1].s)){
					frees.push({ s: merged[i].e, e: merged[i+1].s });
				}
			}

			if(merged[merged.length-1].e.isBeforeEqual(DAY_END) && !merged[merged.length-1].e.isEqual(DAY_END)){
				frees.push({ s: merged[merged.length-1].e, e: DAY_END });
			}

			if(frees.length === 0){
				logger.info(dayFull[di] + ' : aucune plage libre');
			}else{
				anyFree = true;
				let msg = dayFull[di] + ' : plages libres ->\n';
				frees.forEach((f) => {
					msg += f.s.toString() + ' - ' + f.e.toString() + '\n';
				});
				logger.info(msg);
			}
		}

		if(!anyFree){
			logger.info("La salle n'a plus de créneaux libres");
		}
	})


cli.run(process.argv.slice(2));
