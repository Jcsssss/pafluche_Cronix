# GL02_pafluche

Ce document sert de guide dans la phase d'implémentation du projet

# Type de données standard manipulées:

Entier, Chaine de caractères

# Classes créées spécifiquement au logiciel et leurs méthodes :

HeureMinute(heure,minute) : isValidHour, isEqual, isBeforeEqual, isAfterEqual, toString

CreneauEnseignement(type,capacity,day,hourStart,hourEnd,subgroup,room): whichIsFirst, whichIsLast, doesntOverlap, toString, dayToNumber

Cours(nomCours,listeCreneauEnseignement) : addCreneauEnseignement, isNamed

# Format de données:

iCalendar, CRU

# Aide et Installation

# Dépendances

"@caporal/core": "^2.0.7",
"colors": "^1.4.0",
"vega": "^6.2.0",
"vega-lite": "^6.4.1"

# Tests et jeux de données fournis

Cours_spec : Pour un cours donné, on teste l'ajout d'un créneau d'enseignment précis dans sa liste de créneaux et le nom de ce cours

CreneauEnseignement_spec : Pour un créneau initial, on vérifie sa création et la collision avec d'autres créneaux d'enseignement

HeureMinute_spec : Pour une heure de cours donné, on teste sa validité; si elle est avant, après ou égale par rapport à une autre heure
