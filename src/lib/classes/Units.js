

/*
 * After creating the "Unit Objects", they may be daisy chained in a series by calling the methods setSuperUnit() and setSubUnit().
 */
function Unit(unitName)
{
	if(unitName == ""){
		throw "You must supply a unit name to the constructor.";
	}
	
	this.unit = unitName;
	
	this.unitPlural = null;
	
	// Holds an ID for a JavaScript setInterval timer.
	this.intervalID = 0;
	
	// We go through 4 nibble cycles on the 'rear sphere', and then 4 more for the 'near sphere'.
	// This true/false flag lets us double the quadrants from 4 to 8. 
	// We start out on 'rear sphere' at SE if you were to cut an apple in half, looking into the face with a core.
	// We start out with FALSE because it flips this bit in the 1st quadrant before checking the value.
	this.currentlyRearSphere = true;
	
	// Only 1 interval in the chain be be active at one time. 
	// Therefore, at most, 1 object in the chain may have this variable set to TRUE.
	this.intervalPaused = false;
	
	
	this.intervalGlobalCounter = 0;
	this.intervalMilliseconds = 0;
	this.intervalPauseAtRelQuadNum = 0;
	this.intervalPauseAtAbsVal = 0;
	
	// This is like an auto-increment for each "Unit Object" the increases with every "increment".
	this.absoluteUnitCounter = 0;
	
	// This will hold a references to the next higher/lower unit... such as "Days -> Months".
	// Storing Units in this fashion eliminates the need to use Arrays.
	this.subUnitObj = null;
	this.superUnitObj = null;
	
	// This is the heart of the universe's counting mechanism.
	this.doubleNibble = new DoubleNibble();
	
	// Whenever the double nibble makes contact with the equator, we want it to call the method within our "Current Unit Object".
	// When a "Sub Unit" makes contact with the equator, it will send a signal to the "Current Unit" to increment its counter by 1. 
	this.doubleNibble.onTouchEast(this.event_TouchedEast, this);
	this.doubleNibble.onTouchWest(this.event_TouchedWest, this);
	this.doubleNibble.onTouchEquator(this.event_TouchedEquator, this);
	this.doubleNibble.onCrossNorth(this.event_CrossedNorth, this);
	this.doubleNibble.onCrossSouth(this.event_CrossedSouth, this);
	this.doubleNibble.onCrossPole(this.event_CrossedPole, this);
	
	// Values 0-8.  
	// If the "current quarter" is set to 0, it means that the "Unit" is not in use.
	this.currentQuadNum = 0; 
	
	// Think of the Pinky Finger as the "One Spot" and the Index Finger as the "Eight Spot".
	// Therefore the the "One Spot" is always on the outside.
	// If there are ZEROS filling up the "Cycle Indicator", then count with the appropriate hand with "Palms Down". 
	// One ONES fill up the "Cycle Indicator", count with the "Palms Up".
	// The following values show binary data with "Palms Down".  Zeros are assumed to exist outside in empty space.
	this.leftHand =  new Array("0000", "1000", "0100", "1100", "0010", "1010", "0110", "1110", "0001", "1001", "0101", "1101", "0011", "1011", "0111", "1111");
	this.rightHand = new Array("0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001", "1010", "1011", "1100", "1101", "1110", "1111");
	
	
	
	// Data Events
	this.onChangeEvents = new Events();
	this.onInitEvents = new Events();
	this.onResetEvents = new Events();
	
	// Equator Events
	this.onTouchWestEvents = new Events();
	this.onTouchEastEvents = new Events();
	this.onTouchEquatorEvents = new Events();

	// Pole Events
	this.onCrossNorthEvents = new Events();
	this.onCrossSouthEvents = new Events();
	this.onCrossPoleEvents = new Events();
	
	// Interval Events (Specific to the "Current Unit")
	this.onIntervalBeginEvents = new Events();
	this.onIntervalClearEvents = new Events();
	this.onIntervalPauseEvents = new Events();
	this.onIntervalResumeEvents = new Events();
	this.onIntervalFocusEvents = new Events();
	this.onIntervalBlurEvents = new Events();
	
	// Interval Events (Broadcast to the "Current Unit" from a related event in the "Unit Chain")
	this.onIntervalBegin_Any_Events = new Events();
	this.onIntervalClear_Any_Events = new Events();
	this.onIntervalPause_Any_Events = new Events();
	this.onIntervalResume_Any_Events = new Events();
	this.onIntervalFocus_Any_Events = new Events();
	this.onIntervalBlur_Any_Events = new Events();
	
	// Sphere Events 1-4 versus 5-8
	this.onSphereNearEvents = new Events();
	this.onSphereRearEvents = new Events();
}

Unit.prototype.getUnitName = function()
{
	return this.unit;
};


// Will default to the primary name if the plural version has not been set yet.
Unit.prototype.getUnitNamePlural = function()
{
	if(this.unitPlural == null){
		return this.unit;
	}
	
	return this.unitPlural;
};

Unit.prototype.setUnitNamePlural = function(pluralName)
{
	this.unitPlural = pluralName;
};

Unit.prototype.resetData = function()
{
	this.doubleNibble.reset();
	this.currentQuadNum = 0; 
	this.absoluteUnitCounter = 0;
	this.currentlyRearSphere = true;
	
	this.onResetEvents.fire();
};

// Normally you shouldn't find a any Unit Object sitting on the Poles, unless it is caught momentarily with an event.
Unit.prototype.isOnAxis = function()
{
	switch(this.getQuadrant()){
	case "N" :
	case "S" :
	case "E" :
	case "W" :
		return true;
	}
	
	return false;
};


Unit.prototype.isSphereRear = function()
{
	return this.currentlyRearSphere;
};

// Because it is only looking forward, there are no fractions to worry about.
// In the very beginning, the ratio of the "Super Unit Projected Values" to the "Absolute Unit Value" will be wide.  
// That is because the "Super Unit" increments by 1 after just 14 sub-cycle increments.
// The value returned here does not include the value held within its own object. 
// It returns a value that the Super Unit would "guess at" for its Sub Unit,
Unit.prototype.getValueEstimateFromSuper = function()
{
	if(this.superUnitObj != null){
		return (29 * this.superUnitObj.getValueAbsolute());
	}
	
	return 0;
};


// If Zero is returned, it means the "Unit Object" has not been used yet.
// A value of 1 means the the Unit is positioned at either
// SW 1 [0000-1110] ... or ... NE 1 [1111-1000]
// The MAX value is 29, positioned at either ...
// W [1111-0000] ... or ... E [0000-1111]
// The value range includes "rest stops" on the equator, not on the poles.
// If you want to start counting from 1 initially on the South Pole (only the first time), pass in TRUE as a parameter to the method.
// Otherwise you will be starting at 15 as the Unit object increments its first value.
Unit.prototype.getValueRelativeToHemisphere = function(beginWithOne)
{
	if(beginWithOne){
		if(this.absoluteUnitCounter < 15){
			return this.getValueQuadrant();
		}
	}
	
	var retVal = 0;
	
	if(!this.isActive()){
		return 0;
	}
	
	if(this.getQuadrant() == "W" || this.getQuadrant() == "E"){
		return 29;
	}
	
	// Southern Hemisphere
	switch(this.currentQuadNum){
	
	case 1:
	case 5:
	case 4:
	case 8:
		
		if(this.currentQuadNum == 1 || this.currentQuadNum == 5){
			retVal += 14;
			retVal += this.getValueQuadrant();
		}
		else if(this.currentQuadNum == 4 || this.currentQuadNum == 8){
			retVal += 15 - this.getValueQuadrant();
		}
		
		break;
	case 2:
	case 6:
	case 3:
	case 7:
		
		if(this.currentQuadNum == 2 || this.currentQuadNum == 6){
			retVal += this.getValueQuadrant();
		}
		else if(this.currentQuadNum == 3 || this.currentQuadNum == 7){
			retVal += 14;
			retVal += 15 - this.getValueQuadrant();
		}
		
		break;
	}
	
	return retVal;
};

//Returns the bottom "Unit Object" within the chain.
//If there aren't any lower units, then it will return a reference to itself.
Unit.prototype.getUnitObjInChainAtBottom = function()
{
	var loop_Unit = this;
	
	while(true){
		if(loop_Unit.subUnitObj == null){
			break;
		}
		loop_Unit = loop_Unit.subUnitObj;
	}
	
	return loop_Unit;
};

Unit.prototype.getUnitObjInChainAtTop = function()
{
	var loop_Unit = this;
	
	while(true){
		if(loop_Unit.superUnitObj == null){
			break;
		}
		loop_Unit = loop_Unit.superUnitObj;
	}
	
	return loop_Unit;
};

// Returns a reference to the object in the chain based upon its "unit name" (passed into the constructor).
// If the Unit name can not be found, this method will return NULL.
Unit.prototype.getUnitObjInChainByName = function(unitName)
{
	var loop_Unit = this.getUnitObjInChainAtBottom();
	
	while(loop_Unit != null){
		if(loop_Unit.unit == unitName){
			return loop_Unit;
		}
		loop_Unit = loop_Unit.superUnitObj;
	}
	
	return null;
};

// Returns the Unit Object within the chain which has the "timer focus".  
// This method works the same for all Units within the chain.
// There must be an object with an interval currently running, or it may be paused.
// If neither of those conditions are met, this method will return NULL.
Unit.prototype.intervalGetUnitObjectWithFocus = function()
{
	return this.getUnitObjInChainByName(this.intervalGetUnitNameWithFocus());
};


Unit.prototype.getArcNumber = function()
{
	return this.twibble.getArcNumber();
};




// -------------------  Begin Event Subscriptions --------------------------

/* Data Events */
Unit.prototype.onChange = function(funcName, objRef)
{
	this.onChangeEvents.addSubscription(funcName, objRef);
};

Unit.prototype.onInit = function(funcName, objRef)
{
	this.onInitEvents.addSubscription(funcName, objRef);
};

Unit.prototype.onReset = function(funcName, objRef)
{
	this.onResetEvents.addSubscription(funcName, objRef);
};


/* Pole Events */
Unit.prototype.onCrossNorth = function(funcName, objRef)
{
	this.onCrossNorthEvents.addSubscription(funcName, objRef);
};

Unit.prototype.onCrossSouth = function(funcName, objRef)
{
	this.onCrossSouthEvents.addSubscription(funcName, objRef);
};

Unit.prototype.onCrossPole = function(funcName, objRef)
{
	this.onCrossPoleEvents.addSubscription(funcName, objRef);
};


/* Equator Events */
Unit.prototype.onTouchWest = function(funcName, objRef)
{
	this.onTouchWestEvents.addSubscription(funcName, objRef);
};

Unit.prototype.onTouchEast = function(funcName, objRef)
{
	this.onTouchEastEvents.addSubscription(funcName, objRef);
};

Unit.prototype.onTouchEquator = function(funcName, objRef)
{
	this.onTouchEquatorEvents.addSubscription(funcName, objRef);
};


/* 
 * Interval Events (local scope)
 */
Unit.prototype.onIntervalBegin = function(funcName, objRef)
{
	this.onIntervalBeginEvents.addSubscription(funcName, objRef);
};

Unit.prototype.onIntervalClear = function(funcName, objRef)
{
	this.onIntervalClearEvents.addSubscription(funcName, objRef);
};

Unit.prototype.onIntervalPause = function(funcName, objRef)
{
	this.onIntervalPauseEvents.addSubscription(funcName, objRef);
};

Unit.prototype.onIntervalResume = function(funcName, objRef)
{
	this.onIntervalResumeEvents.addSubscription(funcName, objRef);
};

Unit.prototype.onIntervalFocus = function(funcName, objRef)
{
	this.onIntervalFocusEvents.addSubscription(funcName, objRef);
};

Unit.prototype.onIntervalBlur = function(funcName, objRef)
{
	this.onIntervalBlurEvents.addSubscription(funcName, objRef);
};


/* 
 * Interval Events (broadcast)
 */
Unit.prototype.onIntervalBegin_Any = function(funcName, objRef)
{
	this.onIntervalBegin_Any_Events.addSubscription(funcName, objRef);
};

Unit.prototype.onIntervalClear_Any = function(funcName, objRef)
{
	this.onIntervalClear_Any_Events.addSubscription(funcName, objRef);
};

Unit.prototype.onIntervalPause_Any = function(funcName, objRef)
{
	this.onIntervalPause_Any_Events.addSubscription(funcName, objRef);
};

Unit.prototype.onIntervalResume_Any = function(funcName, objRef)
{
	this.onIntervalResume_Any_Events.addSubscription(funcName, objRef);
};

Unit.prototype.onIntervalFocus_Any = function(funcName, objRef)
{
	this.onIntervalFocus_Any_Events.addSubscription(funcName, objRef);
};

Unit.prototype.onIntervalBlur_Any = function(funcName, objRef)
{
	this.onIntervalBlur_Any_Events.addSubscription(funcName, objRef);
};



/* Sphere Events */
Unit.prototype.onSphereNear = function(funcName, objRef)
{
	this.onSphereNearEvents.addSubscription(funcName, objRef);
};

Unit.prototype.onSphereRear = function(funcName, objRef)
{
	this.onSphereRearEvents.addSubscription(funcName, objRef);
};

//-------------------  End Event Subscriptions --------------------------





// These method are called as an "event" from the "Nibble Object". 
// Whenever we cross the equator, we need to increment the Super Unit.
Unit.prototype.event_TouchedWest = function()
{
	this.onTouchWestEvents.fire();
};

Unit.prototype.event_TouchedEast = function()
{
	this.onTouchEastEvents.fire();
};

Unit.prototype.event_TouchedEquator = function()
{
	if(this.superUnitObj == null){
		throw "The equator was touched on unit: '"+this.getUnitName()+"'. There is no Super Unit available to increment.";
	}

	this.onTouchEquatorEvents.fire();
	
	// Don't increment the Super Unit until we have fired off the events.
	this.superUnitObj.event_incrementFromSubUnit();
};

// These method are called as an "event" from the "Nibble Object".  
// While they don't do anything useful (because we skip over the "beat", they let us know that it is time to "invert".
// The counting is handled within this object (and possibly many Super/Sub Units).  
// All that we are doing here is forwarding "pole events" from the "Nibble Object" to event-subscribers of this "Unit Object" (just an interface).
Unit.prototype.event_CrossedNorth = function()
{
	this.onCrossNorthEvents.fire();
};

Unit.prototype.event_CrossedSouth = function()
{
	this.onCrossSouthEvents.fire();
	
	// The Double Nibble object is only keeping track of 
	// We are going to re-use the DN object for all 8 quadrants by flipping this bit whenever the DN hits "SE".
	// This will only occur when we reach the South Pole.
// I am starting to wonder if it should happen when we touch the East equator.  Maybe there is no Sphere for the first 14?

	this.currentlyRearSphere = !this.currentlyRearSphere;	
		
};

Unit.prototype.event_CrossedPole = function()
{
	this.onCrossPoleEvents.fire();
};



// In order to count past 14, the Unit object requires a "Super Unit".
// It must be an object of this class, like a "linked list".
Unit.prototype.setSuperUnit = function(superUnitObjToLink)
{
	if(!this.isObjectOfUnitClass(superUnitObjToLink)){
		throw "The method Unit.setSuperUnit(superUnitObjToLink) only accepts objects of the class 'Unit'.";
	}
	
	if(this.superUnitObj != null){
		throw "This object already has its Super Unit set.";
	}
	
	var loop_unitObj = this;
	
	// Make sure that the "Super Unit" being added does not conflict with any of the names of the current Unit Object.
	// If the current unit has 1 or more Sub-Units, recursively check for collisions against the Super Unit being added.
	while(loop_unitObj != null){
		this.checkForNamingCollissions(loop_unitObj, superUnitObjToLink);
		loop_unitObj = loop_unitObj.subUnitObj;
	}
	
	// A circular dependency could be created if the Super-Unit being added has its own chain of Super-Units, one of which may point back to the current object.
	loop_unitObj = superUnitObjToLink.superUnitObj;
	
	while(loop_unitObj != null){
		this.checkForNamingCollissions(loop_unitObj, this);
		loop_unitObj = loop_unitObj.superUnitObj;
	}
	
	// Store a reference to the Super Unit in our current class.
	this.superUnitObj = superUnitObjToLink;
	
	// Look ahead in the Super Unit and set its "Sub Unit" to the current object.
	this.superUnitObj.subUnitObj = this;
};

Unit.prototype.setSubUnit = function(subUnitToLink)
{
	if(!this.isObjectOfUnitClass(subUnitToLink)){
		throw "The method Unit.setSubUnit(subUnitToLink) only accepts objects of the class 'Unit'.";
	}
	
	if(subUnitToLink.superUnitObj != null){
		throw "You are trying to set a Sub Unit on an object which already has its Super Unit configured.";
	}
	
	if(this.subUnitObj != null){
		throw "You can't assign a Sub Unit to this object more than once.";
	}
	
	var loop_unitObj = this;
	
	// Make sure that the "Super Unit" being added does not conflict with any of the names of the current Unit Object.
	// If the current unit has 1 or more Super-Units, recursively look ahead for collisions against the Sub Unit being added.
	while(loop_unitObj != null){
		this.checkForNamingCollissions(loop_unitObj, subUnitToLink);
		loop_unitObj = loop_unitObj.superUnitObj;
	}
	
	// A circular dependency could be created if the Sub-Unit being added has its own chain of Sub-Units, one of which may point back to the current object.
	loop_unitObj = subUnitToLink.subUnitObj;
	
	while(loop_unitObj != null){
		this.checkForNamingCollissions(loop_unitObj, this);
		loop_unitObj = loop_unitObj.subUnitObj;
	}
	
	// The Sub Unit should point its Super Unit at us.
	subUnitToLink.superUnitObj = this;

	this.subUnitObj = subUnitToLink;
};

Unit.prototype.isObjectOfUnitClass = function(objectToCheck){
	
	if(typeof objectToCheck != "object" || typeof objectToCheck.unit == "undefined" || typeof objectToCheck.setSuperUnit == "undefined"){
		return false;
	}
	
	return true;
};

Unit.prototype.checkForNamingCollissions = function(unitObj1, unitObj2){
	
	// The main unit descriptions
	if(unitObj1.unit == unitObj2.unit){
		throw "Naming collission between Unit Names: '" + unitObj1.unit + "'. Ensure that you haven't created a circular dependency between Super/Sub units.";
	}
	
	// The Quarter Unit Descriptions
	if(unitObj1.quarter1 != null){
		if(unitObj1.quarter1 == unitObj2.quarter1){
			throw "Naming collission between First Unit Quarters: '" + unitObj1.quarter1 + "'.";
		}
		if(unitObj1.quarter2 == unitObj2.quarter2){
			throw "Naming collission between Second Unit Quarters: '" + unitObj1.quarter2 + "'.";
		}
		if(unitObj1.quarter3 == unitObj2.quarter3){
			throw "Naming collission between Third Unit Quarters: '" + unitObj1.quarter3 + "'.";
		}
		if(unitObj1.quarter4 == unitObj2.quarter4){
			throw "Naming collission between Fourth Unit Quarters: '" + unitObj1.quarter4 + "'.";
		}
	}

};


// Returns a JSON string of the current object as well as all Sub/Super Units (if any).
Unit.prototype.jsonUnitChain = function()
{
	var returnStr = '{\n';
	returnStr += '"unitCollection":\n';
	returnStr += '[\n';
	
	var jsonAbove = this.jsonUnitsAbove();
	var jsonBelow = this.jsonUnitsBelow();
	
	returnStr += jsonAbove;
	
	if(jsonAbove != ""){
		returnStr += ',\n';
	}
	
	returnStr += this.jsonUnit(this);

	if(jsonBelow != ""){
		returnStr += ',\n';
	}

	returnStr += this.jsonUnitsBelow();
	
	returnStr += '\n]\n';
	
	returnStr += '\n}\n';
	return returnStr;
};


// The largest "Super Unit" will be listed first within the JSON string.
// It does not include the "Current Unit".
// If a "Super Unit" is not attached to the "Current Unit", a blank string will be returned.
Unit.prototype.jsonUnitsAbove = function()
{
	
	var returnStr = "";
	
	if(this.superUnitObj == null){
		return returnStr;
	}
	
	var loop_unitObj = this.superUnitObj;
	
	// We are going to collect the data going forward with the highest "Super Unit" at the end of the Array.
	var arrayForReverse = new Array();
	while(loop_unitObj != null){
		arrayForReverse.push(this.jsonUnit(loop_unitObj));
		loop_unitObj = loop_unitObj.superUnitObj;
	}
	
	for(var i = arrayForReverse.length; i >=1; i--){
	
		// Prefix line breaks (after the first loop), rather than subtract line breaks later.
		if(returnStr.length > 0){
			returnStr += ",\n";
		}
		
		returnStr += arrayForReverse[i-1];
	}
	
	return returnStr;
};

// This will return a string describing the collection of "Sub Units" below the current object.
//If a "Sub Unit" is not attached to the "Current Unit", a blank string will be returned.
Unit.prototype.jsonUnitsBelow = function()
{
	var returnStr = "";
	
	if(this.subUnitObj == null){
		return returnStr;
	}
	
	var loop_unitObj = this.subUnitObj;
	
	while(loop_unitObj != null){
		
		// Prefix line breaks (after the first loop), rather than subtract line breaks later.
		if(returnStr.length > 0){
			returnStr += ",\n";
		}
		
		returnStr += this.jsonUnit(loop_unitObj);

		loop_unitObj = loop_unitObj.subUnitObj;
	}
	
	return returnStr;
};

// Returns a JSON representation of the Unit Object passed to this method.
Unit.prototype.jsonUnit = function(unitObj)
{
	if(!this.isObjectOfUnitClass(unitObj)){
		throw "The method Unit.jsonUnit(unitObj) only accepts objects of the class 'Unit'.";
	}
	
	var retStr = '{' + "\n";
	
	retStr += '\t"unitName": "' + unitObj.unit + '",\n';
	
	if(unitObj.quarter1 != null){
		retStr += '\t"quarters" :' + "\n";
		retStr += '\t{\n';
		retStr += '\t\t"one": "' + unitObj.quarter1 + '",\n';
		retStr += '\t\t"two": "' + unitObj.quarter2 + '",\n';
		retStr += '\t\t"three": "' + unitObj.quarter3 + '",\n';
		retStr += '\t\t"four": "' + unitObj.quarter4 + '"\n';
		retStr +=  '\t},\n';
	}
	
	if(unitObj.superUnitObj != null){
		retStr += '\t"superUnitName": "' + unitObj.superUnitObj.unit + '",\n';
	}
	else{
		retStr += '\t"superUnitName": ' + null + ',\n';
	}
	
	if(unitObj.subUnitObj != null){
		retStr += '\t"subUnit": "' + unitObj.subUnitObj.unit + '",\n';
	}
	else{
		retStr += '\t"subUnit": ' + null + ',\n';
	}
	
	retStr += '\t"doubleNibble": "' + unitObj.getNibbleDouble('-') + '",\n';
	retStr += '\t"quadrant": "' + unitObj.getQuadrant() + '",\n';
	retStr += '\t"quarter": "' + unitObj.getQuadrantNumber() + '",\n';
	retStr += '\t"integerValue": "' + unitObj.getValueQuadrant()  + '",\n';
	
	if(unitObj.getQuadrantNumber() == 0){
		retStr += '\t"activated": ' + false + '\n';
	}
	else{
		retStr += '\t"activated": ' + true + '\n';
	}
	
	retStr += '}';
	
	return retStr;
};

// Returns a value with the range of 0-15.  
// Zero & Fifteen are reserved for the RESET positions on the N,S,E,W markers.
Unit.prototype.getValueQuadrant = function()
{
	return this.doubleNibble.getInteger();
};

// As the value increments around the unit circle, this will always start out with 1 and go to 15.
// In contrast, the method getValueQuadrant() counts backwards on the left half of the unit circle.
Unit.prototype.getValueRelativeToQuadrant = function()
{
	var returnVal = this.doubleNibble.getInteger();
	
	var quad = this.doubleNibble.getQuadrant();
	
	switch (quad){
	case "N" :
	case "S" :
	case "E" :
	case "W" :
		return 0;
	case "NW" :
	case "SW" :
		returnVal = 15 - returnVal;
		break;
	}
	
	return returnVal;
};

Unit.prototype.getQuadrant = function()
{
	return this.doubleNibble.getQuadrant();
};

/*
 * This will return a value within the range of 0-8.
 * The only time Zero will be returned is if the "Unit Object" hasn't been used.
 * Rear Sphere:
 * 		Quarter 1: Values in the range of ["South Pole" - "South East"]
 * 		Quarter 2: Values in the range of ["Eastern Equator" - "North East"]
 * 		Quarter 3: Values in the range of ["North Pole" - "North West"]
 * 		Quarter 4: Values in the range of ["Western Equator" - "South West"]
 * Near Sphere:
 * 		Quarter 5: Values in the range of ["South Pole" - "South East"]
 * 		Quarter 6: Values in the range of ["Eastern Equator" - "North East"]
 * 		Quarter 7: Values in the range of ["North Pole" - "North West"]
 * 		Quarter 8: Values in the range of ["Western Equator" - "South West"]
 */
Unit.prototype.getQuadrantNumber = function()
{
	return this.currentQuadNum;
};

Unit.prototype.isActive = function()
{
	if(this.currentQuadNum == 0){
		return false;
	}
	return true;
};

// You must coordinate the value of a "Single Nibble" with a Quadrant Name (or a Quarter Number) to know the location on the Unit Circle.
Unit.prototype.getNibbleSingle = function()
{
	if(this.doubleNibble.isLeftTurn()){
		if(this.doubleNibble.isBottomTurn()){
			return this.leftHand[this.doubleNibble.getInteger()];
		}
		else{
			// For the NW Quadrant, invert the left hand (palm's up) by taking the value from the right hand (palm's down).
			return this.rightHand[this.doubleNibble.getInteger()];
		}
	}
	else{
		if(this.doubleNibble.isBottomTurn()){
			return this.rightHand[this.doubleNibble.getInteger()];
		}
		else{
			// For the NE Quadrant, invert the values on the right hand.
			return this.leftHand[this.doubleNibble.getInteger()];
		}
	}
};

// Returns a string accurately describing the location on a unit circle. 
// Pass in a "Separator String" if you want to visually separate the Left & Right nibbles.
Unit.prototype.getNibbleDouble = function(separator)
{
	if(this.doubleNibble.isLeftTurn()){
		if(this.doubleNibble.isBottomTurn()){
			return this.getNibbleSingle() + separator + "0000"; // South East
		}
		else{
			return this.getNibbleSingle() + separator + "1111"; // North West
		}
	}
	else{
		if(this.doubleNibble.isBottomTurn()){
			return "0000" + separator + this.getNibbleSingle(); // South West
		}
		else{
			return "1111" + separator + this.getNibbleSingle(); // North East
		}
	}
};




//When a Sub-Unit crosses the equator, it will fire off an event to its "Super Unit" so that it may increment its value.
Unit.prototype.event_incrementFromSubUnit = function()
{
	// If the "Current Quarter" is set to Zero, it means that we haven't started using it yet.
	// This will happen as we first begin counting, and also when the "event chain" causes Super Units to become activated.
	if(!this.isActive()){
		
		this.currentQuadNum = 1;
		
		// Fire off events to anyone interested in knowing when this Unit Of Measurement is used for the first time.
		this.onInitEvents.fire();
	}
	
	// This is like an Auto-increment ID for the current "Unit Object" that starts with 1 and just keeps increasing.
	// While we will never use large numbers like this in the real world, it is useful to extract these imaginary values so people can compare.
	this.absoluteUnitCounter++;

	// This will increment the "binary nibbles" that belong to this object.
	// If a significant event occurs (like going out of bounds), the "Double Nibble Object" will fire an event back to this "Unit Object".
	this.doubleNibble.increment();
	
	// Digest the 8 possible quadrant outcomes into 4 (in case anything changed).  
	var quad = this.doubleNibble.getQuadrant();
	
	// We are about to flip the bit, so add 4 when it appears to be on the Rear Sphere when really we want the Near Sphere to get the extra 4 values.
	if(this.currentlyRearSphere){
		this.currentQuadNum = 4;
	}
		
	if     (quad == "S" || quad == "SE"){
		this.currentQuadNum = 1;
	}
	else if(quad == "E" || quad == "NE"){
		this.currentQuadNum = 2;
	}
	else if(quad == "N" || quad == "NW"){
		this.currentQuadNum = 3;
	}
	else if(quad == "W" || quad == "SW"){
		this.currentQuadNum = 4;
	}
	else{
		throw "The quadrant name is unknown in 'rear sphere'.";
	}
	
	if(!this.currentlyRearSphere){
		this.currentQuadNum += 4;
	}
	
	// Now that we have incremented, fire off event(s) that something on this object has changed.
	this.onChangeEvents.fire();

	if(this.intervalPauseAtRelQuadNum > 0 && this.getValueRelativeToQuadrant() == this.intervalPauseAtRelQuadNum){
		this.intervalPauseAny();
	}
	if(this.intervalPauseAtAbsVal > 0 && this.getValueAbsolute() == this.intervalPauseAtAbsVal){
		this.intervalPauseAny();
	}
};

Unit.prototype.increment = function()
{
	// If there are no "Sub Units", then we can increment the value directly.
	if(this.subUnitObj == null){
		this.event_incrementFromSubUnit();
		return;
	}
	
	// Otherwise, we can't just increment the current value of this object.
	// There could be lots of events hooked up to drawing API's and things.
	// Therefore, we will keep incrementing the lowest Unit in the chain until we see our current value increase by 1.
	var stopOnAbsoluteUnitValue = this.absoluteUnitCounter + 1;
	
	var bottomUnitObj = this.getUnitObjInChainAtBottom();
	
	while(this.absoluteUnitCounter < stopOnAbsoluteUnitValue){
		bottomUnitObj.increment();
	}
};


Unit.prototype.getValueAbsolute = function()
{
	return this.absoluteUnitCounter;
};

// Will return a description of the brick without any spaces.
// This is useful for naming the bricks in 3D software, but it doesn't change the functionality.  
// The Great Pyramid had markings on each brick for a similar purpose.
Unit.prototype.getBrickName = function()
{
	var brickName = this.getUnitName() + "_" + (this.isSphereRear() ? "R_" : "N_");
	brickName += this.getQuadrant() + "_" + this.getValueRelativeToQuadrant();
	brickName += "_Abs" + this.getValueAbsolute();
		
	brickName = brickName.replace(/[^\w\d]/g, "");
	
	return brickName;
};




Unit.prototype.isCurrentValueEven = function()
{
	var quad = this.doubleNibble.getQuadrant();
	
	// The very first value [1000-0000] occurs after the South Pole Reset [0000-0000].  Therefore, the first value is considered "odd".
	// Because we rest a beat on the equator, the first time the EAST equator is touched, it is considered odd (the 15th beat).
	if(quad == "E"){
		return false;
	}
	else if(quad == "W"){
		return true;
	}
	// We are not supposed to rest on the Poles.
	// If for some reason this method is called in between (maybe from an event), consider it to be whatever the next value will become.
	if(quad == "N"){
		return true;
	}
	if(quad == "S"){
		return false;
	}
	
	// The right hand's integer values are inverted.  Meaning, 7 is "even" and 6 if "odd".
	// The left hand's integer values are consistent with what you would normally expect.
	var integerValue = this.doubleNibble.getInteger();
	
	if(!this.doubleNibble.isLeftTurn()){
		integerValue += 1;
	}
	
	if(integerValue % 2 == 0){
		return true;
	}
	else{
		return false;
	}
};






//---------------  Interval Related Functions ------------------------------------------

Unit.prototype.intervalGetGlobalCounter = function()
{
	var unitWithInterval = this.intervalGetUnitObjectWithFocus();
	
	if(unitWithInterval == null){
		return 0;
	}
	
	return unitWithInterval.intervalGlobalCounter;
};


//For a Memory Intensive Task, we may want to set a "break point" on a Super Unit so that the routine knows when to stop.
// Zero means "no pause".
Unit.prototype.intervalPauseAtRelativeQuadrantNum = function(quadrantRelativeNumber)
{
	if(quadrantRelativeNumber > 15 || quadrantRelativeNumber < 0){
		throw "The value passed into intervalPauseAtQuadrantNum is out of range.";
	}
	
	this.intervalPauseAtRelQuadNum = quadrantRelativeNumber;
	
};
Unit.prototype.intervalPauseAtAbsoluteUnitValue = function(unitAbsoluteValue)
{
	if(unitAbsoluteValue < 0){
		throw "The value passed into intervalPauseAtAbsoluteValue must be greater than zero.";
	}
	
	this.intervalPauseAtAbsVal = unitAbsoluteValue;
};

// Returns 0 if the event hasn't been set.
Unit.prototype.intervalGetAbsoluteUnitValuePause = function()
{
	return this.intervalPauseAtAbsVal;
};

//Returns the name of the unit which is currently attached to a timer.
//If there are no Unit Objects running on an interval (or Paused), this method will return NULL.
Unit.prototype.intervalGetUnitNameWithFocus = function()
{
	var loop_Unit = this.getUnitObjInChainAtBottom();
	
	while(loop_Unit != null){
		
		if(loop_Unit.intervalPaused){
			return loop_Unit.unit;
		}
		else if(loop_Unit.intervalID > 0){
			return loop_Unit.unit;
		}
		loop_Unit = loop_Unit.superUnitObj;
	}
	
	return null;
};

//Because there can only be 1 Unit Object in the chain running on an interval, this will change the Unit Object which controls the rest.
//Make sure there is an interval running on one of the objects within the chain.  
//Then call this method upon the object for which the timer should be focused.
Unit.prototype.intervalFocus = function()
{
	var unitWithInterval = this.intervalGetUnitObjectWithFocus();
	
	if(unitWithInterval == null){
		throw "You can't focus the interval onto a Unit Object unless a timer is already running.";
	}
	
	// If there is an interval currently running, clear it.
	if(unitWithInterval.intervalIsPaused()){
		
		// In case the old Unit was paused, just switch the "Paused flags", but don't start it.
		unitWithInterval.intervalPaused = false;
		this.intervalPaused = true;
	}
	else{
		
		// This is an easier way to stop/switch/start the timer between Units.
		clearInterval(unitWithInterval.intervalID);
		unitWithInterval.intervalID = 0;
		
		this.intervalPaused = true;
		this.intervalResume();
	}
	
	// Call this Blur event before the focus.  We can't have the focus on 2 places at once.  
	this.onIntervalBlurEvents.fire();
	this.event_Broadcast("onIntervalBlur");
	
	// Also, we might try to call focus on an object which already has the focus.  We wouldn't want to be left in a "blurred state".
	this.onIntervalFocusEvents.fire();
	this.event_Broadcast("onIntervalFocus");
};


//If there are Sub/Super units linked to this Unit Object, it will attempt to cancel any timers which they have running.
//There should only be 1 "Father Time" running the show.
Unit.prototype.intervalSet = function(milliseconds)
{
	// Disable all timers.
	this.intervalClear();
	
	this.intervalMilliseconds = milliseconds;
	
	// To scope the call-back from setInterval (a global function), we need to assign a reference 
	// to our current object ("this") and run the interval inside of an anonymous function.
	var scopeThis = this;
	this.intervalID = setInterval(function (){
		scopeThis.intervalGlobalCounter++;
		scopeThis.increment();
		}, milliseconds);
	
	// Fire off an event for this object letting an interested party know that a timer has started on this Unit Object. 
	this.onIntervalBeginEvents.fire();
	this.event_Broadcast("onIntervalBegin");
};

Unit.prototype.intervalPauseAny = function()
{
	var unitWithInterval = this.intervalGetUnitObjectWithFocus();

	// If there is no interval running, it won't hurt to call this method.
	if(unitWithInterval == null){
		return;
	}
	
	unitWithInterval.intervalPause();
};

//Will not clear the Auto-increment ID's on the global timer if you Pause and Resume.
Unit.prototype.intervalPause = function()
{
	var unitWithInterval = this.intervalGetUnitObjectWithFocus();

	
	if(unitWithInterval.getUnitName() != this.unit){
		throw "You can't pause a Timer on a Unit Object which does not have the focus.  Maybe you should call Unit.intervalPauseAny() ?";
	}
	
	clearInterval(this.intervalID);
	this.intervalID = 0;
	
	this.intervalPaused = true;
	
	this.onIntervalPauseEvents.fire();
	this.event_Broadcast("onIntervalPause");
};

Unit.prototype.intervalResume = function()
{
	var unitWithInterval = this.intervalGetUnitObjectWithFocus();
	
	if(unitWithInterval.getUnitName() != this.unit){
		throw "You can't resume a Timer on a Unit Object which does not have the focus.";
	}
	
	// This would mean that someone double-clicked on an Resume button.
	if(!this.intervalPaused){
		return;
	}
	
	this.intervalPaused = false;
	
	var scopeThis = this;
	
	this.intervalID = setInterval(function (){
		scopeThis.intervalGlobalCounter++;
		scopeThis.increment();
		}, this.intervalMilliseconds);
	
	this.onIntervalResumeEvents.fire();
	this.event_Broadcast("onIntervalResume");
};

// Returns true if an interval has been paused on the "Current Unit Object".
// It does not tell you if there is another Unit in the chain with a paused timer.
Unit.prototype.intervalIsPaused = function()
{
	return this.intervalPaused;
};

//Calling "setInterval" will erase the global counter.  
//This will allow you to change the timing on an interval which is currently running (or paused).
Unit.prototype.intervalChangeTimer = function(milliseconds)
{
	var unitWithInterval = this.intervalGetUnitObjectWithFocus();
	
	if(unitWithInterval.getUnitName() != this.unit){
		throw "You can't change a Timer on a Unit Object which does not have the focus.";
	}
	
	this.intervalMilliseconds = milliseconds;
	
	// If the interval is paused, there is nothing to do.
	// We already updated the millisecond value so that it will be ready on resume.
	if(this.intervalPaused){
		return;
	}

	var scopeThis = this;
	
	clearInterval(this.intervalID);
	
	this.intervalID = setInterval(function (){
		scopeThis.intervalGlobalCounter++;
		scopeThis.increment();
		}, this.intervalMilliseconds);
};



//This will clear the interval (if running) and reset the global counter.
//This may be called for any Unit within the chain and it will fire off events for each of the respective Unit Objects.
Unit.prototype.intervalClear = function()
{
	this.intervalGlobalCounter = 0;
	
	var unitWithIntervalFocus = this.intervalGetUnitNameWithFocus();
	
	var loop_Unit = this.getUnitObjInChainAtBottom();
	
	while(loop_Unit != null){
		
		if(loop_Unit.getUnitName() == unitWithIntervalFocus){
			
			if(loop_Unit.intervalID > 0){
				clearInterval(loop_Unit.intervalID);
			}
			
			// Clearing the interval stops the timer, it doesn't overwrite the member variable.
			loop_Unit.intervalID = 0; 
			
			loop_Unit.intervalPaused = false;
			
			// Only fire off the event for "Unit Object" which had the focus.
			loop_Unit.onIntervalClearEvents.fire();
			
			// Now broadcast the event to any other objects in the chain.
			loop_Unit.event_Broadcast("onIntervalClear");
		}
		
		loop_Unit = loop_Unit.superUnitObj;
	}
};



/*
 * Sometime it is helpful to subscribe to event(s) for only 1 object in the "Unit Chain".
 */
Unit.prototype.event_Broadcast = function(eventName)
{
	// Loop through every object in the "Unit Chain" and fire the 'broadcast event' for the given action.
	var loop_Unit = this.getUnitObjInChainAtBottom();
	
	while(loop_Unit != null){
		
		switch(eventName){
		case "onIntervalBegin" :
			loop_Unit.onIntervalBegin_Any_Events.fire();
			break;
		case "onIntervalClear" :
			loop_Unit.onIntervalClear_Any_Events.fire();
			break;
		case "onIntervalPause" :
			loop_Unit.onIntervalPause_Any_Events.fire();
			break;
		case "onIntervalResume" :
			loop_Unit.onIntervalResume_Any_Events.fire();
			break;
		case "onIntervalFocus" :
			loop_Unit.onIntervalFocus_Any_Events.fire();
			break;
		case "onIntervalBlur" :
			loop_Unit.onIntervalBlur_Any_Events.fire();
			break;
		default :
			throw "Unknown event name in method Unit.event_Broadcast('"+eventName+"')";
		}

		loop_Unit = loop_Unit.superUnitObj;
	}
};


/*
//This will recursively sum up the "Super Unit Projected Value". At each level, the sum is added with
//It will look forward up to (and including) the the parameter variable (Unit name) in string format.
Unit.prototype.getSuperUnitsProjectedExponent = function(limitByUpperUnitName)
{
	
	if(this.superUnitObj == null){
		return 0;
	}
	
	var retSum = 0;
	
	var loop_UnitObj = this.superUnitObj;
	
	while(loop_UnitObj != null){
		
		retSum += loop_UnitObj.getValueEstimateFromSuper();
		
		if(loop_UnitObj.getUnitName() == limitByUpperUnitName){
			break;
		}
		
		loop_UnitObj = loop_UnitObj.superUnitObj;
	}
	
	return retSum;
	
};
*/



/*
// Whenever the "Current Unit Circle" rotates 180 degrees (29 units) between the horizontal equator points, it will increment the "Super Unit" by its respective "1 unit".
// The first value for every unit circle begins with [1000-0000] (1 SE), and it is considered odd.
// Therefore, if a "Super Unit Object" hasn't been used yet, it is considered "even".
// Because we rest a beat on the equator, the first time the EAST equator is touched, it is considered odd (the 15th beat).
// In the upper hemisphere, you first count to 14, then begin subtracting.  No rest occurs on the North Pole, which gives a total of 28 beats.
// This method will return FALSE (or "odd") if the current "Unit Object" is touching the EAST equator, and it will remain "odd"  up to and including the value [0001-1111] (directly above the WEST Equator).
// This method will return TRUE (or "even") if the current "Unit Object" is touching the WEST equator, and it will remain "even" up to and including the value [0111-0000] (directly underneath the EAST Equator).
Unit.prototype.superUnitShouldBeEven = function()
{
	
	switch( this.doubleNibble.getQuadrant() ){
		case "E" :
		case "NE" :
		case "N" :
		case "NW" :
		return false;
	}
	
	return true;
};
*/


