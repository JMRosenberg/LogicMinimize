/* 
  CAD tool for Logic Minimization
  Created By Jacob Rosenberg
  For Tufts EE26, created 3-26-14
*/

inputStr = "m(1,5,3)+d(2,4)";
minterms = [];
dontcares = [];

// Parse extracts the minterms and don't cares
// Terms are placed into appropriate arrays
function parse () {
    var splitStr = inputStr.split("+");
    var minStr = splitStr[0].substr(1);
    var dcStr = "";
    if(splitStr[1] != undefined) {
	dcStr = splitStr[1].substr(1);
    }
    for(i = 1; i < minStr.length; i += 2){
	minterms.push(parseInt(minStr[i]));
    }
    for(i = 1; i < dcStr.length; i += 2){
	dontcares.push(parseInt(dcStr[i]));
    }
}

parse();