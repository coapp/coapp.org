var common = require('../common');
var enumerable = require('../');

exports["Last item in Enumerable"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.last();

    test.equal(result, 9, "Result is");
	test.done();
};

exports["Last item in an empty Enumerable"] = function(test) {
    var source = enumerable.create([]);
    var result = source.last();

    test.equal(result, undefined, "No last item exists in Enumerable");
	test.done();
};

exports["Last item in Enumerable with predicate"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.last(function(item) {
        return item < 3;
    });

    test.equal(result, 2, "Result is");
	test.done();
};

exports["Non existing last item in Enumerable with predicate"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.first(function(item) {
        return item < 0;
    });

    test.equal(result, undefined, "No last item exists in Enumerable");
	test.done();
};