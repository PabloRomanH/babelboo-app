
describe("services", function() {
    // it('should fail', function() { expect(true).to.be.false; });
    beforeEach(module('babelbooapp'));

    describe("renderTime", function() {
        var renderTime;

        beforeEach(inject(function(_renderTime_) {
            renderTime = _renderTime_;
        }));

        it("should match", function() {
            expect(renderTime(0)).to.equal('0:00');
            expect(renderTime(1)).to.equal('0:01');
            expect(renderTime(60)).to.equal('1:00');
            expect(renderTime(61)).to.equal('1:01');
            expect(renderTime(60 * 60)).to.equal('1:00:00');
            expect(renderTime(60 * 60 + 60)).to.equal('1:01:00');
            expect(renderTime(60 * 60 + 61)).to.equal('1:01:01');
            expect(renderTime(10 * 60 * 60 + 61)).to.equal('10:01:01');
            expect(renderTime(100 * 60 * 60 + 61)).to.equal('100:01:01');

            expect(renderTime(1.2)).to.equal('0:01');
            expect(renderTime(1.499)).to.equal('0:01');
            expect(renderTime(1.5)).to.equal('0:02');

            expect(renderTime(-1)).to.equal('');
            expect(renderTime()).to.equal('');
        });
    });

    afterEach(function() {});
});