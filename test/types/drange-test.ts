import DRange, { DRange as DRangeNamed } from 'drange';

import DRangeRequire = require('drange');

type SubRange = DRange.SubRange;

new DRange();
new DRange(1);
new DRange(3, 5);
new DRange(new DRange(1, 5));

const drange = new DRange();
const erange = new DRange();
const named: DRange = new DRangeNamed(2, 5);
const required: DRange = new DRangeRequire(2, 5);
const fromDefault: DRange = new DRange.default(2, 5);

const length: number = drange.length;

const added: DRange = drange.add(1).add(3, 5).add(erange);
const subtracted: DRange = drange.subtract(1).subtract(3, 5).subtract(erange);
const intersected: DRange = drange
  .intersect(1)
  .intersect(3, 5)
  .intersect(erange);

const indexed: number = drange.index(2);
const cloned: DRange = drange.clone();
const text: string = drange.toString();
const numbers: number[] = drange.numbers();

const _subranges: SubRange[] = drange.subranges();

named.toString();
required.toString();
fromDefault.toString();
length.toString();
added.toString();
subtracted.toString();
intersected.toString();
indexed.toString();
cloned.toString();
text.toString();
numbers.toString();
