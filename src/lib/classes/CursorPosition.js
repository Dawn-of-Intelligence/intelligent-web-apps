// This class is meant to hold the position of a cursor with the registration point in the top-left.
// The cursor position is not Zero-based like CSS.  The constructor will ensure the coordinates are greater than zero.
function CursorPosition(leftPosition, topPosition){

	if(leftPosition.toString().match(/\./) || topPosition.toString().match(/\./) ){
		throw "Coordinates of type 'CursorPosition' may not have a decimal place.";
	}
	
	leftPosition = parseInt(leftPosition);
	topPosition = parseInt(topPosition);
	
	this.leftCoord = leftPosition;
	this.topCoord = topPosition;
}

CursorPosition.prototype.getLeftCoord = function ()
{
	return this.leftCoord;
};

CursorPosition.prototype.getTopCoord = function ()
{
	return this.topCoord;
};

// Override the toString() method.
// This will be useful to put cursor coordinates in an array for indexing, etc.
CursorPosition.prototype.toString = function ()
{
	return "[" + this.leftCoord + "," + this.topCoord + "]";
};

