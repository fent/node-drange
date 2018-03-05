var assert = require('assert');
var DRange = require('..');

/* eslint indent: 4 */
describe('add sets', () => {
    it('should allow adding numbers', () => {
        var drange = new DRange(5);
        assert.equal('[ 5 ]', drange.toString());
        drange.add(6);
        assert.equal('[ 5-6 ]', drange.toString());
        drange.add(8);
        assert.equal('[ 5-6, 8 ]', drange.toString());
        drange.add(7);
        assert.equal('[ 5-8 ]', drange.toString());
        assert.equal(drange.length, 4);
    });
    it('should allow adding ranges of numbers', () => {
        var drange = new DRange(1,5);
        assert.equal('[ 1-5 ]', drange.toString());
        drange.add(6,10);
        assert.equal('[ 1-10 ]', drange.toString());
        drange.add(15,20);
        assert.equal('[ 1-10, 15-20 ]', drange.toString());
        drange.add(0,14);
        assert.equal('[ 0-20 ]', drange.toString());
        assert.equal(drange.length, 21);
    });
    it('should allow adding another DiscontinuousRange', () => {
        var drange = new DRange(1,5);
        drange.add(15,20);
        var erange = new DRange(6);
        erange.add(17, 30);
        drange.add(erange);
        assert.equal('[ 1-6, 15-30 ]', drange.toString());
        assert.equal(drange.length, 22);
    });
});

describe('subtract sets', () => {
    it('should allow subtracting numbers', () => {
        var drange = new DRange(1, 10);
        drange.subtract(5);
        assert.equal('[ 1-4, 6-10 ]', drange.toString());
        drange.subtract(7);
        assert.equal('[ 1-4, 6, 8-10 ]', drange.toString());
        drange.subtract(6);
        assert.equal('[ 1-4, 8-10 ]', drange.toString());
        assert.equal(drange.length, 7);
    });
    it('should allow subtracting ranges of numbers', () => {
        var drange = new DRange(1, 100);
        drange.subtract(5, 15);
        assert.equal('[ 1-4, 16-100 ]', drange.toString());
        drange.subtract(90, 200);
        assert.equal('[ 1-4, 16-89 ]', drange.toString());
        assert.equal(drange.length, 78);
    });
    it('should allow subtracting another DiscontinuousRange', () => {
        var drange = new DRange(0,100);
        var erange = new DRange(6);
        erange.add(17, 30);
        drange.subtract(erange);
        assert.equal('[ 0-5, 7-16, 31-100 ]', drange.toString());
        assert.equal(drange.length, 86);
    });
});


describe('intersect sets', () => {
    it('should allow intersecting numbers', () => {
        var drange = new DRange(5,20);
        assert.equal('[ 5-20 ]', drange.toString());
        drange.intersect(7);
        assert.equal('[ 7 ]', drange.toString());
    });
    it('should allow intersecting ranges of numbers', () => {
        var drange = new DRange(1,5);
        assert.equal('[ 1-5 ]', drange.toString());
        drange.intersect(6,10);
        assert.equal('[  ]', drange.toString());
        drange.add(15,20);
        assert.equal('[ 15-20 ]', drange.toString());
        drange.intersect(0,18);
        assert.equal('[ 15-18 ]', drange.toString());
        assert.equal(drange.length, 4);
    });
    it('should allow intersecting another DiscontinuousRange', () => {
        var drange = new DRange(1,5);
        drange.add(15,20);
        var erange = new DRange(3,6);
        erange.add(17, 30);
        drange.intersect(erange);
        assert.equal('[ 3-5, 17-20 ]', drange.toString());
        assert.equal(drange.length, 7);
    });
});


describe('index sets', () => {
    it('should appropriately retrieve numbers in range by index', () => {
        var drange = new DRange(0, 9);
        drange.add(20, 29);
        drange.add(40, 49);
        assert.equal(drange.index(5), 5);
        assert.equal(drange.index(15), 25);
        assert.equal(drange.index(25), 45);
        assert.equal(drange.length, 30);
    });
});

describe('clone sets', () => {
    it('should be able to clone a DiscontinuousRange that doesn\'t affect the original', () => {
        var drange = new DRange(0, 9);
        var erange = drange.clone();
        erange.subtract(5);
        assert.equal('[ 0-9 ]', drange.toString());
        assert.equal('[ 0-4, 6-9 ]', erange.toString());
    });
});

var all_numbers = new DRange(1, 100);
var bad_numbers = new DRange(13).add(8).add(60,80);
var good_numbers = all_numbers.clone().subtract(bad_numbers);
console.log(good_numbers.toString());
var random_good_number = good_numbers.index(Math.floor(Math.random() * good_numbers.length));
console.log(random_good_number);
