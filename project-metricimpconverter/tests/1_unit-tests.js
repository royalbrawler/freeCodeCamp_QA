const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function () {
    test('should correctly read a whole number input', function () {
        let input = '15kg'
        assert.equal(convertHandler.getNum(input), 15)
    });
    test('should correctly read a decimal number input.', function () {
        let input = '12.8kg'
        assert.equal(convertHandler.getNum(input), 12.8)
    });
    test('should correctly read a fractional input', function () {
        let input = '2/3L'
        assert.equal(convertHandler.getNum(input), 2 / 3)
    });
    test('should correctly read a fractional input with a decimal', function () {
        let input = '6.6/9kg'
        assert.equal(convertHandler.getNum(input), 6.6 / 9)
    });
    test('should correctly return an error on a double-fraction (i.e. 3/2/3)', function () {
        let input = '3/2/3kg'
        assert.equal(convertHandler.getNum(input), undefined)
    });
    test('should correctly default to a numerical input of 1 when no numerical input is provided', function () {
        let input = 'km'
        assert.equal(convertHandler.getNum(input), 1)
    });
    // getUnit
    test('should correctly read each valid input unit', function () {
        const units_validInputs = ['km', 'gal', 'lbs', 'mi', 'l', 'kg', 'KG', 'L', 'MI', 'LBS', 'GAL', 'KM']
        const units_verifiedOutputs = ['km', 'gal', 'lbs', 'mi', 'L', 'kg'] // only L (liter) should be uppercase
        units_validInputs.forEach(function (element) {
            assert.include(units_verifiedOutputs, convertHandler.getUnit(element), `ERR: ${element} is a valid output unit??`)
        })
    });
    test('should correctly return an error for an invalid input unit', function () {
        let input = '12kilograms'
        assert.equal(convertHandler.getUnit(input), undefined)
    });
    // getReturnUnit
    test(' should return the correct return unit for each valid input unit', function () {
        let returnPairs = [
            { input: 'km', output: 'mi' },
            { input: 'gal', output: 'L' },
            { input: 'lbs', output: 'kg' },
            { input: 'mi', output: 'km' },
            { input: 'l', output: 'gal' },
            { input: 'kg', output: 'lbs' },
        ]
        returnPairs.forEach(pair => {
            assert.equal(convertHandler.getReturnUnit(pair.input), pair.output, `${pair.input} should be ${pair.output}`)
        })
    });
    // spellOutUnit
    test('should correctly return the spelled-out string unit for each valid input unit', function () {
        let spellOutUnits = [
            { input: 'km', output: 'kilometers' },
            { input: 'gal', output: 'gallons' },
            { input: 'lbs', output: 'pounds' },
            { input: 'mi', output: 'miles' },
            { input: 'l', output: 'liters' },
            { input: 'kg', output: 'kilograms' },
        ]
        spellOutUnits.forEach(unit => {
            assert.equal(convertHandler.spellOutUnit(unit.input), unit.output, `${unit.input} should be ${unit.output}`)
        })
    });

    // convert
    test('should correctly convert gal to L', function () {
        let input = [5, 'gal']
        let expected = 18.9271
        assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1) // 0.1 tolerance
    });
    test('should correctly convert L to gal', function () {
        let input = [5, 'L']
        let expected = 1.32086
        assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.01) // 0.01 tolerance
    });
    test('should correctly convert mi to km', function () {
        let input = [5, 'mi']
        let expected = 8.04670
        assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.01) // 0.01 tolerance
    });
    test('should correctly convert km to mi', function () {
        let input = [5, 'km']
        let expected = 3.10686
        assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.01) // 0.01 tolerance
    });
    test('should correctly convert lbs to kg', function () {
        let input = [5, 'lbs']
        let expected = 2.26796
        assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.01) // 0.01 tolerance
    });
    test('should correctly convert kg to lbs', function () {
        let input = [5, 'kg']
        let expected = 11.02312
        assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.01) // 0.01 tolerance
    });
});