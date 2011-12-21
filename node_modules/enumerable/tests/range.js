var common = require('../common');
var enumerable = require('../');

exports["Get a Range of integers as an Enumerable"] = function(test) {
    var result = enumerable.range(0, 10);

    test.equal(result.count(), 10, "Source contains");
    test.equal(result.elementAt(0), 0, "Result starts with");
    test.equal(result.elementAt(9), 9, "Result ends with");
	test.done();
};

exports["Get a Range of integers as an Enumerable"] = function(test) {
    var result = enumerable.range(-5, 10);

    test.equal(result.count(), 10, "Source contains");
    test.equal(result.elementAt(0), -5, "Result starts with");
    test.equal(result.elementAt(9), 4, "Result ends with");
	test.done();
};

exports["Get a Range of integers as an Enumerable, negative number"] = function(test) {
    var exception = null;

    try {
        var result = enumerable.range(0, -1);
    } catch (e) {
        exception = e;
    }

    test.equal(exception !== null, true, "Exception occurred");
    test.equal(exception, "Count is out of range.", "Exception");
	test.done();
};