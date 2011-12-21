var common = require('../common');
var enumerable = require('../');

exports["Take elements in an Enumerable of simple type"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.take(3);

    test.equal(result.count(), 3, "Source contains");
    test.equal(result.elementAt(0), 0, "ELementAt");
    test.equal(result.elementAt(1), 1, "ELementAt");
    test.equal(result.elementAt(2), 2, "ELementAt");
	test.done();
};

exports["Take more elements from an an Enumerable of simple type than exist"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var exception = null;

    try {
        var result = source.take(11).execute();
    } catch (e) {
        exception = e;
    }

    test.equal(exception !== null, true, "Exception occurred");
    test.equal(exception, "Cannot take more elements than exist.", "Exception");
	test.done();
};

exports["Take elements in an empty Enumerable"] = function(test) {
    var source = enumerable.create();
    var exception = null;

    try {
        var result = source.take(11).execute();
    } catch (e) {
        exception = e;
    }

    test.equal(exception !== null, true, "Exception occurred");
    test.equal(exception, "Cannot take more elements than exist.", "Exception");
	test.done();
};