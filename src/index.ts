const rangeLength = (low: number, high: number): number => 1 + high - low;

// Private helper class
class SubRange {
  public low: number;
  public high: number;
  public length: number;

  constructor(low: number, high: number) {
    this.low = low;
    this.high = high;
    this.length = rangeLength(low, high);
  }

  overlaps(range: SubRange): boolean {
    return range.low <= this.high && this.low <= range.high;
  }

  touches(range: SubRange): boolean {
    return range.low <= this.high + 1 && this.low - 1 <= range.high;
  }

  covers(range: SubRange): boolean {
    return this.low <= range.low && range.high <= this.high;
  }

  isInside(range: SubRange): boolean {
    return range.low < this.low && this.high < range.high;
  }

  isBefore(range: SubRange): boolean {
    return this.high < range.low;
  }

  // Returns inclusive combination of SubRanges as a SubRange.
  add(range: SubRange): SubRange {
    return new SubRange(
      Math.min(this.low, range.low),
      Math.max(this.high, range.high),
    );
  }

  // Returns subtraction of SubRanges as an array of SubRanges.
  // (There's a case where subtraction divides it in 2)
  subtract(range: SubRange): SubRange[] {
    if (range.covers(this)) {
      return [];
    } else if (range.isInside(this)) {
      return [
        new SubRange(this.low, range.low - 1),
        new SubRange(range.high + 1, this.high),
      ];
    } else if (range.low <= this.low) {
      return [new SubRange(range.high + 1, this.high)];
    } else {
      return [new SubRange(this.low, range.low - 1)];
    }
  }

  toString(): string {
    return this.low === this.high
      ? this.low.toString()
      : `${this.low}-${this.high}`;
  }
}

const toSubRange = (low: number, high?: number): SubRange =>
  new SubRange(low, high === undefined ? low : high);

/**
 * For adding/subtracting sets of range of numbers.
 */
class DRange {
  static DRange = DRange;
  static default = DRange;

  private ranges: SubRange[];

  /**
   * The total length of all subranges.
   */
  public length: number;

  /**
   * Creates a new instance of DRange.
   */
  constructor(low?: number, high?: number);
  constructor(drange: DRange);
  constructor(a?: number | DRange, b?: number) {
    this.ranges = [];
    this.length = 0;
    if (a != null) {
      if (a instanceof DRange) this.add(a);
      else this.add(a, b);
    }
  }

  private _update_length(): void {
    this.length = this.ranges.reduce((previous, range) => {
      return previous + range.length;
    }, 0);
  }

  /**
   * Adds a subrange.
   */
  add(low: number, high?: number): this;
  /**
   * Adds all of another DRange's subranges.
   */
  add(drange: DRange): this;
  add(a: number | DRange, b?: number): this {
    const _add = (subrange: SubRange): void => {
      let i = 0;
      while (
        i < this.ranges.length &&
        !subrange.touches(this.ranges[i]) &&
        this.ranges[i].isBefore(subrange)
      ) {
        i++;
      }
      const newRanges = this.ranges.slice(0, i);
      while (i < this.ranges.length && subrange.touches(this.ranges[i])) {
        subrange = subrange.add(this.ranges[i]);
        i++;
      }
      newRanges.push(subrange);
      this.ranges = newRanges.concat(this.ranges.slice(i));
      this._update_length();
    };

    if (a instanceof DRange) {
      a.ranges.forEach(_add);
    } else {
      _add(toSubRange(a, b));
    }
    return this;
  }

  /**
   * Subtracts a subrange.
   */
  subtract(low?: number, high?: number): this;
  /**
   * Subtracts all of another DRange's subranges.
   */
  subtract(drange: DRange): this;
  subtract(a?: number | DRange, b?: number): this {
    const _subtract = (subrange: SubRange): void => {
      let i = 0;
      while (i < this.ranges.length && !subrange.overlaps(this.ranges[i])) {
        i++;
      }
      let newRanges = this.ranges.slice(0, i);
      while (i < this.ranges.length && subrange.overlaps(this.ranges[i])) {
        newRanges = newRanges.concat(this.ranges[i].subtract(subrange));
        i++;
      }
      this.ranges = newRanges.concat(this.ranges.slice(i));
      this._update_length();
    };

    if (a instanceof DRange) {
      a.ranges.forEach(_subtract);
    } else if (a != null) {
      _subtract(toSubRange(a, b));
    }
    return this;
  }

  /**
   * Keep only subranges that overlap the given subrange.
   */
  intersect(low?: number, high?: number): this;
  /**
   * Intersect all of another DRange's subranges.
   */
  intersect(drange: DRange): this;
  intersect(a?: number | DRange, b?: number): this {
    const newRanges: SubRange[] = [];
    const _intersect = (subrange: SubRange): void => {
      let i = 0;
      while (i < this.ranges.length && !subrange.overlaps(this.ranges[i])) {
        i++;
      }
      while (i < this.ranges.length && subrange.overlaps(this.ranges[i])) {
        const low = Math.max(this.ranges[i].low, subrange.low);
        const high = Math.min(this.ranges[i].high, subrange.high);
        newRanges.push(new SubRange(low, high));
        i++;
      }
    };

    if (a instanceof DRange) {
      a.ranges.forEach(_intersect);
    } else if (a != null) {
      _intersect(toSubRange(a, b));
    }
    this.ranges = newRanges;
    this._update_length();
    return this;
  }

  /**
   * Get the number at the specified index.
   */
  index(index: number): number {
    let i = 0;
    while (i < this.ranges.length && this.ranges[i].length <= index) {
      index -= this.ranges[i].length;
      i++;
    }
    return this.ranges[i].low + index;
  }

  toString(): string {
    return `[ ${this.ranges.join(', ')} ]`;
  }

  /**
   * Clones the drange, so that changes to it are not reflected on its clone.
   */
  clone(): this {
    return new DRange(this) as this;
  }

  /**
   * Get contained numbers.
   */
  numbers(): number[] {
    return this.ranges.reduce((result, subrange) => {
      let i = subrange.low;
      while (i <= subrange.high) {
        result.push(i);
        i++;
      }
      return result;
    }, [] as number[]);
  }

  /**
   * Get copy of subranges.
   */
  subranges(): DRange.SubRange[] {
    return this.ranges.map((subrange) => ({
      low: subrange.low,
      high: subrange.high,
      length: rangeLength(subrange.low, subrange.high),
    }));
  }
}

namespace DRange {
  export interface SubRange {
    low: number;
    high: number;
    length: number;
  }
}

// Statically recognizable exports for Node.js cjs-module-lexer (ESM named import support)
module.exports = DRange;
module.exports.default = DRange;
module.exports.DRange = DRange;

export = DRange;
