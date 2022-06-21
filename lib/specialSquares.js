const strLengthMaxSafeInteger = Number.MAX_SAFE_INTEGER.toString().length -1;
const maxArrayLength = Math.pow(2, 32) -1;

function findAllPerfectSquaresWithinRange(maxItteration = maxArrayLength) {
  const allPerfectSquaresWithinRange = [];

  let currentIteration = 1;
  while(true) {
    if(currentIteration > maxItteration) {
      console.log('Breaking out of findAllPerfectSquaresWithinRange because iteration is ' + currentIteration + ' Square: ' + BigInt(currentIteration)**2n);
      break;
    }
    allPerfectSquaresWithinRange.push(
      {
        root: currentIteration,
        square: BigInt(currentIteration)**2n,
      }
    );
    currentIteration++;
  }

  return allPerfectSquaresWithinRange;
}

function convertNumberToBigIntIfNeeded(theNumber) {
  if(typeof theNumber === 'bigint') {
    return theNumber;
  }
  return BigInt(theNumber);
}

function stringifyArrayOfBigIntObjects(key, value) {
  if(value === 'object'){
    return value;
  } else if(typeof value === 'bigint') {
    return value.toString();
  } else {
    return value;
  }
}


// Too many performance optimizations needed for this.... I'll just stick to plain old numbers to explore the landscape for now.
function findSpecialSquaresBigInt(squareScale, isScaleMultiplication, offset, maxItteration = maxArrayLength) {

  const allPerfectSquaresWithinRange = findAllPerfectSquaresWithinRange(maxItteration);

  const objArr = [];

  let iteration = 1;
  while(true) {

    if(iteration > maxItteration) {
      break;
    }

    const loopSquared = BigInt(iteration)**2n;

    let loopSquareScaled;
    if(isScaleMultiplication) {
      loopSquareScaled = loopSquared * BigInt(squareScale);
    } else {

      // Ensure that the number can be divided without a remainder before consideration as a special square.
      if(loopSquared % BigInt(squareScale) !== 0n) {
        iteration++;
        continue;
      }
      loopSquareScaled = loopSquared / BigInt(squareScale);
    }
    const squareScaledWithOffset = loopSquareScaled + BigInt(offset);

    // A square root can't be performed on BigInt, so instead just find out if any of the known perfect squares within range match.
    for(let n = 0; n < allPerfectSquaresWithinRange.length; n++) {
      if(allPerfectSquaresWithinRange[n].square === squareScaledWithOffset) {
        objArr.push(
        {
          iteration,
          squareScale,
          isScaleMultiplication,
          offset,
          squareScaledWithOffset,
          squareRoot: allPerfectSquaresWithinRange[n].root,
        });
        break;
      }
      if(BigInt(allPerfectSquaresWithinRange[n].square) > squareScaledWithOffset){
        break;
      }
    };

    iteration++;
  }
  return objArr;
}



function findSpecialSquares(squareScale, isScaleMultiplication, offset, maxItteration = Number.MAX_SAFE_INTEGER) {
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

function findSpecialPronics(pronicScale, isScaleMultiplication, offset, maxItteration = Number.MAX_SAFE_INTEGER) {
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

      const loopObject = {
        iteration : i,
        pronicFactors: `{${i} x ${i+1}}`,
        pronicScale,
        isScaleMultiplication,
        offset,
        pronicScaledWithOffset,
        squareRootScaledPronic,
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
        loopObject.ratioOfRootAndPronicFactor = squareRootScaledPronic / thePronicFactorWithPerfectSquare;
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


