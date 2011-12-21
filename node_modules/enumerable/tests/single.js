var common = require('../common');
var enumerable = require('../');

exports["Single element from Enumerable of simple type"] = function(test) {
    var source = enumerable.create([5]);
    var result = source.single();

    test.equal(result, 5, "Single item exists");
	test.done();
};

exports["Single element from Enumerable of simple types"] = function(test) {
    var source = enumerable.create([5, 2]);
    var exception = null;

    try {
        var result = source.single();
    }
    catch (e) {
        exception = e;
    }

    test.equal(exception !== null, true, "Exception occurred");
    test.equal(exception, "The sequence should only contain one element", "Exception occurred");
	test.done();
};

exports["Single element from empty Enumerable"] = function(test) {
    var source = enumerable.create();
    var exception = null;

    try {
        var result = source.single();
    }
    catch (e) {
        exception = e;
    }

    test.equal(exception !== null, true, "Exception occurred");
    test.equal(exception, "The sequence should only contain one element", "Exception occurred");
	test.done();
};

exports["Single element from Enumerable with predicate"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.single(function(item) {
        return item >= 9;
    });

    test.equal(result, 9, "Single item exists");
	test.done();
};

exports["Single element from empty Enumerable with selector"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var exception = null;

    try {
        var result = source.single(function(item) {
            return item >= 5;
        });
    }
    catch (e) {
        exception = e;
    }

    test.equal(exception !== null, true, "Exception occurred");
    test.equal(exception, "The sequence should only contain one element", "Exception occurred");
	test.done();
};