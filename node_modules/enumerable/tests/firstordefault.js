var common = require('../common');
var enumerable = require('../');

exports["FirstOrDefault item in Enumerable"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.firstOrDefault();

    test.equal(result, 0, "Result is 0");
	test.done();
};

exports["FirstOrDefault item in an empty Enumerable"] = function(test) {
    var source = enumerable.create([]);
    var result = source.firstOrDefault(null, "default");

    test.equal(result, "default", "Default value of 'default'");
	test.done();
};

exports["Non existing FirstOrDefault item in Enumerable with predicate"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.firstOrDefault(function(item) {
        return item > 10;
    }, "default");

    test.equal(result, "default", "No first item exists in Enumerable, expect 'default'");
	test.done();
};