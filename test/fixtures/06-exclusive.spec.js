const assert = require('assert');

it.only('a', () => assert.equal(0, 0));
describe('suite', () => {
  it.only('c', () => assert.equal(0, 0));
  describe('sub-suite', () => {
    it('e', () => assert.equal(0, 0));
  });
  it('d', () => assert.equal(0, 0));
});
describe('suite2', () => {
  it('c2', () => assert.equal(0, 0));
  describe('sub-suite2', () => {
    it('e2', () => assert.equal(0, 0));
  });
  it('d2', () => assert.equal(0, 0));
});
it('b', () => assert.equal(0, 0));
