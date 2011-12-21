var common = require('../common');
var enumerable = require('../');

exports["Min item in Enumerable of simple types"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.min();

    test.equal(result, 0, "Result");
	test.done();
};

exports["Min item in Enumerable of complex types with selector"] = function(test) {
    var source = enumerable.create(common.animals);
    var result = source.min(function(item) {
        return item.age;
    });

    test.equal(result, 1, "Result");
	test.done();
};