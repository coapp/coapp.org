var common = require('../common');
var enumerable = require('../');

exports["ToArray elements in an Enumerable of simple type"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.toArray();

    test.equal(result.length, 10, "Result contains");
	test.done();
};

exports["ToArray elements in an Enumerable expression of simple type"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.where(function(item) {
        return item <= 5;
    }).toArray();

    test.equal(result.length, 6, "Result contains");
	test.done();
};