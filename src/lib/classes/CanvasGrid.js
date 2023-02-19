// This class does not do any Complex Arithmetic, it is simply meant to help draw pixels upon a rectangular canvas area using Cartesian/Global coordinates.
// Its main asset is being able to control dimensions and scale.  It removes the idea of "infinitesimal points" and associates coordinates with a "chunky brick".
// That allows us to not only draw "scaled pixels", but also attach mouse events to them.

// Constructor.  Pass in the name of a DIV ID to place the grid inside of.
function CanvasGrid(elementIdStr)
{
	// The ElementID within the constructor is optional.
	this.elementIdForGrid = null;
	if(elementIdStr !== null){
		this.setCanvasElementId(elementIdStr);
	}
	
	// Let the center brick guide our calculations for the rest of the structure.
	// This is analogous to number spirals and snowflakes.  The imperfect booger in the center defines the entire structure.
	// Funny that the IsoSpiral has a perfect hexagon in the center and the rest of the structure does not perfectly exhibit that.
	// Perhaps the hexagon in the center is imperfect, unlike the rest of the IsoSpiral?
	this.centerBrickSz = 1;
	
	// Parallel arrays to keep track of which global cursor coordinates have click events attached to them.
	// Each entry will be a string with a dash separating the 2 integers in format "[x-y]". 
	// For example, if the top-left pixel has a click even attached to it, this array will have an entry "[1-1]" somewhere inside of it, not in sequence.
	this.onClickEventsXY = new Array();
	
	// This is a parallel array to onClickEventsXY.  If an X/Y coordinate has an event attached, this will contain an object to call the function with its scope.
	this.onClickEventsObjArr =  new Array();
	this.onClickEventsFuncArr =  new Array();
	
	this.layerNamesArr = new Array();
	this.layerObjectsArr = new Array();
	
	// Default scale.
	this.scale = 1;
	
	// Default dimensions.
	this.width = 0;
	this.height = 0;
	
	this.cursorX = this.xMid;
	this.cursorY = this.yMid;
	
	this.axisThicknessX = 1;
	this.axisThicknessY = 1;
	
	// The 1st quadrant is located at the South Pole pointing East.
	this.rotationByQuadrant = 1;
	
	this.cursorColorCode = "#000000";
	
	this.cursorCopies = 0;
	
	this.ctx = null;
}


CanvasGrid.prototype.addLayer = function(layerName)
{
	if(!layerName.match(/^(\w|\d)+$/)){
		throw "The layer name is invalid.";
	}
	
	for(var i=0; i < this.layerNamesArr.length; i++){
		if(layerName == this.layerNamesArr[i]){
			throw "You can't add a new layer because the name is already in use.";
		}
	}
	
	// The index number for the parallel arrays is simply the array length (since the array is zero based).
	var indexForNewLayer = this.layerNamesArr.length;
	
	// Store the layer name "String" parallel to the layer ID's (integers).
	this.layerNamesArr[indexForNewLayer] = layerName;
	
	// Append another Canvas object using the layer index integer.
	this.private_addCanvasLayer(indexForNewLayer);

	// This will get a reference to the canvas object which should now be injected into the DOM.
	var canvasLayerObj = document.getElementById(this.getElementIdByLayerNumber(indexForNewLayer));
	
	// This will set the HTML 5 Canvas object (for the given layer) into a parallel array.
	this.layerObjectsArr[indexForNewLayer] = canvasLayerObj.getContext("2d");
};

CanvasGrid.prototype.getCanvasObjectByLayerName = function(layerName)
{
	for(var i=0; i < this.layerNamesArr.length; i++){
		if(layerName == this.layerNamesArr[i]){
			return this.layerObjectsArr[i];
		}
	}
	
	throw "Error in method getCanvasObjectByLayerName, the layer name does not exist'"+layerName+"'";
};

CanvasGrid.prototype.clearLayerByName = function(layerName)
{
	for(var i=0; i < this.layerNamesArr.length; i++){
		if(layerName == this.layerNamesArr[i]){
			this.layerObjectsArr[i].clearRect(0, 0, (this.width * this.scale), (this.height * this.scale));
			return;
		}
	}
	
	throw "Error in method clearLayerByName, the layer name does not exist'"+layerName+"'";
};

// This is a private method.  
// It will receive the "onClick" event from the canvas tag and convert the X/Y coordinates to be relative to the Canvas document element on page.
CanvasGrid.prototype.event_mouseClick = function(event)
{
	// All clicks are bound to layer Zero.
	var canvasElement = document.getElementById(this.getElementIdByLayerNumber(0));

	var boundingBox = canvasElement.getBoundingClientRect();
	
	var canvasBorder = canvasElement.style.borderWidth;
	
	var canvasBorderPixels = 0;
	if(canvasBorder.match(/\d+px/)){
		canvasBorderPixels = parseInt(canvasBorder.replace(/px/, ''));
	}
		
	var canvasX = event.clientX - parseInt(boundingBox.left) - canvasBorderPixels;
	var canvasY = event.clientY - parseInt(boundingBox.top) - canvasBorderPixels;
	
	var cssPositionObj = new CssPosition(canvasX, canvasY);
	var cursorPositionObj = this.translateCssToGlobalCursorPositionObj(cssPositionObj);
	
	// Let's go through the parallel array looking for a match on the coordinate pair.
	for(var indexPos = 0; indexPos < this.onClickEventsXY.length; indexPos++){

		if(cursorPositionObj.toString() == this.onClickEventsXY[indexPos]){
	
			// If there are multiple subscriptions to the click event on this particular coordinate, the fire() method will call all of them.
			this.onClickEventsFuncArr[indexPos].call( this.onClickEventsObjArr[indexPos], cursorPositionObj.getLeftCoord(), cursorPositionObj.getTopCoord() );
			// There is no use to keep looping.
			break;
		}
	}
};



// Because a single X/Y coordinate defines a region of space, we can attach click events to the block.
// Tradition X/Y coordinates define a single pixel and fractional X/Y coordinates can not have any click event attached to them.
// When the given cursor position has been clicked on, it will call the function (within object scope) with 2 parameters for the X/Y cursor position (integers).  
// EX: objRef.funcRef(x,y);
CanvasGrid.prototype.onClickCursorPosition = function(cursorPositionObj, funcRef, objRef)
{
	this.ensureCursorPositionObj(cursorPositionObj);

	var newIndexLoc = this.onClickEventsXY.length;

	// The first is an array containing the coordinates in string format (Ex: "[2,3]").
	// The second is the "object/scope" in which to call the function name.
	// The third is the name of function to invoke on the object.
	this.onClickEventsXY[newIndexLoc] = cursorPositionObj.toString();
	this.onClickEventsObjArr[newIndexLoc] = objRef;
	this.onClickEventsFuncArr[newIndexLoc] = funcRef;
};


CanvasGrid.prototype.setDimensions = function(width, height)
{
	width = parseInt(width);
	height = parseInt(height);
	
	if(width == 0 || height == 0){
		throw "Error setting the Canvas dimensions, both width and height must be greater than zero.";
	}
	
	if(width % 2 == 0 || height % 2 == 0){
		throw("Error setting the dimensions on Unit Grid.  The width and height must be ODD because the axis lines occupy a unit.");
	}
	
	this.width = width;
	this.height = height;
	
	// The dimensions must be odd. The coordinates are 1-based and the following routine will put us at the center.
	this.xMid = Math.ceil(this.width / 2);
	this.yMid = Math.ceil(this.height / 2);
};


//The scale parameter must be odd and divisible by 3 (except for 1).
//The quadratic spiral grows with integer-based coordinates on all connectors.  The values are always divisible by 6.
//Instead of saying that the scale parameter must be odd and divisible by 3, you can also say that the scale parameter
//		must be divisible by 6 with an offset of 3.  For example... 6+3, or 6+3.  Either 3 or 9 are acceptable.  2x6+3, 3x6+3, 4x6+3, 5x6+3, etc.
CanvasGrid.prototype.setScale = function(scale)
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
	
	// Setting the scale won't update the canvas tag unless the height has also been set.
	if(this.width == 0 || this.height ==0){
		return;
	}
};

// This will simply erase the canvas tags from the container DIV.
CanvasGrid.prototype.resetCanvas = function()
{
	document.getElementById(this.elementIdForGrid).innerHTML = "";
};

CanvasGrid.prototype.getElementIdByLayerNumber = function(layerNumber)
{
	return this.getCanvasElementId() + "_layerNum" + layerNumber;
};

// The root canvas is layerNumber ZERO.
CanvasGrid.prototype.private_addCanvasLayer = function(layerNumber)
{
	// Create a new Canvas element to be appended to the DOM.
	var canvasObj = document.createElement('canvas');
	canvasObj.id = this.getElementIdByLayerNumber(layerNumber);
	canvasObj.width = (this.width * this.scale);
	canvasObj.height = (this.height * this.scale);
	canvasObj.style.position = "absolute";
	canvasObj.style.top = "0px";
	canvasObj.style.left = "0px";

	// Add the Canvas Object into the containing DIV specified by a string in this member object.
	document.getElementById(this.elementIdForGrid).appendChild(canvasObj);
};

//A Private method to Inject <canvas> tag into the <div> container.
//You may call this after changing the scale or dimensions.
CanvasGrid.prototype.initCanvas = function()
{
	if(this.width == 0 || this.height ==0){
		throw "The canvas cannot be initialized because the dimensions haven't been set.";
	}
	
	if(document.getElementById(this.getCanvasElementId())){
		throw "The Canvas has already been initialized.  You must call resetCanvas if you want to re-initialize.";
	}
	
	var rootLayerNumber = 0;
		
	// The canvas will always be initialized with Layer Number ZERO.
	this.private_addCanvasLayer(rootLayerNumber);

	// This will get a reference to the canvas object which should now be injected into the DOM.
	var canvasLayerObj = document.getElementById(this.getElementIdByLayerNumber(rootLayerNumber));

	// Bind an onClick event to the root canvas layer.
	// Note the round paranthesis around the outer anonymous function.  It is followed by another pair of round parathensis.
	// This is an IIFE style way to keep the variable closed in scope.  (JsFunc)(Parm)
	// This outer function is immediately executed, that is, it assigns the onClick attribute onto the variable "canvasObj".
	(function(gridElementIdFromDom){ 
		canvasLayerObj.onclick = function(event) { 
								// This function must be defined in the script which implements the drawing routine.
								// Whatever script that is, it must arbitrate which click event belongs to what Canvas tag based upon a string referring to the DOM Element ID.
								event_canvasClick(gridElementIdFromDom, event); 
							};
	})(this.elementIdForGrid);
	
	// This will set the HTML 5 Canvas object into a member variable of this CanvasGrid class.
	try{
		this.ctx = canvasLayerObj.getContext("2d");
	}
	catch(e){
		alert("What a pity, your browser doesn't support the HTML 5 Canvas Feature.");
	}
};

CanvasGrid.prototype.getCanvasElementObj = function()
{
	return this.ctx;
};

// Returns the last Auto-increment ID of the "Cursor Copy".
CanvasGrid.prototype.getCursorCopyId = function()
{
	return this.cursorCopies;
};


// This set's the cursor with +-X / +-Y
CanvasGrid.prototype.setCursorCartesian = function(x, y)
{
	// Let's say that the Resolution is 15x15.
	// In that case, the origin would be at [8,8].  
	// The origin's position is reflected with "member variables" this.xMid & this.yMid.
	// Here is how the "mid" variable was set, followed by a little example.... 
	// 					Formula: this.xMid = Math.ceil(this.width / 2);
	// 					Example: xMid = Math.ceil(15/2)
	//					Example: 15/2 = 7.5
	//					Example: Math.ceil(7.5) = 8;
	//					So [8,8] is the location of the "Cartesian origin", relative to a square canvas with 15x15 pixels.
	// Some examples of conversion into this method.
	// Passing in [0,0] to this method would get converted to [8,8].  										EX: cursorX = 8 + +0;   cursorY = 8 - +0;
	// Passing in [1,1] to this method would get converted to [9,7].   										EX: cursorX = 8 + +1;   cursorY = 8 - +1;
	// Passing in [-7,7] (Top-Left on Cartesian plane) to this method would get converted to [1,1].  		EX: cursorX = 8 + -7;   cursorY = 8 - +7;
	// Passing in [7,-7] (Bottom-Right on Cartesian plane) to this method would get converted to [15,15].  	EX: cursorX = 8 + +7;   cursorY = 8 - -7;
	var cursorPosition = new CursorPosition((this.xMid + x), (this.yMid - y));
	this.setCursorGlobal(cursorPosition);
};

//The X/Y coordinates are 1 Based.
//So a coordinate of (1,1) will position the cursor box in the very top-left corner of the CanvasGrid.
//If the Grid Size is 15x15... then setting the cursor at 15,15 will position it at the bottom-right.
CanvasGrid.prototype.setCursorGlobal = function(cursorPositionObj)
{
	this.ensureCursorPositionObj(cursorPositionObj);
	
	this.cursorX = cursorPositionObj.getLeftCoord();
	this.cursorY = cursorPositionObj.getTopCoord();
	
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
	
	//var cssPositionObj = this.translateGlobalCursorPositionToCss(this.getCurrentCursorPositionObj());
	//var cursorX_css = cssPositionObj.getLeftPosition();
	//var cursorY_css = cssPositionObj.getTopPosition();
	
};

// Returns an object of type "CursorPosition" describing the X/Y location of our cursor.
// This is helpful since methods can only return 1 object and we have 2 components to describe.
CanvasGrid.prototype.getCurrentCursorPositionObj = function()
{
	
	var cursorPositionObj = new CursorPosition(this.cursorX, this.cursorY);
	
	//alert(this.cursorX + ":" + this.cursorY + "\n" + cursorPositionObj.getLeftCoord() + ":" + cursorPositionObj.getTopCoord());
	return cursorPositionObj;
};

// Returns a unique ID after creating a copy that can be used for removal.
CanvasGrid.prototype.cursorCopy = function()
{
	this.cursorCopies++;
	
	var cursorPosObj = this.getCurrentCursorPositionObj();
//alert(cursorPosObj.getLeftCoord() + ":" + cursorPosObj.getTopCoord());
	
	var cssPositionObj = this.translateGlobalCursorPositionToCss(cursorPosObj);

	var pixelWidth = this.centerBrickSz * this.scale;
	var pixelHeight = this.centerBrickSz * this.scale;

	// Draw on the <canvas> element.
	this.changeFillColor(this.cursorColorCode);
	this.ctx.fillRect(cssPositionObj.getLeftPosition(), cssPositionObj.getTopPosition(), pixelWidth, pixelHeight);
	
	return this.cursorCopies;
};

CanvasGrid.prototype.isCursorPositionObj = function (positionObj)
{
	return (typeof positionObj == "object" && typeof positionObj.getLeftCoord != "undefined") ? true : false;

};
CanvasGrid.prototype.isCssPositionObj = function (positionObj)
{
	return (typeof positionObj == "object" && typeof positionObj.getLeftPosition != "undefined") ? true : false;
};
CanvasGrid.prototype.isCartesianPointObj = function (positionObj)
{
	return (typeof positionObj == "object" && typeof positionObj.getXcoord != "undefined") ? true : false;
};

// Private method
CanvasGrid.prototype.ensureCursorPositionObj = function(cursorPositionObj)
{
	if(!this.isCursorPositionObj(cursorPositionObj)){
		throw "The parameter must be an object of type CursorPosition.";
	}
};
CanvasGrid.prototype.ensureCartesianPointObj = function(cartesianPointObj)
{
	if(!this.isCartesianPointObj(cartesianPointObj)){
		throw "The parameter must be an object of type CartesianPoint.";
	}
};
CanvasGrid.prototype.ensureCssPositionObj = function(cssPositionObj)
{
	if(!this.isCssPositionObj(cssPositionObj)){
		throw "The parameter must be an object of type CssPosition.";
	}
};

// The same process works for X & Y coordinates.
// The Global Cursor coordinate is 1-based (starting at top-left corner).
// If the GridSize is 15x15, then [1,1] is in the top left and [15,15] is at the lower right.
// Since the Grid has been scaled, CSS coordinates must be scaled and changed to a Zero-based coordinate.
// If you pass in 15 to this method (and the scale is set to 57), it will return (15 * 57 - 57) = 798.
// This coordinate (798) will position the CSS Div at the very top - left corner of the "Grid Block".
// You can not pass in Zero to this method because the Cursor is 1-based. 
// So if you pass in 1, this method will return (1*57 -57) = 0.  That will position the CSS DIV at the very top-left of the canvas.
CanvasGrid.prototype.translateGlobalCursorPositionToCss = function(cursorPositionObj)
{
	this.ensureCursorPositionObj(cursorPositionObj);
	
	var leftCoord = (this.scale * cursorPositionObj.getLeftCoord()) - (this.centerBrickSz * this.scale);
	var topCoord = (this.scale * cursorPositionObj.getTopCoord()) - (this.centerBrickSz * this.scale);
//alert(leftCoord + ":" + topCoord);
	var cssPositionObj = new CssPosition(leftCoord, topCoord);
	return cssPositionObj;
};

// This assumes that the Cartesian Point is relative to the scale already.
// For example: A 15x15 grid would have a [1,1] Cartesian point translated to [9,7].
CanvasGrid.prototype.translateCartesianCursorToGlobalCursor = function(cartesianPointObj)
{
	this.ensureCartesianPointObj(cartesianPointObj);
	
	var leftCoord = this.xMid + cartesianPointObj.getXcoord();
	var topCoord = this.yMid - cartesianPointObj.getYcoord();
	
	var cursorPositionObj = new CursorPosition(leftCoord, topCoord);
	return cursorPositionObj;
};
CanvasGrid.prototype.translateGlobalCursorToCartesianCursor = function(cursorPositionObj)
{
	this.ensureCursorPositionObj(cursorPositionObj);
	
	var leftCoord =  cursorPositionObj.getLeftCoord() - this.xMid;
	var topCoord = this.yMid - cursorPositionObj.getTopCoord();
	
	var cursorCartesianObj = new CartesianPoint(leftCoord, topCoord);
	return cursorCartesianObj;
};


// The canvas may be scaled.  This method will take a coordinate from the Top-Left (as CSS is arranged), and return a point converted to our Global Cursor position.
// Regardless of what the "scale" is set to, the "resolution" is what the globalCursor positions are related to.  For example, [1,1] means the top left square, and on a 15x15 resolution, [15,15] means the lower right square. 
CanvasGrid.prototype.translateCssToGlobalCursorPositionObj = function(cssPositionObj)
{
	this.ensureCssPositionObj(cssPositionObj);
	var cssX = cssPositionObj.getLeftPosition();
	var cssY = cssPositionObj.getTopPosition();
	
	// Let's say the scale is 9 and the resolution is 15.  That means there are a total of 135 pixels from left to right.
	// We want to convert our position 0-134 into a number which is 1-15.
	// We have to add 1 to make the pixel 1 based (since CSS is zero based).
	cssX++;
	cssY++;
	
	// Let's say that our CSS coordinate is now 1 (after adding 1) and the scale is 9.
	// Any number 1/9 .... to ... 9/9 will yield 1 (after doing a Math ceiling).
	// To the very right... if our number is 135 after adding 1.  135/9 = 15.  127/9 = 14.111 (which goes up to 15 after doing a Math.ceiling).
	var cursorPosObj = new CursorPosition(Math.ceil(cssX / this.scale), Math.ceil(cssY / this.scale));
	
	return cursorPosObj;
};


// A Grid is placed inside of the "Element ID" passed into the constructor and appended with a suffix.
// You may want the "Inner Element ID" to place another grid object inside of.
CanvasGrid.prototype.getCanvasElementId = function()
{
	//return "canvas3";
	return this.elementIdForGrid + "CTX";
};
CanvasGrid.prototype.setCanvasElementId = function(elementIdStr)
{
	if(!document.getElementById(elementIdStr)){
		throw "The Element ID was not found in the global Document Object within the 'CanvasGrid'.";
	}
	
	this.elementIdForGrid = elementIdStr;
};


// Think about building a pyramid on the ground.
// Your responsibility is to place a bunch of bricks within your given quadrant.  3 other people will handle the remaining quadrants.
// You don't care if your quadrant is rotated, etc.  "Up/Left/Down/Right" is relative to your "Axis line" and rotational direction.
CanvasGrid.prototype.moveCursorRelative_Up = function(units)
{
	switch(this.rotationByQuadrant){
	case 1: case 6: this.cursorX -= units; break;
	case 2: case 5: this.cursorX += units; break;
	case 3: case 8: this.cursorY += units; break;
	case 4: case 7: this.cursorY -= units; break;
	}
};
CanvasGrid.prototype.moveCursorRelative_Down = function(units)
{
	switch(this.rotationByQuadrant){
	case 1: case 6: this.cursorX += units; break;
	case 2: case 5: this.cursorX -= units; break;
	case 3: case 8: this.cursorY -= units; break;
	case 4: case 7: this.cursorY += units; break;
	}
};
CanvasGrid.prototype.moveCursorRelative_Left = function(units)
{
	switch(this.rotationByQuadrant){
	case 1: case 6: this.cursorY += units; break;
	case 2: case 5: this.cursorY -= units; break;
	case 3: case 8: this.cursorX += units; break;
	case 4: case 7: this.cursorX -= units; break;
	}
};
CanvasGrid.prototype.moveCursorRelative_Right = function(units)
{
	switch(this.rotationByQuadrant){
	case 1: case 6: this.cursorY -= units; break;
	case 2: case 5: this.cursorY += units; break;
	case 3: case 8: this.cursorX -= units; break;
	case 4: case 7: this.cursorX += units; break;
	}
};

CanvasGrid.prototype.ensureDimensionsSet = function()
{
	if(this.width == 0 || this.height == 0){
		throw "The dimensions haven't been set for the canvas yet.";
	}
	
};


CanvasGrid.prototype.changeFillColor = function(colorCode)
{
	this.ctx.fillStyle = "rgba("+getDecimalRed(colorCode)+","+getDecimalGreen(colorCode)+","+getDecimalBlue(colorCode)+", 0.5)";
};


// The last two parameters are optional.  The default grid size is based upon the "center brick" size.
CanvasGrid.prototype.drawAxis = function(xColorCode, yColorCode, xThickness, yThickness)
{
	this.ensureDimensionsSet();
	
	if(typeof(xThickness) == "undefined"){
		xThickness = this.centerBrickSz;
	}
	if(typeof(yThickness) == "undefined"){
		yThickness = this.centerBrickSz;
	}
	
	if(xThickness % 2 == 0 || yThickness % 2 == 0){
		throw "Error in method CanvasGrid.drawAxis: The X/Y Axis thicknesses must be specified with 'odd' values.";
	}

	this.axisThicknessX = xThickness;
	this.axisThicknessY = yThickness;
	
	// Position the Axis in the center (offset by half its width/height).
	// Because we are doing a Ceil (not a Floor), the value will be Zero-based for CSS.
	var leftDivOffset = Math.ceil(this.width * this.scale / 2) - Math.ceil(yThickness * this.scale / 2);
	var topDivOffset = Math.ceil(this.height * this.scale / 2) - Math.ceil(xThickness * this.scale / 2);
	
	this.changeFillColor(yColorCode);
	this.ctx.fillRect(leftDivOffset, 0, (this.axisThicknessY * this.scale), (this.height * this.scale));
	
	this.changeFillColor(xColorCode);
	this.ctx.fillRect(0, topDivOffset, (this.width * this.scale), (this.axisThicknessX * this.scale));

};


// When drawing diagonals it is important to decide how you will limit the expansion.
// Usually the smaller of the 2 (width/height) is the limiting factor.
CanvasGrid.prototype.getBlockCountFromOriginMin = function(){
	var blW = this.getBlockCountFromOriginWide();
	var blH = this.getBlockCountFromOriginTall();
	
	return (blW > blH ? blH : blW);
};
CanvasGrid.prototype.getBlockCountFromOriginMax = function(){
	var blW = this.getBlockCountFromOriginWide();
	var blH = this.getBlockCountFromOriginTall();
	
	return (blW > blH ? blW : blH);
};

CanvasGrid.prototype.getBlockCountFromOriginWide = function(){
	return Math.floor(this.width / 2);
};
CanvasGrid.prototype.getBlockCountFromOriginTall = function(){
	return Math.floor(this.height / 2);
};

CanvasGrid.prototype.drawPlumLines = function(southAxisColor, northAxisColor){
	
	var blockCount = this.getBlockCountFromOriginMin();

	// Right Click ... or ...  South Pole cross
	this.setCursorColor(southAxisColor);
	
	this.setCursorAtAxisOrigin();
	for(var i=1; i<= blockCount; i++){
		this.moveCursorRelative_Up(1);
		this.moveCursorRelative_Right(1);
		this.cursorCopy();
	}
	
	this.setCursorAtAxisOrigin();
	for(var i=1; i<=blockCount; i++){
		this.moveCursorRelative_Down(1);
		this.moveCursorRelative_Left(1);
		this.cursorCopy();
	}
	
	
	// Left Click ... or ...  South Pole cross
	this.setCursorColor(northAxisColor);
	this.setCursorAtAxisOrigin();
	for(var i=1; i<=blockCount; i++){
		this.moveCursorRelative_Up(1);
		this.moveCursorRelative_Left(1);
		this.cursorCopy();
	}
	this.setCursorAtAxisOrigin();
	for(var i=1; i<=blockCount; i++){
		this.moveCursorRelative_Down(1);
		this.moveCursorRelative_Right(1);
		this.cursorCopy();
	}
};

CanvasGrid.prototype.drawCheckers = function(evenColor, oddColor){
	
	this.setCursorAtAxisOrigin();
	this.rotationByHeading("N");

	this.moveCursorRelative_Left(this.getBlockCountFromOriginWide());
	this.moveCursorRelative_Up(this.getBlockCountFromOriginTall());
	
	// Loop over every column.  Then, in a sub-loop, iterate over every row.
	for(var j=0; j<this.width; j++){
	
		for(var i=0; i<= this.height; i++){
			
			if(i%2 == 0){
				(j%2 == 0) ? this.setCursorColor(evenColor) : this.setCursorColor(oddColor);
			}
			else{
				(j%2 == 0) ? this.setCursorColor(oddColor) : this.setCursorColor(evenColor);
			}
			
			this.cursorCopy();
			
			this.moveCursorRelative_Down(1);
		}
		
		// Return to the top row and shift over by one column.
		this.moveCursorRelative_Up(this.height+1);
		this.moveCursorRelative_Right(1);
	}
};

CanvasGrid.prototype.drawInitialBlocks = function(zeroBlockStyle){

	this.setCursorColor(zeroBlockStyle);
	
	var copyId;
	
	for(var quadrantCounter = 1; quadrantCounter <= 8; quadrantCounter++){
		
		this.setCursorAtQuadrantOrigin(quadrantCounter);
		
		// Move off of the Quadrant Origin.
		this.moveCursorRelative_Up(1);
		
		copyId = this.cursorCopy();
	}
};

// This will set the cursor at the center point of the axis with the cursor pointed East.
// This is the traditional "Unit Circle", with cursor sitting on the X-axis incrementing with positive values.
CanvasGrid.prototype.setCursorAtAxisOrigin = function()
{
	this.ensureDimensionsSet();
	
	this.cursorX = this.xMid;
	this.cursorY = this.yMid;
	this.rotationByQuadrant = 2;
};


// The cursor will be set to the proper location/rotation for 1/8 quadrant numbers on the pyramid/sphere.
CanvasGrid.prototype.setCursorAtQuadrantOrigin = function(quadrantNumber)
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
		throw "The quadrant number is invalid in method setCursorAtQuadrantOrigin";
	}
	
	this.rotationByQuadrant = quadrantNumber;
};



CanvasGrid.prototype.rotateClockwise = function()
{
	if(this.rotationByQuadrant < 3){
		this.rotationByQuadrant += 8;
	}
	
	this.rotationByQuadrant -= 2;
};

CanvasGrid.prototype.rotateCounterClockwise = function()
{
	this.rotationByQuadrant += 2;
	
	if(this.rotationByQuadrant > 8){
		this.rotationByQuadrant -= 8;
	}
};


CanvasGrid.prototype.rotationByHeading = function(heading)
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
CanvasGrid.prototype.rotationByQuadrantNumber = function(quadrantNumber)
{
	if(quadrantNumber < 1 || 8 < quadrantNumber){
		throw "Error with quadrant number in method setRotateGlobal.";
	}
	
	this.rotationByQuadrant = quadrantNumber;
};


// You can overwrite the Height/Width attributes if the CSS specifies those properties.
// Whether you overwrite it or not depends on which method is called last...  CanvasGrid.setCursorSize() & setCursorColor()
CanvasGrid.prototype.setCursorColor = function(cursorColorCode)
{
	if(!cursorColorCode.match(/^#([0-9]|[A-F]){6}$/i)){
		throw "Error in method CanvasGrid.setCursorColor. The color code is invalid.";
	}
	
	this.cursorColorCode = cursorColorCode;
};






