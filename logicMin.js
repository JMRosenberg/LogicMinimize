/* 
  CAD tool for Logic Minimization
  Created By Jacob Rosenberg
  For Tufts EE26, created 3-26-14
*/

inputStr = "";
minterms = [];
dontcares = [];
allterms = [];
tempterms = [];
combined = [];
numTerms = 0;
finalString = "";

function run (input) {
    inputStr = input; // Set Input
    document.getElementById("myinput").value = ''; // Clear Box
    parse();
    toBin();
    minterms.sort().sort(moreOnes); // Sort in ascending,
    dontcares.sort().sort(moreOnes); // by number of 1s
    allterms = minterms.concat(dontcares);
    allterms.sort().sort(moreOnes);
    combined.push(allterms);
    //START
    combine();
    removeCovered();
    removeDuplicates();
    //END
    printResults();
    cleanPrint();
    finalString = ('=' + finalString);
    document.getElementById("orig").innerHTML = inputStr;
    document.getElementById("responseSOP").innerHTML = finalString;
    tempterms = [];
    combined = [];
    finalString = "";
    //DO AGAIN
    invertAll(); //-----------------------
    combine();
    removeCovered();
    removeDuplicates();
    //END
    printResultsPOS(); //-----------------
    cleanPrintPOS(); //-------------------
    document.getElementById("responsePOS").innerHTML = finalString;
    tempterms = [];
    combined = [];
    finalString = "";
    numTerms = 0;
}

// Parse extracts the minterms and don't cares
// Terms are placed into appropriate arrays
function parse () {
    var splitStr = inputStr.split("+");
    var minStr = splitStr[0].substr(2, splitStr[0].length - 3);
    var dcStr = "";
    var max = 0;
    minterms = minStr.split(",");
    if(splitStr[1] != undefined) {
	dcStr = splitStr[1].substr(2, splitStr[1].length - 3);
	dontcares = dcStr.split(",");
    }
    max = Math.max(Math.max.apply(Math, minterms), Math.max.apply(Math, dontcares));
    numTerms = Math.ceil(Math.log(max+1) / Math.log(2));
}

// ToBin converts minterms to corresponding binary
function toBin () {
    for(i = 0; i < minterms.length; i++){
	minterms[i] = parseInt(minterms[i]).toString(2);
	while(minterms[i].length < numTerms){
	    minterms[i] = '0' + minterms[i];
	}
    }
    for(i = 0; i < dontcares.length; i++){
	dontcares[i] = parseInt(dontcares[i]).toString(2);
	while(dontcares[i].length < numTerms){
	    dontcares[i] = '0' + dontcares[i];
	}
    }
}

function moreOnes (a, b) {
    return ones(a) - ones(b);
}

function ones (x) {
    var num = 0;
    for (i = 0; i < x.length; i++) {
	if (x[i] == 1) {
	    num++;
	}
    }
    return num;
}

function combine () {
    var foundone = true;
    var l = 0;
    while (foundone) {
	foundone = false;
	for (i = 0; i < combined[l].length; i++) {
	    for (j = i + 1; j < combined[l].length; j++) {
		var diff = diffBits(combined[l][i], combined[l][j]);
		if (diff == 1) {
		    addDC(i, j, l);
		    foundone = true;
		}
	    }
	}
	l++;
	combined.push(tempterms);
	tempterms = [];
    }
}

function diffBits (x, y) {
    var diff = 0;
    for (b = 0; b < x.length; b++) {
	if (x[b] != y[b]) {
	    diff++;
	}
    }
    return diff;
}

// Adds Don't Care bit where two terms intersect
function addDC (x, y, z) {
    for (l = 0; l < combined[z][x].length; l++) {
	if (combined[z][x][l] != combined[z][y][l]) {
	    tempterms.push(combined[z][x].substr(0,l) + 'X' + combined[z][x].substr(l+1));
	    //allterms[x] = allterms[x].substr(0,l) + 'X' + allterms[x].substr(l+1);
	    //allterms[y] = allterms[y].substr(0,l) + 'X' + allterms[y].substr(l+1);
	    return;
	}
    }
}

function removeCovered () {
    for (i = 0; i < (combined.length - 1); i++) {
	for (j = 0; j < combined[i].length; j++) {
	    for (k = 0; k < combined[i+1].length; k++) {
		if (diffBits(combined[i][j], combined[i+1][k]) == 1) {
		    if (combined[i+1][k] != undefined) {
			combined[i][j] = "X";
		    }
		}
	    }
	}
    }
}

function printResults () {
    notBlank = false;
    for (cube = 0; cube < combined.length; cube++) {
	for (term = 0; term < combined[cube].length; term++) {
	    for (literal = 0; literal < combined[cube][term].length; literal++) {
		if (combined[cube][term][literal] == '1') {
		    finalString += String.fromCharCode('A'.charCodeAt(0) + literal);
		}
		if (combined[cube][term][literal] == '0') {
		    finalString += String.fromCharCode('A'.charCodeAt(0) + literal);
		    //finalString += (parseInt('A') + literal);
		    finalString += "'";
		}
	    }
	    finalString += "+";
	}
    }
}

function printResultsPOS () {
    for (cube = 0; cube < combined.length; cube++) {
	for (term = 0; term < combined[cube].length; term++) {
	    finalString += '('
	    for (literal = 0; literal < combined[cube][term].length; literal++) {
		if (literal != 0) {
		    finalString += '+';
		}
		if (combined[cube][term][literal] == '1') {
		    finalString += String.fromCharCode('A'.charCodeAt(0) + literal);
		}
		if (combined[cube][term][literal] == '0') {
		    finalString += String.fromCharCode('A'.charCodeAt(0) + literal);
		    //finalString += (parseInt('A') + literal);
		    finalString += "'";
		}
	    }
	    finalString += ')';
	}
    }    
}

function removeDuplicates () {
    for (cube = 0; cube < combined.length; cube++) {
	for (term1 = 0; term1 < combined[cube].length; term1++) {
	    for (term2 = term1 + 1; term2 < combined[cube].length; term2++) {
		if (combined[cube][term1] == combined[cube][term2]) {
		    combined[cube][term1] = "X";
		}
	    }
	}
    }
}

function cleanPrint () {
    if (finalString[0] == '+') {
	finalString = finalString.substr(1);
	cleanPrint();
    }
    if (finalString[finalString.length - 1] == '+') {
	finalString = finalString.substr(0, finalString.length - 1);
	cleanPrint();
    }
    for (character = 0; character < finalString.length - 1; character++) {
	if (finalString[character] == '+') {
	    if (finalString[character+1] == '+') {
		finalString = (finalString.substr(0, character) + finalString.substr(character + 1));
		cleanPrint();
	    }
	}
    }
}

function cleanPrintPOS () {
    return;
}

function invertAll () {
    for (inv1 = 0; inv1 < minterms.length; inv1++) {
	invertStr = "";
	for (inv2 = 0; inv2 < minterms[inv1].length; inv2++) {
	    if (minterms[inv1][inv2] == '1') {
		invertStr += '0';
	    }
	    if (minterms[inv1][inv2] == 0) {
		invertStr += '1';
	    }
	}
	minterms[inv1] = invertStr;
    }
    allterms = minterms.concat(dontcares);
    allterms.sort().sort(moreOnes);
    combined.push(allterms);
}