# GL02_pafluche

Ce document sert de guide dans la phase d'implémentation du projet

# Type de données standard manipulées:

Entier, Chaine de caractères

# Classes créées spécifiquement au logiciel et leurs méthodes :

HeureMinute(heure,minute) : isValidHour, isEqual, isBeforeEqual, isAfterEqual, toString

CreneauEnseignement(type,capacity,day,hourStart,hourEnd,subgroup,room) : whichIsFirst, whichIsLast, doesntOverlap, toString, dayToNumber

Cours(nomCours,listeCreneauEnseignement) : addCreneauEnseignement, isNamed

FileManager(folders,index,root) : findFileWithCourse, initialize, next, hasNext, dataConsistency

# Format de données:

iCalendar, CRU

# Aide

caporalCli.js <command> [ARGUMENTS] [OPTIONS]

COMMANDS — Type 'caporalCli.js help <command>' to get some help about a command

    check                                Check if <file> is a valid CRU file
        argument: <file>                 The file to check with cru parser
        options : -s, --showSymbols      log the analyzed symbol at each step
                  -t, --showTokenize     log the tokenization results


    find_room                            Find all the rooms used by <courseName>
        argument: <courseName>           The course's name


    find_room_size                       Find the maximum capacity of <room>
        argument: <room>                 The room's name


    check_consistency                    Check if no timeslots overlap
        option: -s, --showOverlapped     log the overlapped data


    check_availability_room              Check when <room> is available
        argument: <room>                 The room's name


    check_availability_time_range        Check which rooms are free for a given <day> and <timeRange>
        argument: <day>                  The day of the time range to check
                  <timeRange>            The time range to check (e.g. 10:00-12:00)


    generate_iCalendar                   generate iCalendar file from your timetable


    visualize_occupation                 visualize occupation rate of rooms


    sort_capacity                        sort rooms by capacity

GLOBAL OPTIONS

    -h, --help                           Display global help or command-related help.
    -V, --version                        Display version.
    --no-color                           Disable use of colors in output.
    -v, --verbose                        Verbose mode: will also output debug messages.
    --quiet                              Quiet mode - only displays warn and error messages.
    --silent                             Silent mode: does not output anything, giving no
                                         indication of success or failure other than the exit
                                         code.

# Dépendances

"@caporal/core": "^2.0.7",
"colors": "^1.4.0",
"vega": "^6.2.0",
"vega-lite": "^6.4.1"

# Tests

Cours_spec : Pour un cours donné, on teste l'ajout d'un créneau d'enseignment précis dans sa liste de créneaux et le nom de ce cours

CreneauEnseignement_spec : Pour un créneau initial, on vérifie sa création et la collision avec d'autres créneaux d'enseignement

HeureMinute_spec : Pour une heure de cours donné, on teste sa validité; si elle est avant, après ou égale par rapport à une autre heure

FileManager_spec : On teste le parcours à travers la liste des dossiers, la recherche un fichier de format CRU à partir d'un nom de cours

# Jeux de données fournis

Les fichiers de format CRU sont classés par ordre alphabétique du nom des cours, stockés dans les dossiers SujetA_data et overlappedData. Ces fichiers contenant les emplois de temps fictifs, ils constituent nos jeux de données.

# Installation

$ npm install
