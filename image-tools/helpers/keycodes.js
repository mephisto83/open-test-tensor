var map = [['ESC', 1],
['1	', 2],
['2	', 3],
['3	', 4],
['4	', 5],
['5	', 6],
['6	', 7],
['7	', 8],
['8	', 9],
['9	', 10],
['0	', 11],
['-	', 12],
['=	', 13],
['BS', 14],
['TAB', 15],
['Q	', 16],
['W	', 17],
['E	', 18],
['R	', 19],
['T	', 20],
['Y	', 21],
['U	', 22],
['I	', 23],
['O	', 24],
['P	', 25],
['[	', 26],
[']	', 27],
['ENTER ', 28],
['L CTRL', 29],
['A	', 30],
['S	', 31],
['D	', 32],
['F	', 33],
['G	', 34],
['H	', 35],
['J	', 36],
['K	', 37],
['L	', 38],
[';	', 39],
['', 40],
['`	', 41],
['L SHIFT', 42],
['\	', 43],
['Z	', 44],
['X	', 45],
['C	', 46],
['V	', 47],
['B	', 48],
['N	', 49],
['M	', 50],
['', 51],
['.	', 52],
['/	', 53],
['R SHIFT	', 54],
['*	', 55],
['L ALT	', 56],
['SPACE	', 57],
['CAPS LOC ', 58],
['F1	', 59],
['F2	', 60],
['F3	', 61],
['F4	', 62],
['F5	', 63],
['F6	', 64],
['F7	', 65],
['F8	', 66],
['F9	', 67],
['F10	', 68],
['command', 3675]].map(x => {
    return [x[0].trim(), x[1]]
})
exports.keymap = map;
var keyobjmap = {};
var keylettermap = {};
map.map(x => {
    keylettermap[x[0]] = x[1];
    keyobjmap[x[1]] = x[0];
})
exports.keyobjmap = keyobjmap;
exports.keylettermap = keylettermap;
// NUM LOCK
// SCROLL L
// HOME 7	
// UP 8	
// PGUP 9	
// -	74	
// LEFT 4	
// 5	76	
// RT ARROW
// +	78	
// END 1	
// DOWN 2	
// PGDN 3	
// INS	82	
// DEL	83	
// 84		
// 85		
// 86		
// F11	87	
// F12	88	
// 89		
// 90		
// 91		
// 92		
// 93		
// 94		
// 95		
// R ENTER	
// R CTRL	
// /	98	
// PRT SCR	
// R ALT	
// 101		
// Home	 
// Up	103	
// PgUp	
// Left	
// Right	
// End	107	
// Down	
// PgDn	
// Insert	
// Del	111	
// 112		
// 113		
// 114		
// 115		
// 116		
// 117		
// 118		
// Pause	