
onload = function()
{
	console.log("Page Loading Start\n----------------\n");
	document.getElementById('output').innerHTML = 'Loading .....'
	
	// const specialSquares = findSpecialSquares(2, false, 1, 1000000);
  const specialPronics = findSpecialPronics(20, false, 1);
  document.getElementById('output').innerHTML = htmlizeSpecialSquareObjects(specialPronics);

  document.getElementById('output').innerHTML += '<br/><br/><br/>Looking for patterns in special pronics:<hr/>';

  for(let scalcPronics = 2; scalcPronics < 102; scalcPronics++ ){
    const specialPronics = findSpecialPronics(scalcPronics, false, 0);
    if(!specialPronics.length) {
      document.getElementById('output').innerHTML += 'No special pronics found matching criteria. Scale: '+ scalcPronics +'<br/>'
    } else {
      const pronicScaledCategoryObj = categorizeSpecialPronicsCollection(specialPronics);
      document.getElementById('output').innerHTML += JSON.stringify(pronicScaledCategoryObj) + '<br\>';
    }
  }

};
