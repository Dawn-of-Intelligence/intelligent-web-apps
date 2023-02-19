

// We can't call this class "Complex Number Plane" (singular) because there are layers.
// This class is meant to handle all of the planes.
// To be useful, the object must be created with with a "proportion mapping" between integers (on Cartesian Plane) and floats (on Complex Plane).
// For example, the Mandlebrot is traditionally plotted on a 2x2 complex plane, but we address the "pixels" with integer values from the Cartesian plane.
// Many of the methods require a "Seed Point" on top of a regular point.  For the Mandlebrot, these are the same thing.  
// The "seed points" were separated here for a bit more control, allowing us to test a point for escape with a varying "C" or perhaps one offset by a certain ratio.
function ComplexPlanes(integerWidth, integerHeight, floatWidth, floatHeight){
	
	this.intWidth = parseInt(integerWidth);
	this.intHeight = parseInt(integerHeight);
	
	this.floatWidth = parseFloat(floatWidth);
	this.floatHeight = parseFloat(floatHeight);
	
	this.escapeInt = 0;
	this.magnitudeFloat = 0;
	
}



// -------- BEGIN Private Methods ------------------
ComplexPlanes.prototype.ensureComplex = function (pointObj){
	if(!this.isObjectComplexPoint(pointObj)){
		throw "Error in ComplexPlanes.  The parameter must be an object of type ComplexPoint.";
	}
};

ComplexPlanes.prototype.ensureCartesian = function (pointObj){
	if(!this.isObjectCartesianPoint(pointObj)){
		throw "Error in ComplexPlanes.  The parameter must be an object of type CartesianPoint.";
	}
};

ComplexPlanes.prototype.ensureEscapeSet = function()
{
	if(this.escapeInt == 0){
		throw "The Escape parameter has not been set yet.";
	}
};

ComplexPlanes.prototype.isObjectCartesianPoint = function (pointObj){
	
	if(typeof pointObj == "object" && typeof pointObj.getXcoord != "undefined"){
		return true;
	}
	else{
		return false;
	}
};

ComplexPlanes.prototype.isObjectComplexPoint = function (pointObj){
	
	if(typeof pointObj == "object" && typeof pointObj.getImaginaryPart != "undefined"){
		return true;
	}
	else{
		return false;
	}
};

ComplexPlanes.prototype.isObjectComplexPlanes = function (cmplxPlnsObj){
	
	if(typeof cmplxPlnsObj == "object" && typeof cmplxPlnsObj.translateToComplex != "undefined"){
		return true;
	}
	else{
		return false;
	}
};
//-------- END Private Methods ------------------






// The "escape value" specifies how many times we should test a point to see if it exceeds the given "magnitude".
// The "escape value" is an integer (ratios make no sense).  
// The "magnitude" is equivalent to distance (in float height/width) from the origin and it is related to teh Complex Coordinates.
ComplexPlanes.prototype.setEscape = function(escapeVal, magnitude)
{
	if(escapeVal.toString().match(/\./)){
		throw "The escape value must be an integer.";
	}
	
	escapeVal = parseInt(escapeVal);
	magnitude = parseFloat(magnitude);
	
	if(escapeVal <= 0 || magnitude <= 0){
		throw "Error setting the escape parameters.  Both the escape and magnitude must be numbers greater than Zero.";
	}
	
	this.escapeInt = escapeVal;
	this.magnitudeFloat = magnitude;
};
ComplexPlanes.prototype.getMagnitudeBreak = function()
{
	return this.magnitudeFloat;
};

// This object was defined with a mapping between a Cartesian axis and a Complex axis.
// This method will scale the point appropriately and return a Complex Point which is functionally equivalent to the location of the Cartesian one.
ComplexPlanes.prototype.translateToComplex = function(cartesianPoint)
{
	this.ensureCartesian(cartesianPoint);
	
	var gridWidthRatio = this.floatWidth / this.intWidth;
	var gridHeightRatio = this.floatHeight / this.intHeight;
	
	var complexPointObj = new ComplexPoint(gridWidthRatio * cartesianPoint.getXcoord(), gridHeightRatio * cartesianPoint.getYcoord());
	return complexPointObj;
};

// The Cartesian Point will possibly have decimal places returned from his method.
ComplexPlanes.prototype.translateToCartesianFloat = function(complexPoint)
{
	this.ensureComplex(complexPoint);
	
	var gridWidthRatio = this.intWidth / this.floatWidth;
	var gridHeightRatio = this.intHeight / this.floatHeight;
	
	var cartesianPointObj = new CartesianPoint(gridWidthRatio * complexPoint.getRealPart(), gridHeightRatio * complexPoint.getImaginaryPart());
	return cartesianPointObj;
};



// This method is overloaded.  You can pass in a point of type Cartesian or Complex.
// It will return TRUE or FALSE depending on whether or not the given point escapes the magnitude/escape count (which must be set in this object before calling this method).
ComplexPlanes.prototype.doesPointEscape = function(startingPoint, seedPoint)
{
	this.ensureEscapeSet();
	
	if(x > this.intWidth / 2 || y > this.intHeight / 2){
		throw "Error in method doesPointEscapeCartesian.  The point that you are testing falls outside of the canvas you specified.";
	}
	
	if(this.isObjectCartesianPoint(startingPoint)){
		
		if(!this.isObjectCartesianPoint(seedPoint)){
			throw "Error in method doesPointEscapeCartesian.  If the 'pointObj' is of type Cartesian, then the 'seedPoint' must be as well.";
		}
		
		// All that we have to do is just convert the parameters to Complex coordinates and the rest of this method can work the same.
		startingPoint = this.translateToComplex(startingPoint);
		seedPoint = this.translateToComplex(seedPoint);
	}
	else if(this.isObjectComplexPoint(startingPoint)){
		
		if(!this.isObjectComplexPoint(seedPoint)){
			throw "Error in method doesPointEscapeCartesian.  If the 'pointObj' is of type Complex, then the 'seedPoint' must be as well.";
		}
	}
	else{
		throw "Error in method ComplexPlanes.doesPointEscape.  The parameter must be of type Cartesian or Complex.";
	}
	
	var escapeCount = this.getEscapeCount(startingPoint, seedPoint);
	
	if(escapeCount == 0){
		return false;
	}
	else{
		return true;
	}

};


/**
 * The following algorithm employs two separate operations, multiplication and addition. This method will conflate the two and count them both as part of a single cycle.
 * @param {ComplexPoint} startingPoint - This specifies the starting point for the "squaring algorithm".  This point will be repeatedly squared and then immediately added together with the seedPoint.
 * @param {ComplexPoint} seedPoint - Traditionally the starting point and the seed are identical. This method separates the two, giving additional control to the secondary operation (addition).  For example, you could specify a starting point on the grid and set the seedPoint to [0,0] to remove much of the chaos.
 * @returns {Number} - Returns an integer which specifies the number of cycles which the starting point has taken for either...  1) Escaping  2) Giving up after reaching the max escape count. In this case, ZERO is returned. 
 */
ComplexPlanes.prototype.getEscapeCount = function(startingPoint, seedPoint)
{
	this.ensureEscapeSet();

	var complexArithmeticObj = new ComplexArithmetic();
	complexArithmeticObj.ensureComplex(startingPoint);
	complexArithmeticObj.ensureComplex(seedPoint);
	
	var currentPoint = startingPoint;
	
	for(var currentIteration = 1; currentIteration <= this.escapeInt; currentIteration++ ){
		
		currentPoint = complexArithmeticObj.square(currentPoint);

		// There is a big difference between checking the Magnitude after adding the seed back in.
		// By breaking out before the addition, a perfect circle is drawn as the first level.
		// Otherwise, that circle turns into an oval.
		// My vote goes with the "perfect circle".
		if(currentPoint.getMagnitude() > this.magnitudeFloat){
			return currentIteration;
		}
		
		currentPoint = complexArithmeticObj.add(currentPoint, seedPoint);
	}
	
	return 0;
};

/**
 * The "Escape Path" will include the starting point which is being tested.
 * If you were to pass in a ComplexPoint which is already out of bounds, its Square will be returned too (also out of bounds).
 * @param {ComplexPoint} startingPoint - This specifies the starting point for the "squaring algorithm".  This point will be repeatedly squared and then immediately added together with the seedPoint.
 * @param {ComplexPoint} seedPoint - Traditionally the starting point and the seed are identical. This method separates the two, giving additional control to the secondary operation (addition).  For example, you could specify a starting point on the grid and set the seedPoint to [0,0] to remove much of the chaos.
 * @returns {PointsPath} - Returns an object of PointsPath which describes the position of bricks which have been repeatedly squared until possibly ... 1) Escaping  2) Converging upon the origin  3) Giving up after hitting the max escape count.
 */
ComplexPlanes.prototype.getEscapePath = function(startingPoint, seedPoint)
{
	this.ensureEscapeSet();

	// This object will hold a chain of escape points.
	var complexPathObj = new PointsPath();
	complexPathObj.setComplexPlanesObject(this);
	
	var complexArithmeticObj = new ComplexArithmetic();
	complexArithmeticObj.ensureComplex(startingPoint);
	complexArithmeticObj.ensureComplex(seedPoint);
	
	// Add a message which describes the seed.
	complexPathObj.addPoint(startingPoint, 0, 'SEED');
	
	// Set the pointer to the starting complex point. We will keep advancing the "currentPoint" as we square and add in the constant.
	var currentPoint = startingPoint;
	
	for(var currentIteration = 1; currentIteration <= this.escapeInt; currentIteration++ ){
		
		// Square the current point that we are on.
		currentPoint = complexArithmeticObj.square(currentPoint);

		// If the squaring pushes us past our limit, break out of the loop.
		// It is important to break out based on the result of squaring, not adding.
		if(currentPoint.getMagnitude() > this.magnitudeFloat){
			
			// Even though we are breaking out of the loop, we should add the final points to the "return path".
			complexPathObj.addPoint(currentPoint, null, ('Cycle: ' + currentIteration + ') After squaring, magnitude exceeded by ' + (currentPoint.getMagnitude() - this.magnitudeFloat)));
			
			// This addition has no effect upon the escape, however we may want to see both bricks. 1) The brick that tripped the wire after squaring. 2) The addition of the seed on top of the escape brick.
			currentPoint = complexArithmeticObj.add(currentPoint, seedPoint);
			
			// After adding the seed back in, include that within our "return path".
			// There is no point in adding the SEED on top of the square if no change is expected (meaning the seed is point {ZERO,ZERO}).
			if(!seedPoint.isOrigin()){
				complexPathObj.addPoint(currentPoint, null, ('Cycle: ' + currentIteration + ") Added the seed after exceeding magnitude."));
			}

			break;
		}
		
		// After squaring, add the result to the "return path".
		complexPathObj.addPoint(currentPoint, null, ('Cycle: ' + currentIteration + ") After squaring."));
		
		// Add the CONSTANT back in after squaring.
		currentPoint = complexArithmeticObj.add(currentPoint, seedPoint);

		// After adding the seed back in, include that within our "return path", as long as the seed isn't ZERO.
		if(!seedPoint.isOrigin()){
			complexPathObj.addPoint(currentPoint, null, ('Cycle: ' + currentIteration + ") After adding seed."));
		}
	}
	
	return complexPathObj;
};


// Based upon the size of the Cartesian X/Y Size, this method will return a collection of points to test for "escape".
// The points will be returned in a collection object of type PointsPath;
ComplexPlanes.prototype.getCartesianPointsArr = function()
{
	var pointsPathObj = new PointsPath();
	pointsPathObj.setComplexPlanesObject(this);
	
	// The canvas must treat the pixels as fractional parts.
	// The total size is 2 x 2 with negative too.  Total, the perimeter is 16 					4
	// The Sixth Fib number adds up to 20.  1+1+2+3+5+8=20.  						    	  4   4
	// That is just for fun though.																4
	// The axis is related to Zero and it has Width/Height.  This is what changes the perimeter to 16 instead of 20.
	/* 		   2 + 1 + 2
	 * 		2			  2					  4
	 * 		+			  +					4   4
	 * 		1		  	  1					  4
	 * 		+			  +
	 * 		2			  2
	 * 		   2 + 1 + 2
	 */

	// Record every point on the Cartesian plane except for the axis lines (which have Zero coordinates).
	for(var i=1; i<=Math.floor(this.intWidth / 2); i++){
		for(var j=1; j<=Math.floor(this.intHeight / 2); j++){
			
			var ne = new CartesianPoint(i, j);
			var nw = new CartesianPoint(i*-1, j);
			var sw = new CartesianPoint(i*-1, j*-1);
			var se = new CartesianPoint(i, j*-1);
			
			pointsPathObj.addPoint(ne);
			pointsPathObj.addPoint(nw);
			pointsPathObj.addPoint(sw);
			pointsPathObj.addPoint(se);
		}
	}
	
	// Now record all of the points on the X/Y axis, except for the origin itself.
	for(var xAxis=1; xAxis<=Math.floor(this.intWidth / 2); xAxis++){
		
		var west = new CartesianPoint(xAxis *-1, 0);
		var east = new CartesianPoint(xAxis, 0);
		
		pointsPathObj.addPoint(west);
		pointsPathObj.addPoint(east);
	}
	for(var yAxis=1; yAxis<=Math.floor(this.intHeight / 2); yAxis++){
		
		var north = new CartesianPoint(0, yAxis);
		var south = new CartesianPoint(0, yAxis * -1);
		
		pointsPathObj.addPoint(north);
		pointsPathObj.addPoint(south);
	}
	
	// And finally, the cherry on top.
	var origin = new CartesianPoint(0, 0);
	pointsPathObj.addPoint(origin);
	
	return pointsPathObj;
};

