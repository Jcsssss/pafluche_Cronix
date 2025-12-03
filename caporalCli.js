const fs = require('fs');
const colors = require('colors');
const CruParser = require('./CruParser.js');
const FileManager = require('./FileManager.js');

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

		filePath = FileManager.findFileWithCourse(args.courseName);
		if (filePath!=-1){
			fs.readFile(filePath, 'utf8', function (err,data) {
			if (err) {
				return logger.warn(err);
			}
			var analyzer = new CruParser(options.showTokenize, options.showSymbols);
			analyzer.parse(data);

		});
		}else{
			logger.info("Le cours "+ args.courseName +" ne figure pas dans la base de données");
		}

	})

cli.run(process.argv.slice(2));
