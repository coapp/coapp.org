var common = require('../common');
var enumerable = require('../');

exports["TakeWhile elements in an Enumerable of simple type"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    var result = source.takeWhile(function(item) {
        return item < 4;
    });

    test.equal(result.count(), 4, "Result contains");
    test.equal(result.elementAt(0), 0, "ELementAt");
    test.equal(result.elementAt(1), 1, "ELementAt");
    test.equal(result.elementAt(2), 2, "ELementAt");
    test.equal(result.elementAt(3), 3, "ELementAt");
	test.done();
};

exports["TakeWhile elements in an Enumerable of simple type 2"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    var result = source.takeWhile(function(item) {
        return item < -1;
    });

    test.equal(source.count(), 10, "Source contains");
    test.equal(result.count(), 0, "Result contains");
	test.done();
};

exports["TakeWhile elements in an Enumerable of simple type 1"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    var result = source.takeWhile(function(item) {
        return item < 20;
    });

    test.equal(result.count(), 10, "Result contains");
	test.done();
};

exports["TakeWhile elements in an Enumerable of complex type"] = function(test) {
    var source = enumerable.create(common.animals);

    var result = source.takeWhile(function(item) {
        return item.age < 20;
    });

    test.equal(result.count(), 4, "Result contains");
	test.done();
};