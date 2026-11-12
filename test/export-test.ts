import assert from 'node:assert';
import DRange, { DRange as NamedDRange } from '..';

describe('Exports', () => {
  it('Exposes class as default and named export', () => {
    assert.strictEqual(DRange, NamedDRange);
    assert.strictEqual(DRange.DRange, DRange);
    assert.strictEqual(DRange.default, DRange);
  });
});
