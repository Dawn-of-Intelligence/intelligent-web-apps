
// A static class.
function ComplexArithmetic(){
}

// Private method.
ComplexArithmetic.prototype.ensureComplex = function (point){
	
	if(!ComplexPoint.isObjectOf(point)){
		throw "Error in ComplexArithmetic.  Opperands must be of object type ComplexPoint.";
	}
};

//Returns a ComplexPoint object containing the "sum" of the addition operation performed upon both ComplexPoint objects passed into this method.
ComplexArithmetic.prototype.add = function (complexPoint1, complexPoint2){
	
	this.ensureComplex(complexPoint1);
	this.ensureComplex(complexPoint2);
	
	var realSum = complexPoint1.getRealPart() + complexPoint2.getRealPart();
	var imaginarySum = complexPoint1.getImaginaryPart() + complexPoint2.getImaginaryPart();
	
	var retObj = new ComplexPoint(realSum, imaginarySum);
	return retObj;
};

// Returns a ComplexPoint object containing the "square value" of the ComplexPoint object passed into this method.
ComplexArithmetic.prototype.square = function (complexPoint)
{
	this.ensureComplex(complexPoint);
	
	var real_Squared = complexPoint.getRealPart() * complexPoint.getRealPart();
	var imaginary_Squared = complexPoint.getImaginaryPart() * complexPoint.getImaginaryPart();
	
	var newImaginary = (2 * complexPoint.getRealPart() * complexPoint.getImaginaryPart());
	var newReal = (real_Squared - imaginary_Squared);
	
	var retPointObj = new ComplexPoint(newReal, newImaginary);
	return retPointObj;
};


