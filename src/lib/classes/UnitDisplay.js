


function getNibbleDoubleDisplay(quadrant, value){
	
	// Make odd so that there is a center line for the axis.
	var boxWidth = 29;
	
	var centerLine = Math.ceil(boxWidth / 2);
	
	var topPos = null;
	var leftPos = null;
	var cursorColor = '#000000';
	
	// Make odd so that it can occupy the correct position with symmetry.
	var cursorWidth = 3;
	
	// Place coordinates relative to a 1-based system. 
	// There are 14 units to the left.  1-14
	// There is a center axis in the middle. 15
	// Then comes the last 14 units.  16-29
	if(quadrant == "N"){
		leftPos = centerLine;
		topPos = 1;
	}
	else if(quadrant == "S"){
		leftPos = centerLine;
		topPos = boxWidth;
	}
	else if(quadrant == "W"){
		leftPos = 1;
		topPos = centerLine;
	}
	else if(quadrant == "E"){
		leftPos = boxWidth;
		topPos = centerLine;
	}
	else if(quadrant == "NE"){
		leftPos = centerLine + 15 - value;
		topPos = 15 - value;
		cursorColor = '#CC0000';
	}
	else if(quadrant == "NW"){
		leftPos = 15 - value;
		topPos = centerLine - 15 + value;
		cursorColor = '#CC0000';
	}
	else if(quadrant == "SW"){
		leftPos = centerLine - 15 + value;
		topPos = centerLine + value;
		cursorColor = '#CC0000';
	}
	else if(quadrant == "SE"){
		leftPos = centerLine + value;
		topPos = centerLine + 15 - value;
		cursorColor = '#CC0000';
	}
	else{
		throw "Unknown quadrant name in method getNibbleDoubleDisplay()";
	}
	
	var cursorOffset = Math.floor(cursorWidth / 2);
	var centerLineCoord = centerLine;
	
	// Subtract 1 because CSS has coordinates which are zero-based.
	leftPos--;
	topPos--;
	centerLineCoord--;
	
	// Leave enough room for the cursor
	leftPos -= cursorOffset;
	topPos -= cursorOffset;
	
	var retHtml = "<div align='right'>";
	retHtml += "<div style='width:"+boxWidth+"px; height:"+boxWidth+"px; position:relative; margin:2px;'>";
	retHtml += "<div style='width:1px; height:"+boxWidth+"px; position:absolute; left:"+centerLineCoord+"px; top:0px; background-color:#999999;'></div>";
	retHtml += "<div style='width:"+boxWidth+"px; height:1px; position:absolute; left:0px; top:"+centerLineCoord+"px; background-color:#999999;'></div>";
	retHtml += "<div style='width:"+cursorWidth+"px; height:"+cursorWidth+"px; position:absolute; left:"+leftPos+"px; top:"+topPos+"px; background-color:"+cursorColor+";'></div>";
	
	retHtml += "</div>";
	retHtml += "</div>";
	
	return retHtml;
}

// Create Global parallel arrays to associate Unit names with the Object Reference.
var unitHtmlElementNamesArr = new Array(); 
var unitObjectsArr = new Array(); 

function buildUnitWidget(unitObj, htmlElementId){
	
	
if(unitObj.getUnitNamePlural() == "days"){
	//alert(unitObj.getValueRelativeToHemisphere(true));
}
	
	unitHtmlElementNamesArr.push(htmlElementId);
	unitObjectsArr.push(unitObj);
	
	var unitDesc = "<div class='unitContainer'>";
	
	if(!unitObj.isActive()){
		unitDesc += "<i>" + unitObj.getUnitNamePlural() + "</i></b>";
	}
	else if(unitObj.isOnAxis()){
		if(unitObj.getValueQuadrant() == 0){
			unitDesc += "<b><u>X-post</u></b> - " + unitObj.getValueAbsolute() + "(" + unitObj.getLoopCounterAbsolute() + ") " + unitObj.getUnitNamePlural();
		}
		else{
			unitDesc += "<b><u>X-pre</u></b> - " + unitObj.getValueAbsolute() + "(" + unitObj.getLoopCounterAbsolute() + ") " + unitObj.getUnitNamePlural();
		}
	}
	else if(unitObj.getLoopCounterAbsolute() > 1 || unitObj.getLoopCounterAbsolute() == 0){
		unitDesc += "<b><u>" + unitObj.getValueAbsolute() + "(" + unitObj.getLoopCounterAbsolute() + ") " + unitObj.getUnitNamePlural() + "</u></b>";
	}
	else if(unitObj.getLoopCounterAbsolute() == 1){
		unitDesc += "<b><u>1 " + unitObj.getUnitName() + "</u></b>";
	}
	else{
		throw "Error in building Unit Widget: " + unitObj.getUnitName();
	}

	unitDesc += "<br><br>" + unitObj.getNibbleDouble('-') + " (" + unitObj.getQuadrant() + " " + unitObj.getValueQuadrant() + ")";
	
	unitDesc += "<br><br>Quadrant Number: " + unitObj.getQuadrantNumber();
	unitDesc += "<br>Arc Number: " + unitObj.getArcNumber();
	unitDesc += "<br>Loop Rel: " + unitObj.getLoopNumberRelative() + " Abs: " + unitObj.getLoopNumberAbsolute();
	unitDesc += "<br>Counter: Rel: " + unitObj.getLoopCounterRelative() + " Abs: " + unitObj.getLoopCounterAbsolute();
	//unitDesc += "<br><br>Horizontal Hemisphere: " + unitObj.getValueRelativeToHemisphere(false);
	unitDesc += "<br>Quadrant Relative: " + unitObj.getValueRelativeToQuadrant();
	unitDesc += "<br>Absolute Value: " + unitObj.getValueAbsolute();
	//unitDesc += "<br>Super-clock Beats: " + unitObj.getSuperClockBeats();
	//unitDesc += "<br><br>Super Unit Projected: " + unitObj.getValueEstimateFromSuper();
	/*
	var absoluteSuperRatio = 0;
	if( unitObj.getValueEstimateFromSuper() > 0){
		absoluteSuperRatio = Math.floor(100 * unitObj.getValueAbsolute() / unitObj.getValueEstimateFromSuper());
	}
	unitDesc += "<br><br>Absolute/Super: " + absoluteSuperRatio + "% ";
	*/
	unitDesc += "<br><br>Global Interval: " + unitObj.intervalGetGlobalCounter();
	//unitDesc += "<br>Quarter: " + unitObj.getQuadrantNumber();
	
	/*
	unitDesc += "<br>Push Buttons: <span class='pushButtons'>";
	
	switch(unitObj.getQuadrantNumber()){
	case 0: unitDesc += ""; break;
	case 1: case 6: unitDesc += "| ."; break;
	case 2: case 5: unitDesc += ". |"; break;
	case 3: case 8: unitDesc += ". ."; break;
	case 4: case 7: unitDesc += "| |"; break;
	}
	
	unitDesc += "</span><br>&nbsp;";
	*/
	
	if(unitObj.isActive()){
		unitDesc += "<br>&nbsp;<table cellpadding='0' cellspacing='0'>";

		
		if(unitObj.getLoopNumberRelative() == 1){
			unitDesc += "<tr><td><u>Lp.1</u></td><td>Lp.2</td><td>Lp.3</td></tr>";
			unitDesc += "<tr>";
			unitDesc += "<td>" + getNibbleDoubleDisplay(unitObj.getQuadrant(), unitObj.getValueQuadrant()) + "</td>";
			unitDesc += "<td>" + getNibbleDoubleDisplay("S", 0) + "</td>";
			unitDesc += "<td>" + getNibbleDoubleDisplay("S", 0) + "</td>";
		}
		else if(unitObj.getLoopNumberRelative() == 2){
			unitDesc += "<tr><td>Lp.1</td><td><u>Lp.2</u></td><td>Lp.3</td></tr>";
			unitDesc += "<tr>";
			unitDesc += "<td>" + getNibbleDoubleDisplay("S", 0) + "</td>";
			unitDesc += "<td>" + getNibbleDoubleDisplay(unitObj.getQuadrant(), unitObj.getValueQuadrant()) + "</td>";
			unitDesc += "<td>" + getNibbleDoubleDisplay("S", 0) + "</td>";
		}
		else if(unitObj.getLoopNumberRelative() == 3){
			unitDesc += "<tr><td>Lp.1</td><td>Lp.2</td><td><u>Lp.3</u></td></tr>";
			unitDesc += "<tr>";
			unitDesc += "<td>" + getNibbleDoubleDisplay("S", 0) + "</td>";
			unitDesc += "<td>" + getNibbleDoubleDisplay("S", 0) + "</td>";
			unitDesc += "<td>" + getNibbleDoubleDisplay(unitObj.getQuadrant(), unitObj.getValueQuadrant()) + "</td>";
		}
		
		unitDesc += "</tr>";
		unitDesc += "</table>";
	}

	unitDesc += "</div>";
	
	document.getElementById(htmlElementId).innerHTML = unitDesc;
}

// Returns a reference to the Unit Object which was created in function call to buildUnitWidget(htmlElementId)
function getUnitObjectFromHtmlElementId(htmlElementId){
	
	for(var i=0; i<unitHtmlElementNamesArr.length; i++){

		if(unitHtmlElementNamesArr[i] == htmlElementId){
			return unitObjectsArr[i];
		}
	}
	
	throw "Error in method getUnitObjectFromHtmlElementId. Can not find a matching a Unit Name.";
}

function getTimerButtonHtml(unitObj){

	if((unitObj.intervalGetUnitNameWithFocus() == unitObj.getUnitName()) && unitObj.intervalIsPaused()){
		return "<button onclick='pauseResumeTimer();' id='timerButton_"+unitObj.getUnitName()+"' value='Resume'>Resume</button>";
	}
	else if(unitObj.intervalGetUnitNameWithFocus() == unitObj.getUnitName()){
		return "<button onclick='pauseResumeTimer();' id='timerButton_"+unitObj.getUnitName()+"' value='Pause'>Pause</button>";
	}
	else if(unitObj.intervalGetUnitNameWithFocus() == null){
		return "<button onclick='startTimer(\""+unitObj.getUnitName()+"\");' id='timerButton_"+unitObj.getUnitName()+"' value='Start Interval'>Start Interval</button>";
	}
	else{
		return "<button onclick='focusTimer(\""+unitObj.getUnitName()+"\");' id='timerButton_"+unitObj.getUnitName()+"' value='Focus Timer'>Focus Timer</button>";
	}
}

function getIncrementButtonHtml(unitObj){
	return "<button onclick='incrementElement(\""+unitObj.getUnitName()+"\");' id='incrementButton_"+unitObj.getUnitName()+"' value='Increment +'>Increment +</button>";
}

function getPauseAbsField(unitObj){
	
	var pauseAtAbs = unitObj.intervalGetAbsoluteUnitValuePause();
	
	if(pauseAtAbs == 0){
		pauseAtAbs = "";
	}
	return "<span class='absPauseLabel'>ABS Pause</span> <input type='text' class='absPauseVal' onkeyup='changeAbsPause(\""+unitObj.getUnitName()+"\", this.value);' id='pauseAbs_"+unitObj.getUnitName()+"' value='"+pauseAtAbs+"' />";
}

function changeAbsPause(unitName, absValue){
	
	// Make sure that it is numeric.
	absValue = absValue.replace(/[^0-9]/, '');
	document.getElementById('pauseAbs_' + unitName).value = absValue;
	
	var unitRef = getUnitObjectFromHtmlElementId(unitName);
	
	if(absValue.length > 0){
		unitRef.intervalPauseAtAbsoluteUnitValue(absValue);
	}
}






