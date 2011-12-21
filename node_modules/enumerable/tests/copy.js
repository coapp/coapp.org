var common = require('../common');
var enumerable = require('../');

exports["Enumerable of simple types"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.copy();

    test.equal(source.count() === result.count(), true, "Source Enumerable has the same number of items as result");
    test.done();
};

exports["Enumerable query of simple types"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).where(function(item) {
        return item > 3;
    });

    test.equal(source.expressions.length, 1, "Source contains expected number of expressions");

    var result = source.copy();

    test.equal(source.count() === result.count(), true, "Source Enumerable has the same number of items as result");
    test.equal(source.count(), 6, "Source Enumerable has 6 items");
    test.equal(result.count(), 6, "Result Enumerable has 6 items");
    test.equal(source.expressions.length === result.expressions.length, true, "Source Enumerable has the same number of expressions as result");
	test.done();
};