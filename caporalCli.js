const fs = require('fs');
const colors = require('colors');
const CruParser = require('./CruParser.js');
const FileManager = require('./FileManager.js');
const CreneauEnseignement = require('./CreneauEnseignement.js');
const Cours = require('./Cours.js');

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
	.command('find_room', 'Find all the rooms used by a course')
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
	.command('find_room_size', 'Find the size of a room')
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
				
		
	

cli.run(process.argv.slice(2));
