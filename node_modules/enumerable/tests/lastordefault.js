var common = require('../common');
var enumerable = require('../');

exports["LastOrDefault item in Enumerable"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.lastOrDefault();

    test.equal(result, 9, "Result");
	test.done();
};

exports["LastOrDefault item in an empty Enumerable"] = function(test) {
    var source = enumerable.create([]);
    var result = source.lastOrDefault(null, "default");

    test.equal(result, "default", "Default value of 'default'");
	test.done();
};

exports["Non existing LastOrDefault item in Enumerable with predicate"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.lastOrDefault(function(item) {
        return item < 0;
    }, "default");

    test.equal(result, "default", "No last item exists in Enumerable, expect 'default'");
	test.done();
};