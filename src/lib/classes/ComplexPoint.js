

function ComplexPoint(realPart, imaginaryPart){
	this.real = parseFloat(realPart);
	this.imaginary = parseFloat(imaginaryPart);
}

// A Static method which will test whether or not the given parameter is an object of this class.
ComplexPoint.isObjectOf = function (objectToCheck){
	
	if(typeof objectToCheck != "object" || typeof objectToCheck.getImaginaryPart == "undefined" || typeof objectToCheck.getMagnitude == "undefined"){
		return false;
	}
	
	return true;
};


ComplexPoint.prototype.getRealPart = function (){
	return this.real;
};
ComplexPoint.prototype.getImaginaryPart = function (){
	return this.imaginary;
};
ComplexPoint.prototype.getMagnitude = function ()
{
	var aSqr = this.getRealPart() * this.getRealPart();
	var bSqr = this.getImaginaryPart() * this.getImaginaryPart();
	var cSqr = aSqr + bSqr;
	
	return Math.sqrt(cSqr);
};
ComplexPoint.prototype.toString = function ()
{
	return "[" + this.real + " + " + this.imaginary + "i]";
};

/**
 * @returns Boolean This method will return true if both the REAL and IMAGINARY parts are zero. It will round digits to the nearest 6 places. For example, this method will return true in case of coordinates such as 0.0000001
 */
ComplexPoint.prototype.isOrigin = function (){
	
	if(this.real < 0.0000001 && this.imaginary < 0.0000001 && this.real > -0.0000001 && this.imaginary > -0.0000001){
		return true;
	}
	
	return false;
};

