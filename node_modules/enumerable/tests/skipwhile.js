var common = require('../common');
var enumerable = require('../');

exports["SkipWhile a elements in an Enumerable of simple type"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.skipWhile(function(item) {
        return item < 6;
    });

    test.equal(source.count(), 10, "Source contains");
    test.equal(result.count(), 4, "Result contains");
    test.equal(result.elementAt(0), 6, "First element");
	test.done();
};

exports["SkipWhile a elements in an Enumerable of complex type"] = function(test) {
    var source = enumerable.create(common.animals);

    test.equal(source.count(), 10, "Contains 10 elements");

    var result = source.skipWhile(function(item) {
        return item.age < 20;
    });

    test.equal(source.count(), 10, "Source contains");
    test.equal(result.count(), 6, "Result contains");
    test.equal(result.elementAt(0).name, "Fudge", "First element");
	test.done();
};