
/**
 * @param {Number} xCoord - X coordinate.
 * @param {Number} yCoord - Y coordinate.
 * @returns {CartesianPoint}
 */
function CartesianPoint(xCoord, yCoord){
	this.xCoord = parseFloat(xCoord);
	this.yCoord = parseFloat(yCoord);
}

// A Static method which will test whether or not the given parameter is an object of this class.
CartesianPoint.isObjectOf = function (objectToCheck){
	
	if(typeof objectToCheck != "object" || typeof objectToCheck.getXcoord == "undefined" || typeof objectToCheck.isOrigin == "undefined"){
		return false;
	}
	
	return true;
};

CartesianPoint.prototype.getXcoord = function (){
	return this.xCoord;
};
CartesianPoint.prototype.getYcoord = function (){
	return this.yCoord;
};
CartesianPoint.prototype.getMagnitude = function ()
{
	var aSqr = this.getXcoord() * this.getXcoord();
	var bSqr = this.getYcoord() * this.getYcoord();
	var cSqr = aSqr + bSqr;
	
	return Math.sqrt(cSqr);
};

/**
 * @returns Boolean This method will return true if both X & Y are zero. It will round digits to the nearest 6 places. For example, this method will return true in case of coordinates such as 0.0000001
 */
CartesianPoint.prototype.isOrigin = function (){
	
	if(this.xCoord < 0.0000001 && this.yCoord < 0.0000001 && this.xCoord > -0.0000001 && this.yCoord > -0.0000001){
		return true;
	}
	
	return false;
};
