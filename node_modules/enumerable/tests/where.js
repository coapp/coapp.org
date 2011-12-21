var common = require('../common');
var enumerable = require('../');

exports["Where an Enumerable of simple types"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    var result = source.where(function(item) {
        return item > 4;
    });

    test.equal(source.count(), 10, "Source contains");
    test.equal(result.count(), 5, "Result contains");
	test.done();
};

exports["Where an Enumerable of simple types twice"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    var result = source.where(function(item) {
        return item > 4;
    }).where(function(item) {
        return item < 7;
    });

    test.equal(source.count(), 10, "Source contains");
    test.equal(result.count(), 2, "Result contains");
	test.done();
};