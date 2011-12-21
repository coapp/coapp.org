var common = require('../common');
var enumerable = require('../');

exports["Select from Enumerable of simple types"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    var result = source.select(function(item) {
        return { index: item };
    }).execute();

    test.equal(result.count(), 10, "Contains 10 elements");
    test.equal(result.first().index, 0, "Contains selected item");
	test.done();
};

exports["Select from Enumerable of complex types"] = function(test) {
    var source = enumerable.create(common.animals);

    var result = source.select(function(item) {
        return item.name + " is " + item.age + " years old";
    }).execute();

    test.equal(result.count(), 10, "Contains 10 elements");
    test.equal(result.first(), "Rover is 13 years old", "Contains selected item");
	test.done();
};