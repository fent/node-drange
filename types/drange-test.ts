import DRange from 'drange';

type SubRange = DRange.SubRange;

new DRange(); // $ExpectType DRange
new DRange(1); // $ExpectType DRange
new DRange(3, 5); // $ExpectType DRange

const drange = new DRange();
const erange = new DRange();

drange.length; // $ExpectType number

drange.add(1); // $ExpectType DRange
drange.add(3, 5); // $ExpectType DRange
drange.add(erange); // $ExpectType DRange

drange.subtract(1); // $ExpectType DRange
drange.subtract(3, 5); // $ExpectType DRange
drange.subtract(erange); // $ExpectType DRange

drange.intersect(1); // $ExpectType DRange
drange.intersect(3, 5); // $ExpectType DRange
drange.intersect(erange); // $ExpectType DRange

drange.index(2); // $ExpectType number

drange.clone(); // $ExpectType DRange

drange.toString(); // $ExpectType string

drange.numbers(); // $ExpectType number[]

const _subranges: SubRange[] = drange.subranges();
