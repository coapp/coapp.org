var common = require('../common');
var enumerable = require('../');

exports["First item in Enumerable"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.first();

    test.equal(result, 0, "Result is 0");
	test.done();
};

exports["First item in an empty Enumerable"] = function(test) {
    var source = enumerable.create([]);
    var result = source.first();

    test.equal(result, undefined, "No first item exists in Enumerable");
	test.done();
};

exports["First item in Enumerable with predicate"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.first(function(item) {
        return item > 4;
    });

    test.equal(result, 5, "Result is 5");
	test.done();
};

exports["Non existing first item in Enumerable with predicate"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.first(function(item) {
        return item > 10;
    });

    test.equal(result, undefined, "No first item exists in Enumerable");
	test.done();
};