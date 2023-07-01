function numberStringSplitter(input) {
  let number = (input.match(/[.\d\/]+/g) || ['1'])[0] // return ['1'] as default if no match
  let string = (input.match(/[a-zA-Z]+/g) || [''])[0] // return [''] as default if no match
  return [number, string]
}
function checkDivision(possibleFraction) {
  // 2/4/3 returns false
  // 2/4 returns ['2', '4']
  // 15 returns ['15']
  let nums = possibleFraction.split('/')
  if (nums.length > 2) {
    return false
  }
  return nums
}

function ConvertHandler() {

  this.getNum = function (input) {
    let result = numberStringSplitter(input)[0];
    let nums = checkDivision(result)
    if (!nums) {
      return undefined
    }

    let num1 = nums[0]
    let num2 = nums[1] || '1'
    result = parseFloat(num1) / parseFloat(num2)

    if (isNaN(num1) || isNaN(num2)) {
      return undefined
    }
    return result;
  };

  this.getUnit = function (input) {
    let result = numberStringSplitter(input)[1]
    result = result.toLowerCase()

    // const possibleUnits = ['km', 'gal', 'lbs', 'mi', 'l', 'kg']
    // if (possibleUnits.includes(result)) {
    //   if (result === 'l') {
    //     result = result.toUpperCase()
    //   }
    //   return result
    // } else {
    //   return undefined;
    // }

    switch (result) {
      case 'km':
        return 'km'
      case 'gal':
        return 'gal'
      case 'lbs':
        return 'lbs'
      case 'mi':
        return 'mi'
      case 'l':
        return 'L'
      case 'kg':
        return 'kg'
      default:
        return undefined;
    }
  };

  this.getReturnUnit = function (initUnit) {
    let result = initUnit.toLowerCase();
    switch (result) {
      case 'km':
        return 'mi'
      case 'gal':
        return 'L'
      case 'lbs':
        return 'kg'
      case 'mi':
        return 'km'
      case 'l':
        return 'gal'
      case 'kg':
        return 'lbs'
      default:
        return undefined;
    }
  };

  this.spellOutUnit = function (unit) {
    let result = unit.toLowerCase();
    switch (result) {
      case 'km':
        return 'kilometers'
      case 'gal':
        return 'gallons'
      case 'lbs':
        return 'pounds'
      case 'mi':
        return 'miles'
      case 'l':
        return 'liters'
      case 'kg':
        return 'kilograms'
      default:
        return "don't know";
    }
  };

  this.convert = function (initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let unit = initUnit.toLowerCase();
    let result

    switch (unit) {
      case 'km':
        result = initNum / miToKm
        break;
      case 'gal':
        result = initNum * galToL
        break;
      case 'lbs':
        result = initNum * lbsToKg
        break;
      case 'mi':
        result = initNum * miToKm
        break;
      case 'l':
        result = initNum / galToL
        break;
      case 'kg':
        result = initNum / lbsToKg
        break;
      default:
        return undefined;
    }

    return parseFloat(result.toFixed(5));
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    let result = `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
    return result;
  };

}

module.exports = ConvertHandler;
