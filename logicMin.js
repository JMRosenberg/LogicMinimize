/* 
  CAD tool for Logic Minimization
  Created By Jacob Rosenberg
  For Tufts EE26, created 3-26-14
*/

inputStr = "";
minterms = [];
maxterms = [];
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
    setPOS();
    toBin();
    minterms.sort().sort(moreOnes); // Sort in ascending,
    dontcares.sort().sort(moreOnes); // by number of 1s
    allterms = minterms.concat(dontcares);
    allterms.sort().sort(moreOnes);
    combined.push(allterms);
    //START
    combine();
    removeCovered();
    removeExtras();
    removeDuplicates();
    //END
    printResults();
    cleanPrint();
    finalString = ('=' + finalString);
    document.getElementById("orig").innerHTML = inputStr;
    document.getElementById("responseSOP").innerHTML = finalString;
    tempterms = [];
    combined = [];
    finalString = "=";
    //DO AGAIN
    //invertAll(); //-----------------------
    allterms = maxterms.concat(dontcares);
    allterms.sort().sort(moreOnes);
    combined.push(allterms);
    combine();
    removeCovered();
    removeDuplicates();
    //END
    printResultsPOS(); //-----------------
    cleanPrintPOS(); //-------------------
    document.getElementById("responsePOS").innerHTML = finalString;
    inputStr = "";
    minterms = [];
    maxterms = [];
    dontcares = [];
    allterms = [];
    tempterms = [];
    combined = [];
    numTerms = 0;
    finalString = "";
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

function setPOS () {
    for (termNum = 0; termNum < Math.pow(2, numTerms); termNum++) {
	if (minterms.indexOf(termNum.toString()) > -1) {
	    continue;
	}
	if (dontcares.indexOf(termNum.toString()) > -1) {
	    continue;
	}
	maxterms.push(termNum);
    }
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
    for(i = 0; i < maxterms.length; i++){
	maxterms[i] = parseInt(maxterms[i]).toString(2);
	while(maxterms[i].length < numTerms){
	    maxterms[i] = '0' + maxterms[i];
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
		    finalString += "'";
		}
		if (combined[cube][term][literal] == '0') {
		    finalString += String.fromCharCode('A'.charCodeAt(0) + literal);
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
    for (character = 0; character < finalString.length - 1; character++) {
	if (finalString[character] == '+') {
	    if (finalString[character+1] == ')') {
		finalString = (finalString.substr(0, character) + finalString.substr(character + 1));
		cleanPrintPOS();
	    }
	}
    }
    for (character = 0; character < finalString.length - 1; character++) {
	if (finalString[character] == '(') {
	    if (finalString[character+1] == ')') {
		finalString = (finalString.substr(0, character) + finalString.substr(character + 2));
		cleanPrintPOS();
	    }
	}
    }
    for (character = 0; character < finalString.length - 1; character++) {
	if (finalString[character] == '+') {
	    if (finalString[character+1] == '+') {
		finalString = (finalString.substr(0, character) + finalString.substr(character + 1));
		cleanPrintPOS();
	    }
	}
    }
    for (character = 0; character < finalString.length - 1; character++) {
	if (finalString[character] == '(') {
	    if (finalString[character+1] == '+') {
		finalString = (finalString.substr(0, character + 1) + finalString.substr(character + 2));
		cleanPrintPOS();
	    }
	}
    }
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

function removeExtras () {
    mintemp = minterms;
    needed = [];
    for (mterm = 0; mterm < mintemp.length; mterm++) {
	for (chk1 = combined.length-1; chk1 >= 0; chk1--) {
	    for (chk2 = combined[chk1].length-1; chk2 >= 0; chk2--) {
		if (allXs(combined[chk1][chk2])) {
		    continue;
		}
		checked = true;
		for (chk3 = 0; chk3 < combined[chk1][chk2].length; chk3++) {
		    if (combined[chk1][chk2][chk3] != 'X') {
			if (combined[chk1][chk2][chk3] != mintemp[mterm][chk3]) {
			    checked = false;
			}
		    }
		}
		if (checked) {
		    mintemp[mterm] = '2'
		    needed.push(combined[chk1][chk2]);
		}
	    }
	}
    }
    combined = [needed];
}

function allXs (term) {
    for (ax1 = 0; ax1 < term.length; ax1++) {
	if (term[ax1] != 'X') {
	    return false;
	}
    }
    return true;
}
