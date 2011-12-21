var common = require('../common');
var enumerable = require('../');

exports["Get the element at an index"] = function(test) {
    var source = enumerable.create([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);

    test.equal(source.elementAt(3), 13, "Value at element 3 is 13");
    test.equal(source.elementAt(-1), undefined, "Value at element -1 is undefined");
    test.equal(source.elementAt(10), undefined, "Value at element 10 is undefined");
	test.done();
};