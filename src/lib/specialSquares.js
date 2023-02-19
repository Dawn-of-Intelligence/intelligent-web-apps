export function findSpecialSquares(squareScale, isScaleMultiplication, offset, maxItteration = Number.MAX_SAFE_INTEGER) {
  const objArr = [];
  for(let i=0; i<maxItteration; i++) {
    const loopSquare = i * i;

    let loopSquareScaled;
    if(isScaleMultiplication) {
      loopSquareScaled = loopSquare * squareScale;
    } else {
      loopSquareScaled = loopSquare / squareScale;
    }

    if(loopSquareScaled > Number.MAX_SAFE_INTEGER ) {
      console.log(`Scaled Square too large. Iteration: ${i} Square Scaled: ${loopSquareScaled}`);
      break;
    }

    const squareScaledWithOffset = loopSquareScaled + offset

    const squareRootOfScaledSquare = Math.sqrt(squareScaledWithOffset);
    if(Math.ceil(squareRootOfScaledSquare) === squareRootOfScaledSquare){
      objArr.push(
      {
        iteration : i,
        squareScale,
        isScaleMultiplication,
        offset,
        squareScaledWithOffset,
        squareRoot: squareRootOfScaledSquare,
      });
    }
  }

  return objArr;
}

export function findSpecialPronics(pronicScale, isScaleMultiplication, offset, maxItteration = Number.MAX_SAFE_INTEGER) {
  const objArr = [];
  for(let i=0; i<maxItteration; i++) {
    const loopPronic = i * (i+1);

    if(loopPronic > Number.MAX_SAFE_INTEGER ) {
      console.log(`Pronic too large. Iteration: ${i} Pronic: ${loopPronic}`);
      break;
    }

    let loopPronicScaled;
    if(isScaleMultiplication) {
      loopPronicScaled = loopPronic * pronicScale;
    } else {
      loopPronicScaled = loopPronic / pronicScale;
    }

    // Only try taking square roots if there are no remainders after scaling.
    // It can be difficult to know if the scaled value has fractional bits because the decimals may have been truncated.
    if(pronicScale !== Math.ceil(pronicScale) && loopPronicScaled > Number.MAX_SAFE_INTEGER / 10){
      continue;
    }

    if(loopPronicScaled > Number.MAX_SAFE_INTEGER ) {
      console.log(`Scaled Pronic too large. Iteration: ${i} Pronic Scaled: ${loopPronicScaled}`);
      break;
    }

    const pronicScaledWithOffset = loopPronicScaled + offset;
    const squareRootScaledPronic = Math.sqrt(pronicScaledWithOffset);
    if(Math.ceil(squareRootScaledPronic) === squareRootScaledPronic){

      const triangularTimesEightPlusOne = (i * (i+1) * 4 + 1);
      const scalarRatioIfMultiplied = pronicScaledWithOffset / triangularTimesEightPlusOne;

      const loopObject = {
        iteration : i,
        pronicFactors: `{${i} x ${i+1}}`,
        pronicScale,
        isScaleMultiplication,
        offset,
        pronicScaledWithOffset,
        squareRootScaledPronic,
        triangularTimesEightPlusOne,
        ratioPronicScaledToTriangularTimesEightPlusOne: isScaleMultiplication ? scalarRatioIfMultiplied : 1 / scalarRatioIfMultiplied,
      };

      const pronicFactorOneSqrt = Math.sqrt(i);
      const pronicFactorTwoSqrt = Math.sqrt(i+1);
      let thePronicFactorWithPerfectSquare;

      if(pronicFactorOneSqrt === Math.ceil(pronicFactorOneSqrt)) {
        loopObject.pronicFactors = `[${i}] x ${i+1}`,
        loopObject.sqrtPronicA = pronicFactorOneSqrt;
        loopObject.sqrtPronicB = null;
        thePronicFactorWithPerfectSquare = i;
      } else if(pronicFactorTwoSqrt === Math.ceil(pronicFactorTwoSqrt)) {
        loopObject.pronicFactors = `${i} x [${i+1}]`,
        loopObject.sqrtPronicA = null;
        loopObject.sqrtPronicB = pronicFactorTwoSqrt;
        thePronicFactorWithPerfectSquare = i+1;
      }

      if(thePronicFactorWithPerfectSquare) {
        loopObject.ratioOfRootAndPronicFactor = isScaleMultiplication ? squareRootScaledPronic / thePronicFactorWithPerfectSquare : thePronicFactorWithPerfectSquare / squareRootScaledPronic;
      } else {
        loopObject.ratioOfRootAndPronicFactor = null;
      }

      objArr.push(loopObject);
    }
  }

  return objArr;
}


function categorizeSpecialPronicsCollection (specialPronicsArr) {

  let foundPerfectPronicFactorA = false;
  let foundPerfectPronicFactorBafterPronicA = false;
  let oscillates = false;
  let fullMatchesBeyondZero = 0;
  let halfMatchesBeyondZero = 0;

  specialPronicsArr.forEach((loopSpecialPronicObj) => {
    if(loopSpecialPronicObj.iteration !== 0 && (loopSpecialPronicObj.sqrtPronicA || loopSpecialPronicObj.sqrtPronicB)) {
      fullMatchesBeyondZero++;
    }
    if(loopSpecialPronicObj.iteration !== 0 && (!loopSpecialPronicObj.sqrtPronicA && !loopSpecialPronicObj.sqrtPronicB)) {
      halfMatchesBeyondZero++;
    }
    if(loopSpecialPronicObj.iteration !== 0 && loopSpecialPronicObj.sqrtPronicA) {
      foundPerfectPronicFactorA = true;
    }
    if(foundPerfectPronicFactorA && loopSpecialPronicObj.sqrtPronicB) {
      foundPerfectPronicFactorBafterPronicA = true;
    }
  });

  if(foundPerfectPronicFactorA && foundPerfectPronicFactorBafterPronicA) {
    oscillates = true;
  }

  const ratiosBetweenItterrations = [];
  forEach((specialPronicsArr, index) => {
    if(index > 0) {
      if(specialPronicsArr[index] && oscillates) {
        
      }
    }
  })

  return {
    pronicScale: specialPronicsArr[0].pronicScale,
    isScaleMultiplication: specialPronicsArr[0].isScaleMultiplication,
    offset: specialPronicsArr[0].offset,
    oscillates,
    fullMatchesBeyondZero,
    halfMatchesBeyondZero,
  };

}

function htmlizeSpecialSquareObjects (objArr) {
  let stringifiedObjArr = JSON.stringify(objArr);
  stringifiedObjArr = stringifiedObjArr.replace(/\},/g, '},<br/><br/>\n')
  stringifiedObjArr = stringifiedObjArr.replace(/,"squareRootScaledPronic"/g, ',\n<br/>&nbsp;&nbsp;"squareRootScaledPronic"')
  stringifiedObjArr = stringifiedObjArr.replace(`[{`, '[\n<br/>\n{');
  stringifiedObjArr = stringifiedObjArr.replace(`}]`, '}\n<br/>\n]');
  return stringifiedObjArr;
}


