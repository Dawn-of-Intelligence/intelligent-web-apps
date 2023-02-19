
// Constructor.  Pass in the name of a DIV ID to place the grid inside of.
function UnitGrid(elementIdStr)
{
	this.centerBrickSz = 1;
	this.scale = 1;
	
	// Default dimensions.
	this.width = 0;
	this.height = 0;
	this.setDimensions(15, 15);
	
	this.cursorX = this.xMid;
	this.cursorY = this.yMid;
	
	this.axisThicknessX = 1;
	this.axisThicknessY = 1;
	
	// The 1st quadrant is located at the South Pole pointing East.
	this.rotationByQuadrant = 1;
	
	this.cursorCSS = "background-color:#000000;";
	
	this.cursorCopies = 0;
	
	this.threeDimensionalBrickCollectionStr = null;
	this.threeDimensionalBrickCollectionArr = new Array();
	
	// The ElementID within the constructor is optional.
	this.elementIdForGrid = null;
	if(elementIdStr !== null){
		this.setInnerElementId(elementIdStr);
	}
	
}

UnitGrid.prototype.setDimensions = function(width, height)
{
	width = parseInt(width);
	height = parseInt(height);
	
	if(width % 2 == 0 || height % 2 == 0){
		throw("Error setting the dimensions on Unit Grid.  The width and height must be ODD because the axis lines occupy a unit.");
	}
	
	this.width = width;
	this.height = height;
	
	// The dimensions must be odd. The coordinates are 1-based and the following routine will put us at the center.
	this.xMid = Math.ceil(this.width / 2);
	this.yMid = Math.ceil(this.height / 2);
};

UnitGrid.prototype.reset3dCollection = function()
{
	this.threeDimensionalBrickCollectionStr =  "#######################################################################\n";
	this.threeDimensionalBrickCollectionStr += "# 3D Unit Collection. Each line represents a brick within a pyramid.  #\n";
	this.threeDimensionalBrickCollectionStr += "# To be parsed by 'Blender 3D' with import script 'pyramid_import.py' #\n";
	this.threeDimensionalBrickCollectionStr += "#######################################################################\n";
	
	this.threeDimensionalBrickCollectionArr = new Array();
};


// Returns the last Auto-increment ID of the "Cursor Copy".
UnitGrid.prototype.getCursorCopyId = function()
{
	return this.cursorCopies;
};

UnitGrid.prototype.setCursorVisibility = function(isVisible)
{
	if(document.getElementById(this.getCursorElementId())){
		document.getElementById(this.getCursorElementId()).style.visibility = isVisible ? "visible" : "hidden";
	}
};


// Copies should be removed with an integer (corresponding to position in which they were added).
// The first copyID starts at 1.  When you remove copies, it does not change the auto-increment ID.
UnitGrid.prototype.removeCursorCopy = function(copyId)
{
	var possibleCopyDivId = this.getElementIdByCursorCopyId(copyId);
	
	if(!document.getElementById(possibleCopyDivId)){
		return;
	}
	
	// Removing an element has to be done in context of the parent container.
	var gridDiv = document.getElementById(this.getInnerElementId());
	gridDiv.removeChild(document.getElementById(possibleCopyDivId));
};

// This set's the cursor with +-X / +-Y
UnitGrid.prototype.setCursorCartesian = function(x, y)
{
	this.setCursorGlobal(this.xMid + x, this.yMid - y);
};

//The X/Y coordinates are 1 Based.
//So a coordinate of (1,1) will position the cursor box in the very top-left corner of the UnitGrid.
//If the Grid Size is 15x15... then setting the cursor at 15,15 will position it at the bottom-right.
UnitGrid.prototype.setCursorGlobal = function(x, y)
{
	/*
	if(x < 1 || x > this.width){
		throw ("Error setting cursor on X coordinate. The value is out of range: " + x+ " Max Width: " + this.width);
	}
	if(y < 1 || y > this.height){
		throw ("Error setting cursor on Y coordinate. The value is out of range: " + y + " Max Height: " + this.height);
	}
	*/
	this.cursorX = x;
	this.cursorY = y;
	
	/* In a 1-based system, X is at (3,1).  If the cursor width is 1, you would have a coordinate of (2,0) after subtracting.  
	 * [00x]
	 * [000]
	 * [000]
	 * 
	 * If it is scaled by a value of 3, X would be scaled to (9,3) in the 1-based system.  
	 * The cursor width would be scaled to a height/width of 3.  Subtract the cursor width and you would be left with (6,0)
	 * [000000xxx]
	 * [000000xxx]
	 * [000000xxx]
	 * [000000000]
	 * [000000000]
	 * [000000000]
	 * [000000000]
	 * [000000000]
	 * [000000000]
	 */
	
	
	var cursorX_css = this.translateGlobalCursorPositionToCss(this.cursorX);
	var cursorY_css = this.translateGlobalCursorPositionToCss(this.cursorY);
	
	document.getElementById(this.getCursorElementId()).style.top = cursorY_css + "px";
	document.getElementById(this.getCursorElementId()).style.left = cursorX_css + "px";
};



//Returns a unique ID after creating a copy that can be used for removal.
//The parameter "divAttributes" is an optional parameter.  It may be useful to pass in an "onClick=''" event for the DIV, etc.
/**
* @param {String} divAttributes - A string to be injected within the <div ... > tag.  You could do "onmouseover" or maybe "style=".  
* @param {Array} cssClassesArr - An array of CSS classes.  Each class will be separated by a space.
* @returns {Number} Returns the Cursor ID which was just copied. 
*/
UnitGrid.prototype.cursorCopy = function(divAttributes, cssClassesArr)
{
	
	if(typeof(divAttributes) == "undefined"){
		divAttributes = "";
	}
	if(typeof(cssClassesArr) == "undefined"){
		var cssClassesArr = new Array();
	}
	
	if(!document.getElementById(this.getCursorElementId())){
		throw "Can not create a 'Cursor Copy' becuase no cursor was found within the document object for the given Grid object.";
	}
	
	if(divAttributes.match(/style\s*=\s*/i)){
		throw "If you pass additional attributes for the div, do not include a STYLE tag.  The CSS attributes are derived from the Cursor Style.";
	}
	
	this.cursorCopies++;
	
	// See explanation in method setCursorGlobal() for how scaling works with cursor positions.
	var cursorX_css = this.translateGlobalCursorPositionToCss(this.cursorX);
	var cursorY_css = this.translateGlobalCursorPositionToCss(this.cursorY);
	
	// Always put the "cursorCopy" class first.
	// Any classes passed in as a parameter will be added with a lower priority.
	var cssClassesStr = "cursorCopy";
	
	if(cssClassesArr.length > 0){
		cssClassesStr += " " + cssClassesArr.join(" ");
	}
	
	// Append the CSS literal styles to this variable.
	var styleTag = "";
	
	// If a "cursor style" has CSS defined then transfer it onto the cell.
	if(this.cursorCSS){
		styleTag += this.cursorCSS + "; ";
	}
	styleTag += "position:absolute; ";
	styleTag += "left:"+ cursorX_css +"px; top:"+ cursorY_css +"px; ";
	styleTag += "width:"+ Math.round(this.centerBrickSz * this.scale) +"px; height:"+ Math.round(this.centerBrickSz * this.scale) +"px;";
	
	var cellDiv = document.createElement("div");  
	cellDiv.setAttribute("id" , this.getElementIdByCursorCopyId(this.cursorCopies));  
	cellDiv.setAttribute("class" , cssClassesStr);  
	cellDiv.setAttribute("style" , styleTag);  

	// Break up the "DIV Attributes" string by semi-colons and then add to DIV object programmatically.
	var attArr = divAttributes.split(';');

	for(var i=0; i<attArr.length; i++){
		
		if(!attArr[i]){
			continue;
		}
		
		var attParts = attArr[i].split('=');
		if(attParts.length != 2){
			throw "Error in method cursorCopy. The attributes must be name/value pairs: " + divAttributes;
		}
		
		// Remove the outer quotes and spaces.
		var attValue = attParts[1];
		attValue = attValue.replace(/^\s*['"]/, '');
		attValue = attValue.replace(/^['"]\s*/, '');
		
		// Put the N/V pair into the DIV element.
		cellDiv.setAttribute(attParts[0] , attValue); 
	}
	
	// Because it has an "Absolute position", it doesn't matter that we are appending it to the bottom.
	document.getElementById(this.getInnerElementId()).appendChild(cellDiv);
	
	return this.cursorCopies;
};

// The same process works for X & Y coordinates.
// The Global Cursor coordinate is 1-based (starting at top-left corner).
// If the GridSize is 15x15, then [1,1] is in the top left and [15,15] is at the lower right.
// Since the Grid has been scaled, CSS coordinates must be scaled and changed to a Zero-based coordinate.
// If you pass in 15 to this method (and the scale is set to 57), it will return (15 * 57 - 57) = 798.
// This coordinate (798) will position the CSS Div at the very top - left corner of the "Grid Block".
// You can not pass in Zero to this method because the Cursor is 1-based. 
// So if you pass in 1, this method will return (1*57 -57) = 0.  That will position the CSS DIV at the very top-left of the canvas.
UnitGrid.prototype.translateGlobalCursorPositionToCss = function(globalCursorPosition)
{
	return (globalCursorPosition * this.scale - this.centerBrickSz * this.scale);
};

// If the GridSize is 15x15, then [8,8] would be the location of the origin.
// In which case, pass in 8 to this method and it will return 0.
// If you pass in [1,1], that means the top-left.  In which case, this method will return 
UnitGrid.prototype.translateGlobalCursorPositionToCartesianX = function(globalCursorPosition)
{
	return globalCursorPosition  -  this.xMid;
};
UnitGrid.prototype.translateGlobalCursorPositionToCartesianY = function(globalCursorPosition)
{
	return (globalCursorPosition - this.yMid) * -1;
};



// A Grid is placed inside of the "Element ID" passed into the constructor and appended with a suffix.
// You may want the "Inner Element ID" to place another grid object inside of.
UnitGrid.prototype.getInnerElementId = function()
{
	return this.elementIdForGrid + "_Inner";
};
UnitGrid.prototype.setInnerElementId = function(elementIdStr)
{
	if(!document.getElementById(elementIdStr)){
		throw "The Element ID was not found in the global Document Object within the 'UnitGrid'.";
	}
	
	this.elementIdForGrid = elementIdStr;
	
	// Once the Element ID is known, the parameters can be initialized.
	this.setScale(1);
};

UnitGrid.prototype.getCursorElementId = function()
{
	return this.elementIdForGrid + "_Cursor";
};
UnitGrid.prototype.getElementIdByCursorCopyId = function(copyId)
{
	return this.getCursorElementId() + "_copy_" + copyId;
};

// Think about building a pyramid on the ground.
// Your responsibility is to place a bunch of bricks within your given quadrant.  3 other people will handle the remaining quadrants.
// You don't care if your quadrant is rotated, etc.  "Up/Left/Down/Right" is relative to your "Axis line" and rotational direction.
UnitGrid.prototype.moveCursorRelative_Up = function(units)
{
	switch(this.rotationByQuadrant){
	case 1: case 6: this.cursorX -= units; break;
	case 2: case 5: this.cursorX += units; break;
	case 3: case 8: this.cursorY += units; break;
	case 4: case 7: this.cursorY -= units; break;
	}
};
UnitGrid.prototype.moveCursorRelative_Down = function(units)
{
	switch(this.rotationByQuadrant){
	case 1: case 6: this.cursorX += units; break;
	case 2: case 5: this.cursorX -= units; break;
	case 3: case 8: this.cursorY -= units; break;
	case 4: case 7: this.cursorY += units; break;
	}
};
UnitGrid.prototype.moveCursorRelative_Left = function(units)
{
	switch(this.rotationByQuadrant){
	case 1: case 6: this.cursorY += units; break;
	case 2: case 5: this.cursorY -= units; break;
	case 3: case 8: this.cursorX += units; break;
	case 4: case 7: this.cursorX -= units; break;
	}
};
UnitGrid.prototype.moveCursorRelative_Right = function(units)
{
	switch(this.rotationByQuadrant){
	case 1: case 6: this.cursorY -= units; break;
	case 2: case 5: this.cursorY += units; break;
	case 3: case 8: this.cursorX -= units; break;
	case 4: case 7: this.cursorX += units; break;
	}
};

// The last two parameters are optional.  The default grid size is based upon the "center brick" size.
UnitGrid.prototype.drawAxis = function(xColorCode, yColorCode, xThickness, yThickness)
{
	
	if(typeof(xThickness) == "undefined"){
		
		xThickness = this.centerBrickSz;
	}
	if(typeof(yThickness) == "undefined"){
		yThickness = this.centerBrickSz;
	}
	
	if(xThickness % 2 == 0 || yThickness % 2 == 0){
		throw "Error in method UnitGrid.drawAxis: The X/Y Axis thicknesses must be specified with 'odd' values.";
	}

	this.axisThicknessX = xThickness;
	this.axisThicknessY = yThickness;
	
	// Position the Axis in the center (offset by half its width/height).
	// Because we are doing a Ceil (not a Floor), the value will be Zero-based for CSS.
	var leftDivOffset = Math.ceil(this.width * this.scale / 2) - Math.ceil(yThickness * this.scale / 2);
	var topDivOffset = Math.ceil(this.height * this.scale / 2) - Math.ceil(xThickness * this.scale / 2);
	
	var yAxix = "<div style='" +
			"position:absolute; background-color:"+xColorCode+"; " +
			"width:"+(this.axisThicknessY * this.scale)+"px; height:"+(this.height * this.scale)+"px; " +
			"left:"+leftDivOffset+"px; top:0px; " +
			"'></div>";
	
	var xAxix = "<div style='" +
			"position:absolute; background-color:"+yColorCode+"; " +
			"height:"+(this.axisThicknessX * this.scale)+"px; width:"+(this.width * this.scale)+"px; " +
			"top:"+topDivOffset+"px; left:0px; " +
			"'></div>";
	
	document.getElementById(this.getInnerElementId()).innerHTML += xAxix;
	document.getElementById(this.getInnerElementId()).innerHTML += yAxix;
};


// When drawing diagonals it is important to decide how you will limit the expansion.
// Usually the smaller of the 2 (width/height) is the limiting factor.
UnitGrid.prototype.getBlockCountFromOriginMin = function(){
	var blW = this.getBlockCountFromOriginWide();
	var blH = this.getBlockCountFromOriginTall();
	
	return (blW > blH ? blH : blW);
};
UnitGrid.prototype.getBlockCountFromOriginMax = function(){
	var blW = this.getBlockCountFromOriginWide();
	var blH = this.getBlockCountFromOriginTall();
	
	return (blW > blH ? blW : blH);
};

UnitGrid.prototype.getBlockCountFromOriginWide = function(){
	return Math.floor(this.width / 2);
};
UnitGrid.prototype.getBlockCountFromOriginTall = function(){
	return Math.floor(this.height / 2);
};

UnitGrid.prototype.drawPlumLines = function(southAxisColor, northAxisColor, addBricksFlag){
	
	var blockCount = this.getBlockCountFromOriginMin();

	// Right Click ... or ...  South Pole cross
	this.setCursorStyle('background-color:'+southAxisColor+';');
	
	this.setCursorAtAxisOrigin();
	for(var i=1; i<= blockCount; i++){
		this.moveCursorRelative_Up(1);
		this.moveCursorRelative_Right(1);
		this.cursorCopy();
		
		if(addBricksFlag){
			this.addBrick(("North_Rr_" + i + "_Glb" + this.cursorCopies), this.translateGlobalCursorPositionToCartesianX(this.cursorX), this.translateGlobalCursorPositionToCartesianY(this.cursorY), 0);
		}
	}
	
	this.setCursorAtAxisOrigin();
	for(var i=1; i<=blockCount; i++){
		this.moveCursorRelative_Down(1);
		this.moveCursorRelative_Left(1);
		this.cursorCopy();
		
		if(addBricksFlag){
			this.addBrick(("North_Nr_" + i + "_Glb" + this.cursorCopies), this.translateGlobalCursorPositionToCartesianX(this.cursorX), this.translateGlobalCursorPositionToCartesianY(this.cursorY), 0);
		}
	}
	
	
	// Left Click ... or ...  South Pole cross
	this.setCursorStyle('background-color:'+northAxisColor+';');
	this.setCursorAtAxisOrigin();
	for(var i=1; i<=blockCount; i++){
		this.moveCursorRelative_Up(1);
		this.moveCursorRelative_Left(1);
		this.cursorCopy();
		
		if(addBricksFlag){
			this.addBrick(("South_Nr_" + i + "_Glb" + this.cursorCopies), this.translateGlobalCursorPositionToCartesianX(this.cursorX), this.translateGlobalCursorPositionToCartesianY(this.cursorY), 0);
		}
	}
	this.setCursorAtAxisOrigin();
	for(var i=1; i<=blockCount; i++){
		this.moveCursorRelative_Down(1);
		this.moveCursorRelative_Right(1);
		this.cursorCopy();
		
		if(addBricksFlag){
			this.addBrick(("South_Rr_" + i + "_Glb" + this.cursorCopies), this.translateGlobalCursorPositionToCartesianX(this.cursorX), this.translateGlobalCursorPositionToCartesianY(this.cursorY), 0);
		}
	}
};

UnitGrid.prototype.drawInitialBlocks = function(zeroBlockStyle, injectQudrantNumbers){

	this.setCursorStyle(zeroBlockStyle);
	
	var copyId;
	
	for(var quadrantCounter = 1; quadrantCounter <= 8; quadrantCounter++){
		
		this.setCursorAtQuadrantOrigin(quadrantCounter);
		
		// Move off of the Quadrant Origin.
		this.moveCursorRelative_Up(1);
		
		copyId = this.cursorCopy();
		
		if(injectQudrantNumbers){
			document.getElementById(this.getElementIdByCursorCopyId(copyId)).innerHTML = quadrantCounter;
		}
	}
};

// This will set the cursor at the center point of the axis with the cursor pointed East.
// This is the traditional "Unit Circle", with cursor sitting on the X-axis incrementing with positive values.
UnitGrid.prototype.setCursorAtAxisOrigin = function()
{
	if(this.width == 0 || this.height == 0){
		throw "Error in method setCursorAtAbsoluteOrigin. The dimensions haven't been set yet.";
	}
	
	this.cursorX = this.xMid;
	this.cursorY = this.yMid;
	this.rotationByQuadrant = 2;
};

UnitGrid.prototype.arcCursor = function(relativeCounter){

	if(relativeCounter > 14 || relativeCounter < 1){
		throw "The value is out of range in method gridObjToDrawArcOn";
	}
	this.moveCursorRelative_Left(relativeCounter);
	this.moveCursorRelative_Up((14 - relativeCounter));
};


// The cursor will be set to the proper location/rotation for 1/8 quadrant numbers on the pyramid/sphere.
UnitGrid.prototype.setCursorAtQuadrantOrigin = function(quadrantNumber)
{

	var blocksTall = this.getBlockCountFromOriginTall();
	var blocksWide = this.getBlockCountFromOriginWide();
	
	// Set up values for quadrants 1,3,5,7.  We will offset the differences for 2,4,6,8 afterwards.
	switch(quadrantNumber){
	case 1 :
	case 2 :
		this.cursorX = this.xMid;
		this.cursorY = this.yMid + blocksTall;
		break;
	case 3 :
	case 4 :
		this.cursorX = this.xMid + blocksWide;
		this.cursorY = this.yMid;
		break;
	case 5 :
	case 6 :
		this.cursorX = this.xMid;
		this.cursorY = this.yMid - blocksTall;
		break;
	case 7 :
	case 8 :
		this.cursorX = this.xMid - blocksWide;
		this.cursorY = this.yMid;
		break;
	default :
		throw "The quadrant number is invalid in method setCursorAtQuadrantOrigin: " + quadrantNumber;
	}
	
	this.rotationByQuadrant = quadrantNumber;
	
	this.setCursorGlobal(this.cursorX, this.cursorY);
};



UnitGrid.prototype.rotateClockwise = function()
{
	if(this.rotationByQuadrant < 3){
		this.rotationByQuadrant += 8;
	}
	
	this.rotationByQuadrant -= 2;
};

UnitGrid.prototype.rotateCounterClockwise = function()
{
	this.rotationByQuadrant += 2;
	
	if(this.rotationByQuadrant > 8){
		this.rotationByQuadrant -= 8;
	}
};



UnitGrid.prototype.rotationByHeading = function(heading)
{
	switch(heading){
	
		case "N": this.rotationByQuadrant = 4; break;
		case "S": this.rotationByQuadrant = 3; break;
		case "E": this.rotationByQuadrant = 2; break;
		case "W": this.rotationByQuadrant = 1; break;
	
		default: throw "Unknown heading parameter in method rotationByHeading().";
	}
};


// Setting the quadrant has the effect of rotating the "relative cursor".
// South Pole:
// 		Quadrant #1 South-Pole, pointing West.
// 		Quadrant #2 South-Pole, pointing East.
// East Equator:
// 		Quadrant #3 West-Equator, pointing South.
// 		Quadrant #4 West-Equator, pointing North.
// North Pole:
// 		Quadrant #5 North-Pole, pointing East.
// 		Quadrant #6 North-Pole, pointing West.
// West Equator:
// 		Quadrant #7 East-Equator, pointing North.
// 		Quadrant #8 East-Equator, pointing South.
UnitGrid.prototype.rotationByQuadrantNumber = function(quadrantNumber)
{
	if(quadrantNumber < 1 || 8 < quadrantNumber){
		throw "Error with quadrant number in method setRotateGlobal.";
	}
	
	this.rotationByQuadrant = quadrantNumber;
};


UnitGrid.prototype.drawCheckers = function(evenColor, oddColor){
	
	this.setCursorAtAxisOrigin();
	this.rotationByHeading("N");

	this.moveCursorRelative_Left(this.getBlockCountFromOriginWide());
	this.moveCursorRelative_Up(this.getBlockCountFromOriginTall());
	
	// Loop over every column.  Then, in a sub-loop, iterate over every row.
	for(var j=0; j<this.width; j++){
	
		for(var i=0; i<= this.height; i++){

			if(i%2 == 0){
				(j%2 == 0) ? this.setCursorStyle("background-color:"+evenColor+";") : this.setCursorStyle("background-color:"+oddColor+";");
			}
			else{
				(j%2 == 0) ? this.setCursorStyle("background-color:"+oddColor+";") : this.setCursorStyle("background-color:"+evenColor+";");
			}
			
			this.cursorCopy();
			
			this.moveCursorRelative_Down(1);
		}
		
		// Return to the top row and shift over by one column.
		this.moveCursorRelative_Up(this.height+1);
		this.moveCursorRelative_Right(1);
	}
};



UnitGrid.prototype.resetGrid = function()
{
	if(this.elementIdForGrid == null){
		throw "Error in method UnitGrid.resetGrid, the element ID must be configured before calling thid method.";
	}
	
	// If the Width hasn't been set yet, then we can't update the DIV.
	if(this.width == 0 || this.height == 0){
		throw "Error in method UnitGrid.resetGrid, the height and width must be configured before calling this method.";
	}
	
	// Inject the Grid DIV into the element ID container.
	var gridDiv = "<div style='" +
			"position:absolute; " +
			"width:1px; height:1px;" +
			"' " +
			"id='"+ this.getInnerElementId() +"'></div>";
	document.getElementById(this.elementIdForGrid).innerHTML = gridDiv;
	
	// Place the cursor inside of the inner Grid DIV that we just created.
	var cursorDiv = "<div style='"+this.cursorCSS+" ; " +
			"position:absolute; " +
			"left:"+this.translateGlobalCursorPositionToCss(this.cursorX)+"px; top:"+this.translateGlobalCursorPositionToCss(this.cursorY)+"px; " +
			"width:"+(this.centerBrickSz * this.scale)+"px; height:"+(this.centerBrickSz * this.scale)+"px;" +
			"' " +
			"id='"+ this.getCursorElementId() +"'></div>";
	document.getElementById(this.getInnerElementId()).innerHTML += cursorDiv;
	
	this.reset3dCollection();
};



// The scale parameter must be odd and divisible by 3 (except for 1).
// The quadratic spiral grows with integer-based coordinates on all connectors.  The values are always divisible by 6.
// Instead of saying that the scale parameter must be odd and divisible by 3, you can also say that the scale parameter
// 		must be divisible by 6 with an offset of 3.  For example... 6+3, or 6+3.  Either 3 or 9 are acceptable.  2x6+3, 3x6+3, 4x6+3, 5x6+3, etc.
UnitGrid.prototype.setScale = function(scale)
{
	// Get a piece of graph paper and fill in a square.  Then draw a perimeter around the square with other squares.
	// You will find that the only way to encompass a point is when the center brick has a value which is odd, and divisible by 3.
	// For example, 1,3,9,15,21,27 , etc. 12,18,24 don't work, even though they are divisible by 3.
	if(scale % 2 == 0){
		throw "The scale parameter must be odd.";
	}
	if(scale != 1 && scale % 3 != 0){
		throw "The scale parameter must be divisible by 3.";
	}

	this.scale = scale;
	
};


// You can overwrite the Height/Width attributes if the CSS specifies those properties.
// Whether you overwrite it or not depends on which method is called last...  UnitGrid.setCursorSize() & setCursorStyle()
UnitGrid.prototype.setCursorStyle = function(cursorCSS)
{
	this.cursorCSS = cursorCSS;
	
	// Until the dimensions have been set, there won't be a "Cursor <div>" on the page.
	if(this.width == 0 || this.height == 0){
		return;
	}

	// If the dimensions have already been set, then we can update the properties on the cursor Div.
	document.getElementById(this.getCursorElementId()).style.cssText = this.cursorCSS;
};

// Returns a string with an encoding type that can be passed into a "Blender 3D" Python script for import.
UnitGrid.prototype.get3dBricks = function()
{
	return this.threeDimensionalBrickCollectionStr;
};


// Bricks should be added to the 3D collection whenever the cursor is copied.
// That way it will transfer the cursor color to the brick color.
UnitGrid.prototype.addBrick = function(brickName, brickX, brickY, brickZ)
{

	// When we are laying bricks, we want to build it top-down, like the Great Pyramid.
	brickZ = brickZ * -1;
	
	var brickWidth = this.centerBrickSz;
	var brickDepth = this.centerBrickSz;
	var brickHeight = this.centerBrickSz;
	
	var foundMatch = this.cursorCSS.match(/background-color\s*:\s*#([A-Fa-f0-9]+)\s*;/);
	
	// Try to extract the brick color from the CSS style. Otherwise, just make them the default.
	if(foundMatch){
		var brickColor = "#" + foundMatch[1];
	}
	else{
		var brickColor = "#000000";
	}
	
	brickWidth = 0.1;
	brickHeight = 0.1;
	brickDepth = 0.1;
	
	var brickStr = brickName + "," + 
	brickX + "," + brickY + "," + brickZ + "," + 
	brickWidth + "," + brickHeight + "," + brickDepth + "," + 
	brickColor;
	
	this.threeDimensionalBrickCollectionArr.push(brickStr);
	
	this.threeDimensionalBrickCollectionStr += brickStr + "\n";
};

UnitGrid.prototype.get3dBrickArr = function()
{
	return this.threeDimensionalBrickCollectionArr;
};


// Quadrant Range: 1-12   (1-6 for back of sphere, 7-12 for front of sphere
// Value Range: 1-14
UnitGrid.prototype.setCursorAtQuadrantValue = function(quadrantNumber, unitValue){
	
	if(quadrantNumber > 12 || quadrantNumber < 1){
		throw "The quadrant value is out of range in method setCursorAtDoubleNibbleInQuadrant";
	}
	if(unitValue > 14 || unitValue < 1){
		throw "The unit value is out of range in method setCursorAtDoubleNibbleInQuadrant";
	}
	
	this.setCursorAtQuadrantOrigin(quadrantNumber);
	
	if(quadrantNumber % 2 == 0){
		switch(unitValue){
		case 1:  this.moveCursorRelative_Up(1); this.moveCursorRelative_Left(5); break;
		case 2:  this.moveCursorRelative_Up(2); this.moveCursorRelative_Left(4); break;
		case 3:  this.moveCursorRelative_Up(3); this.moveCursorRelative_Left(3); break;
		case 4:  this.moveCursorRelative_Up(4); this.moveCursorRelative_Left(2); break;
		case 5:  this.moveCursorRelative_Up(5); this.moveCursorRelative_Left(1); break;
		case 6:  this.moveCursorRelative_Up(4); this.moveCursorRelative_Left(1); break;
		case 7:  this.moveCursorRelative_Up(3); this.moveCursorRelative_Left(2); break;
		case 8:  this.moveCursorRelative_Up(2); this.moveCursorRelative_Left(3); break;
		case 9:  this.moveCursorRelative_Up(1); this.moveCursorRelative_Left(4); break;
		
		case 10: this.moveCursorRelative_Up(1); this.moveCursorRelative_Left(3); break;
		case 11: this.moveCursorRelative_Up(2); this.moveCursorRelative_Left(2); break;
		case 12: this.moveCursorRelative_Up(3); this.moveCursorRelative_Left(1); break;
		case 13: this.moveCursorRelative_Up(2); this.moveCursorRelative_Left(1); break;
		case 14: this.moveCursorRelative_Up(1); this.moveCursorRelative_Left(2); break;
		}
	}
	else{
		switch(unitValue){
		case 1:  this.moveCursorRelative_Up(1); this.moveCursorRelative_Right(5); break;
		case 2:  this.moveCursorRelative_Up(2); this.moveCursorRelative_Right(4); break;
		case 3:  this.moveCursorRelative_Up(3); this.moveCursorRelative_Right(3); break;
		case 4:  this.moveCursorRelative_Up(4); this.moveCursorRelative_Right(2); break;
		case 5:  this.moveCursorRelative_Up(5); this.moveCursorRelative_Right(1); break;
		case 6:  this.moveCursorRelative_Up(4); this.moveCursorRelative_Right(1); break;
		case 7:  this.moveCursorRelative_Up(3); this.moveCursorRelative_Right(2); break;
		case 8:  this.moveCursorRelative_Up(2); this.moveCursorRelative_Right(3); break;
		case 9:  this.moveCursorRelative_Up(1); this.moveCursorRelative_Right(4); break;
		case 10: this.moveCursorRelative_Up(1); this.moveCursorRelative_Right(3); break;
		case 11: this.moveCursorRelative_Up(2); this.moveCursorRelative_Right(2); break;
		case 12: this.moveCursorRelative_Up(3); this.moveCursorRelative_Right(1); break;
		case 13: this.moveCursorRelative_Up(2); this.moveCursorRelative_Right(1); break;
		case 14: this.moveCursorRelative_Up(1); this.moveCursorRelative_Right(2); break;
		}
	}
};



