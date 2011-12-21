var common = require('../common');
var enumerable = require('../');

exports["Repeat a simple type as an Enumerable"] = function(test) {
    var result = enumerable.repeat(6, 10);

    test.equal(result.count(), 10, "Source contains");
    test.equal(result.elementAt(0), 6, "Result starts with");
    test.equal(result.elementAt(9), 6, "Result ends with");
	test.done();
};

exports["Repeat a complex type as an Enumerable"] = function(test) {
    var result = enumerable.repeat({ name: "Frank", age: 12 }, 10);

    test.equal(result.count(), 10, "Source contains");
    test.equal(result.elementAt(0).name, "Frank", "Result starts with");
    test.equal(result.elementAt(9).name, "Frank", "Result ends with");
	test.done();
};

exports["Repeat a simple type as an Enumerable, negative count"] = function(test) {
    var exception = null;

    try {
        var result = enumerable.repeat(0, -1);
    } catch (e) {
        exception = e;
    }

    test.equal(exception !== null, true, "Exception occurred");
    test.equal(exception, "Count is out of range.", "Exception");
	test.done();
};