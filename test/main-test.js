const assert = require('assert');
const DRange = require('..');

/* eslint indent: ["warn", 4] */
describe('empty drange', () => {
  it('should initialize with no subranges', () => {
    const drange = new DRange();
    assert.equal('[  ]', drange.toString());
  });
});

describe('add sets', () => {
  it('should allow adding numbers', () => {
    const drange = new DRange(5);
    assert.equal(drange.toString(), '[ 5 ]');
    drange.add(6);
    assert.equal(drange.toString(), '[ 5-6 ]');
    drange.add(8);
    assert.equal(drange.toString(), '[ 5-6, 8 ]');
    drange.add(7);
    assert.equal(drange.toString(), '[ 5-8 ]');
    assert.equal(drange.length, 4);
  });
  it('should allow adding ranges of numbers', () => {
    const drange = new DRange(1, 5);
    assert.equal(drange.toString(), '[ 1-5 ]');
    drange.add(6, 10);
    assert.equal(drange.toString(), '[ 1-10 ]');
    drange.add(15, 20);
    assert.equal(drange.toString(), '[ 1-10, 15-20 ]');
    drange.add(0, 14);
    assert.equal(drange.toString(), '[ 0-20 ]');
    assert.equal(drange.length, 21);
  });
  it('should allow adding another DRange', () => {
    const drange = new DRange(1, 5);
    drange.add(15, 20);
    const erange = new DRange(6);
    erange.add(17, 30);
    drange.add(erange);
    assert.equal(drange.toString(), '[ 1-6, 15-30 ]');
    assert.equal(drange.length, 22);
  });
  it('in the beginning of the range', () => {
    const drange = new DRange(10, 20);
    assert.equal(drange.toString(), '[ 10-20 ]');
    drange.add(5, 7);
    assert.equal(drange.toString(), '[ 5-7, 10-20 ]');
  });
  it('between entries in the range', () => {
    const drange = new DRange(10, 20);
    assert.equal(drange.toString(), '[ 10-20 ]');
    drange.add(0, 5);
    drange.add(7, 8);
    assert.equal(drange.toString(), '[ 0-5, 7-8, 10-20 ]');
  });
});

describe('subtract sets', () => {
  it('should allow subtracting numbers', () => {
    const drange = new DRange(1, 10);
    drange.subtract(5);
    assert.equal(drange.toString(), '[ 1-4, 6-10 ]');
    drange.subtract(7);
    assert.equal(drange.toString(), '[ 1-4, 6, 8-10 ]');
    drange.subtract(6);
    assert.equal(drange.toString(), '[ 1-4, 8-10 ]');
    assert.equal(drange.length, 7);
  });
  it('should allow subtracting ranges of numbers', () => {
    const drange = new DRange(1, 100);
    drange.subtract(5, 15);
    assert.equal(drange.toString(), '[ 1-4, 16-100 ]');
    drange.subtract(90, 200);
    assert.equal(drange.toString(), '[ 1-4, 16-89 ]');
    assert.equal(drange.length, 78);
  });
  it('should allow subtracting another DRange', () => {
    const drange = new DRange(0, 100);
    const erange = new DRange(6);
    erange.add(17, 30);
    erange.add(0, 2);
    drange.subtract(erange);
    assert.equal(drange.toString(), '[ 3-5, 7-16, 31-100 ]');
    assert.equal(drange.length, 83);
  });
  it('should allow subtracting ranges added out of order', () => {
    const drange = new DRange();
    drange.add(4, 6);
    drange.add(15, 20);
    drange.add(8, 12);
    drange.subtract(5, 10);
    assert.equal(drange.toString(), '[ 4, 11-12, 15-20 ]');
  });
});

describe('intersect sets', () => {
  it('should allow intersecting numbers', () => {
    const drange = new DRange(5, 20);
    assert.equal(drange.toString(), '[ 5-20 ]');
    drange.intersect(7);
    assert.equal(drange.toString(), '[ 7 ]');
  });
  it('should allow intersecting ranges of numbers', () => {
    const drange = new DRange(1, 5);
    assert.equal(drange.toString(), '[ 1-5 ]');
    drange.intersect(6, 10);
    assert.equal(drange.toString(), '[  ]');
    drange.add(15, 20);
    assert.equal(drange.toString(), '[ 15-20 ]');
    drange.intersect(0, 18);
    assert.equal(drange.toString(), '[ 15-18 ]');
    assert.equal(drange.length, 4);
  });
  it('should allow intersecting another DRange', () => {
    const drange = new DRange(1, 5);
    drange.add(15, 20);
    const erange = new DRange(3, 6);
    erange.add(17, 30);
    drange.intersect(erange);
    assert.equal(drange.toString(), '[ 3-5, 17-20 ]');
    assert.equal(drange.length, 7);
  });
});

describe('index sets', () => {
  it('should appropriately retrieve numbers in range by index', () => {
    const drange = new DRange(0, 9);
    drange.add(20, 29);
    drange.add(40, 49);
    assert.equal(drange.index(5), 5);
    assert.equal(drange.index(15), 25);
    assert.equal(drange.index(25), 45);
    assert.equal(drange.length, 30);
  });
});

describe('clone sets', () => {
  it("should be able to clone a DRange that doesn't affect the original", () => {
    const drange = new DRange(0, 9);
    const erange = drange.clone();
    erange.subtract(5);
    assert.equal(drange.toString(), '[ 0-9 ]');
    assert.equal(erange.toString(), '[ 0-4, 6-9 ]');
  });
});

describe('accessing numbers', () => {
  it('should be able to get contained numbers', () => {
    const drange = new DRange(1, 4);
    drange.subtract(2);
    drange.add(6);
    const numbers = drange.numbers();
    assert.deepStrictEqual([1, 3, 4, 6], numbers);
    drange.subtract(3);
    assert.deepStrictEqual([1, 3, 4, 6], numbers);
  });
});

describe('accessing subranges', () => {
  it('should be able to get copy of subranges', () => {
    const drange = new DRange(1, 4);
    drange.add(6, 8);
    const subranges = drange.subranges();
    const expect = [
      {
        low: 1,
        high: 4,
        length: 4,
      },
      {
        low: 6,
        high: 8,
        length: 3,
      },
    ];
    assert.deepStrictEqual(expect, subranges);
    drange.subtract(6, 8);
    assert.deepStrictEqual(expect, subranges);
  });
});
