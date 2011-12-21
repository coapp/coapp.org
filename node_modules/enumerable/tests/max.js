var common = require('../common');
var enumerable = require('../');

exports["Max item in Enumerable of simple types"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.max();

    test.equal(result, 9, "Result");
	test.done();
};

exports["Max item in Enumerable of complex types with selector"] = function(test) {
    var source = enumerable.create(common.animals);
    var result = source.max(function(item) {
        return item.age;
    });

    test.equal(result, 20, "Result");
	test.done();
};