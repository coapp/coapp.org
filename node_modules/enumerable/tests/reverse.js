var common = require('../common');
var enumerable = require('../');

exports["Reverse all elements"] = function(test) {
    var source = enumerable.create([5, 2, 63, 1, 3]);
    var result = source.reverse();

    test.equal(result.indexOf(5), 4, "Index of 5");
    test.equal(result.indexOf(2), 3, "Index of 2");
    test.equal(result.indexOf(63), 2, "Index of 63");
    test.equal(result.indexOf(1), 1, "Index of 1");
    test.equal(result.indexOf(3), 0, "Index of 3");
	test.done();
};

exports["Reverse sub section of elements"] = function(test) {
    var source = enumerable.create([5, 2, 63, 1, 3]);
    var result = source.reverse(2, 2);

    test.equal(result.indexOf(5), 0, "Index of 5");
    test.equal(result.indexOf(2), 1, "Index of 2");
    test.equal(result.indexOf(63), 3, "Index of 63");
    test.equal(result.indexOf(1), 2, "Index of 1");
    test.equal(result.indexOf(3), 4, "Index of 3");
	test.done();
};

exports["Reverse sub scetion of elements with count being more than element count"] = function(test) {
    var source = enumerable.create([5, 2, 63, 1, 3]);
    var result = source.reverse(2, 10);

    test.equal(result.indexOf(5), 0, "Index of 5");
    test.equal(result.indexOf(2), 1, "Index of 2");
    test.equal(result.indexOf(63), 4, "Index of 63");
    test.equal(result.indexOf(1), 3, "Index of 1");
    test.equal(result.indexOf(3), 2, "Index of 3");
	test.done();
};

exports["Reverse sub section of elements with count negative"] = function(test) {
    var source = enumerable.create([5, 2, 63, 1, 3]);
    var exception = null;

    try {
        source.reverse(2, -3).execute();
    }
    catch (e) {
        exception = e;
    }

    test.equal(exception !== null, true, "Exception occurred");
    test.equal(exception, "Count is out of range", "Exception occurred");
	test.done();
};