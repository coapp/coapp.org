var common = require('../common');
var enumerable = require('../');

exports["Get the distinct simple types"] = function(test) {
    var source = enumerable.create([0, 2, 2, 6, 2, 3, 9, 10, 5, 3, 4, 5, 1, 4]);
    var distintValues = source.distinct();

    test.equal(distintValues.count(), 9, "Result Enumerable contains 9 items");
	test.done();
};

exports["Get the distinct complex types"] = function(test) {
    var source = enumerable.create(common.animals);
    var distintValues = source.distinct(function(item1, item2) {
        return item1.type === item2.type;
    });

    test.equal(distintValues.count(), 3, "Result Enumerable contains 3 unique animal types");
	test.done();
};