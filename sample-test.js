describe('Array', function() {
  describe('indexOf()', function () {
    it('should return -1 when the value is not present, using assert', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
      assert.equal(-1, [1,2,3].indexOf(2));
    });
    it('should also return -1 when the value is not present, using should', function() {
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
      [1,2,3].indexOf(2).should.equal(-1);
    });
    it('should do the same, using expect', function() {
      expect([1,2,3].indexOf(5)).to.equal(-1);
      expect([1,2,3].indexOf(0)).to.equal(-1);
      expect([1,2,3].indexOf(2)).to.equal(-1);
    });
  });
});