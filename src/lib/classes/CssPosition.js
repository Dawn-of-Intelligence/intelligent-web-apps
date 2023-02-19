
function CssPosition(leftPosition, topPosition){

	if(leftPosition.toString().match(/\./) || topPosition.toString().match(/\./) ){
		throw "Coordinates of type 'CssPosition' may not have a decimal place.";
	}
	
	leftPosition = parseInt(leftPosition);
	topPosition = parseInt(topPosition);
	
	this.leftCoord = leftPosition;
	this.topCoord = topPosition;
	
}

CssPosition.prototype.getLeftPosition = function ()
{
	return this.leftCoord;
};

CssPosition.prototype.getTopPosition = function ()
{
	return this.topCoord;
};

CssPosition.prototype.toString = function ()
{
	return "[" + this.leftCoord + "," + this.topCoord + "]";
};

