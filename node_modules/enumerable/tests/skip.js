var common = require('../common');
var enumerable = require('../');

exports["Skip a number of elements in an Enumerable of simple type"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.skip(5);

    test.equal(source.count(), 10, "Source contains");
    test.equal(result.count(), 5, "Result contains");
    test.equal(result.elementAt(0), 5, "First element");
	test.done();
};

exports["Skip a number of elements in an empty Enumerable"] = function(test) {
    var source = enumerable.create();
    var result = source.skip(5);

    test.equal(source.count(), 0, "Source contains");
    test.equal(result.count(), 0, "Result contains");
	test.done();
};