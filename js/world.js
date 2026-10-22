/* Python Quest — monde STEP 1. Toutes les grilles sont rectangulaires. */
(function(){
  const open = '.', wall = '#';
  const village = [
    '####################',
    '#....H....H....H...#',
    '#..................#',
    '#..D...........D...#',
    '#..................#',
    '#....H....H........#',
    '#..................#',
    '#..................#',
    '###D##########D#####',
    '#..................#',
    '#..................#',
    '####################'
  ];
  const forest = [
    '####################', '#..F.......T.......#', '#..................#',
    '#....###...........#', '#....#.............#', '#....#.............#',
    '#....#####.........#', '#..................#', '#.............L....#',
    '#..................#', '#..................#', '####################'
  ];
  const room = [
    '############', '#..........#', '#..........#', '#....N.....#',
    '#..........#', '#..........#', '#..........#', '#..........#',
    '#.....E....#', '############'
  ];
  const maps = {
    village:{id:'village',name:'Village de Clairval',emoji:'🏘️',grid:village,exits:{'8,3':{to:'forest',x:1,y:8,label:'Sentier de la forêt'},'8,14':{to:'crypt',x:5,y:8,label:'Entrée de la crypte'},'5,4':{to:'tower',x:5,y:8,label:'Tour mystique'}}},
    forest:{id:'forest',name:'Forêt d’Émeraude',emoji:'🌲',grid:forest,exits:{'1,2':{to:'village',x:3,y:8,label:'Retour au village'},'1,9':{to:'tower',x:5,y:8,label:'Portail de la tour'},'8,14':{to:'labyrinth',x:5,y:8,label:'Entrée du labyrinthe'}}},
    crypt:{id:'crypt',name:'Crypte des Boucles',emoji:'🪦',grid:room,exits:{'8,5':{to:'village',x:14,y:8,label:'Sortie vers le village'}}},
    tower:{id:'tower',name:'Tour des Fonctions',emoji:'🗼',grid:room,exits:{'8,5':{to:'village',x:4,y:6,label:'Escalier vers le village'}}},
    labyrinth:{id:'labyrinth',name:'Labyrinthe des Listes',emoji:'🌀',grid:room,exits:{'8,5':{to:'forest',x:14,y:7,label:'Sortie vers la forêt'}}}
  };
  const houses = [
    {id:'library',name:'Bibliothèque de Lune',map:['##########','#........#','#..N.....#','#........#','#....E...#','##########'],npc:'librarian',topic:'variables'},
    {id:'forge',name:'Forge des Braises',map:['##########','#........#','#.....N..#','#........#','#....E...#','##########'],npc:'blacksmith',topic:'increment'},
    {id:'lab',name:'Laboratoire de Cristal',map:['##########','#..N.....#','#........#','#........#','#....E...#','##########'],npc:'alchemist',topic:'syntax'},
    {id:'towerhouse',name:'Maison du Vieux Sorcier',map:['##########','#........#','#....N...#','#........#','#....E...#','##########'],npc:'wizard',topic:'while'}
  ];
  window.WORLD={maps,houses,topics:['variables','reassignment','increment','types','conversion','print','strings','comparisons','if','elif','else','syntax','indentation','while','for','range','lists','dicts','functions','return','errors']};
})();
