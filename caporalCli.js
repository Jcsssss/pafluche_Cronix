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
	.command('check_availability_room', 'Check when <room> is available')
	.alias('ckavlbr', 'check_availability_room alias')
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

	// check availability of a time range
	.command('check_availability_time_range', 'Check which rooms are free for a given <day> and <timeRange>')
	.alias('ckavlbtr', 'check_availability_time_range alias')
	.argument('<day>', 'The day of the time range to check')
	.argument('<timeRange>', 'The time range to check (e.g. 10:00-12:00)')
	.action(({args,logger})=>{
		const day = (args.day || '').toString().trim().toUpperCase();
		const timeRange = (args.timeRange || '').toString().trim();

		const parts = timeRange.split('-');
		const startStr = parts[0] || '';
		const endStr = parts[1] || '';

		const startParts = startStr.split(':');
		const sh = startParts[0] || '';
		const sm = startParts[1] || '';
		const endParts = endStr.split(':');
		const eh = endParts[0] || '';
		const em = endParts[1] || '';
		
		const slotStart = new HeureMinute(sh, sm);
		const slotEnd = new HeureMinute(eh, em);

		if(!slotStart.isValidHour() || !slotEnd.isValidHour()){
			logger.info('Heure invalide dans le créneau. Ex : "MA 10:00-12:00".');
			return;
		}

		if(slotEnd.isBeforeEqual(slotStart)){
			logger.info('Le créneau horaire de fin doit être après celui de début.');
			return;
		}

		FileManager.initialize();
		let listeCours = [];
		while(FileManager.hasNext()){
			let data = fs.readFileSync(FileManager.next(), 'utf8');
			let analyzer = new CruParser(false, false);
			analyzer.parse(data);
			if(Array.isArray(analyzer.parsedCours)) listeCours.push(...analyzer.parsedCours);
		}

		const rooms = new Set();
		listeCours.forEach((course) => {
			if(course instanceof Cours){
				course.listeCreneauEnseignement.forEach((cr) => {
					if(cr instanceof CreneauEnseignement){
						rooms.add(cr.room);
					}
				});
			}
		});

		if(rooms.size === 0){
			logger.info('Aucune salle trouvée dans la base de données.');
			return;
		}

		const freeRooms = [];

		for(const room of rooms){
			let occupied = false;
			listeCours.forEach((course) => {
				if(occupied) return;
				if(course instanceof Cours){
					course.listeCreneauEnseignement.forEach((cr) => {
						if(occupied) return;
						if(cr instanceof CreneauEnseignement && cr.room === room){
							if(String(cr.day).toUpperCase() === day){
								const requestedSlot = new CreneauEnseignement('', 0, day, slotStart, slotEnd, '', room);
								if(!cr.doesntOverlap(requestedSlot)){
									occupied = true;
								}
							}
						}
					});
				}
			});

			if(!occupied) freeRooms.push(room);
		}

		if(freeRooms.length === 0){
			logger.info('Aucune salle disponible pour le créneau ' + day + ' ' + timeRange);
		}else{
			let msg = 'Salles libres pour ' + day + ' ' + timeRange + ' :\n';
			freeRooms.forEach(r => { msg += r + '\n'; });
			logger.info(msg);
			console.log(freeRooms.length);
		}
		
	})

	// generate iCalendar file
	.command('generate_iCalendar', 'generate iCalendar file from your timetable')
	.alias('gric', 'generate_iCalendar alias')
	.action(({args,logger})=>{
		const readline = require('readline');
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		const question = (query) => new Promise(resolve => rl.question(query, resolve));

		(async () => {
			try {
				// nombre de cours
				const numCoursesStr = await question('Nombre d\'enseignements auxquels vous participez : ');
				const numCourses = parseInt(numCoursesStr);
				if(isNaN(numCourses) || numCourses <= 0){
					logger.info('Nombre invalide d\'enseignements.');
					rl.close();
					return;
				}

				// chaque cours et groupe
				const coursesWithGroups = [];
				for(let i = 0; i < numCourses; i++){
					const courseName = await question(`Nom du cours ${i+1} : `);
					const group = await question(`Groupe pour ${courseName} : `);
					coursesWithGroups.push({ name: courseName.toUpperCase(), group: group });
				}

				// dates de début et fin
				const startDateStr = await question('Date de début (JJ/MM/AAAA) : ');
				const endDateStr = await question('Date de fin (JJ/MM/AAAA) : ');

				const parseDate = (dateStr) => {
					const parts = dateStr.split('/');
					if(parts.length !== 3) return null;
					const d = parseInt(parts[0]);
					const m = parseInt(parts[1]);
					const y = parseInt(parts[2]);
					if(isNaN(d) || isNaN(m) || isNaN(y)) return null;
					return new Date(y, m-1, d);
				};

				const startDate = parseDate(startDateStr);
				const endDate = parseDate(endDateStr);

				if(!startDate || !endDate){
					logger.info('Format de date invalide. Format attendu : JJ/MM/AAAA');
					rl.close();
					return;
				}

				if(endDate < startDate){
					logger.info('La date de fin doit être après la date de début.');
					rl.close();
					return;
				}

				rl.close();

				FileManager.initialize();
				let allCourses = [];
				while(FileManager.hasNext()){
					let data = fs.readFileSync(FileManager.next(), 'utf8');
					let analyzer = new CruParser(false, false);
					analyzer.parse(data);
					if(Array.isArray(analyzer.parsedCours)) allCourses.push(...analyzer.parsedCours);
				}

				const events = [];
				const dayMap = { 'L': 0, 'MA': 1, 'ME': 2, 'J': 3, 'V': 4 };

				for(let reqCourse of coursesWithGroups){
					let courseFound = false;

					for(let course of allCourses){
						if(course instanceof Cours && course.nomCours === reqCourse.name){
							courseFound = true;
							for(let creneau of course.listeCreneauEnseignement){
								console.log(creneau);
								if(creneau instanceof CreneauEnseignement && creneau.subgroup === reqCourse.group){
									events.push({
										courseName: course.nomCours,
										day: creneau.day,
										dayNum: dayMap[creneau.day],
										hourStart: creneau.hourStart,
										hourEnd: creneau.hourEnd,
										room: creneau.room,
										type: creneau.type,
										subgroup: creneau.subgroup
									});
								}
							}
							break;
						}
					}

					if(!courseFound){
						logger.info(`La matière ${reqCourse.name} n'existe pas ou qu'il y a eu une erreur de saisie. Elle n'a pas été incluse.`);
					}
				}

				if(events.length === 0){
					logger.info('Aucun créneau n\'a pu être trouvé pour les matières et groupes spécifiés.');
					return;
				}

				const generateICalendar = () => {
					let ical = 'BEGIN:VCALENDAR\r\n';
					ical += 'VERSION:2.0\r\n';
					ical += 'PRODID:-//GL02 CRU Parser//FR\r\n';
					ical += `CALSCALE:GREGORIAN\r\n`;
					ical += `METHOD:PUBLISH\r\n`;

					const currentDate = new Date(startDate);
					const weekDays = ['L', 'MA', 'ME', 'J', 'V'];

					while(currentDate <= endDate){
						// Only process Monday through Friday
						const dayOfWeek = currentDate.getDay();
						if(dayOfWeek >= 1 && dayOfWeek <= 5){
							const dayName = weekDays[dayOfWeek - 1];
							
							for(const event of events){
								if(event.day === dayName){
									const eventStart = new Date(currentDate);
									eventStart.setHours(event.hourStart.heure, event.hourStart.minute, 0);
									const eventEnd = new Date(currentDate);
									eventEnd.setHours(event.hourEnd.heure, event.hourEnd.minute, 0);

									const formatDateTime = (d) => {
										const pad = (n) => (n < 10 ? '0' : '') + n;
										return d.getFullYear() + pad(d.getMonth()+1) + pad(d.getDate()) + 'T' +
											pad(d.getHours()) + pad(d.getMinutes()) + '00';
									};

									const uid = `${event.courseName}-${formatDateTime(eventStart)}@glpafluche`;

									ical += 'BEGIN:VEVENT\r\n';
									ical += `UID:${uid}\r\n`;
									ical += `DTSTAMP:${formatDateTime(new Date())}\r\n`;
									ical += `DTSTART:${formatDateTime(eventStart)}\r\n`;
									ical += `DTEND:${formatDateTime(eventEnd)}\r\n`;
									ical += `SUMMARY:${event.courseName} (${event.type})\r\n`;
									ical += `LOCATION:${event.room}\r\n`;
									ical += `DESCRIPTION:Groupe: ${event.subgroup}\r\n`;
									ical += 'END:VEVENT\r\n';
								}
							}
						}

						currentDate.setDate(currentDate.getDate() + 1);
					}

					ical += 'END:VCALENDAR\r\n';
					return ical;
				};

				const iCalContent = generateICalendar();
				const fileName = 'timetable.ics';
				fs.writeFileSync(fileName, iCalContent, 'utf8');

				logger.info(`Fichier iCalendar généré avec succès : ${fileName}`);

			} catch (err) {
				logger.info('Erreur lors de la génération du fichier iCalendar : ' + err.message);
			}
		})();

	})


cli.run(process.argv.slice(2));
