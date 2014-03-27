/* 
  CAD tool for Logic Minimization
  Created By Jacob Rosenberg
  For Tufts EE26, created 3-26-14
*/

inputStr = "m(1,5,3)+d(2,4)";
minterms = [];
dontcares = [];
numTerms = 0;

function run () {
    parse();
    toBin();
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

run();