const assert = require('assert');

it('a', () => assert.equal(0, 0));
describe('suite', () => {
  it('c', () => assert.equal(1, 0));
  describe('sub-suite', () => {
    it('e', () => assert.equal(1, 0));
  });
  it('d', () => assert.equal(0, 0));
});
it('b', () => assert.equal(1, 0));
