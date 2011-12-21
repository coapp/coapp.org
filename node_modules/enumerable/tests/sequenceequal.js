var common = require('../common');
var enumerable = require('../');

exports["SequenceEqual from Enumerable of simple types are equal"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.sequenceEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    test.equal(result, true, "Sequences are equal");
	test.done();
};

exports["SequenceEqual from Enumerable of simple types aren't equal"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.sequenceEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);

    test.equal(result, false, "Sequences aren't equal");
	test.done();
};

exports["SequenceEqual from Enumerable of complex types are equal"] = function(test) {
    var source = enumerable.create(common.animals);
    var result = source.sequenceEqual(common.animals);

    test.equal(result, true, "Sequences are equal");
	test.done();
};

exports["SequenceEqual from Enumerable of complex types are equal with equalityComparer"] = function(test) {
    var source = enumerable.create(common.animals);
    var result = source.sequenceEqual(common.animals, function(item1, item2) {
        return item1.name === item2.name;
    });

    test.equal(result, true, "Sequences are equal");
	test.done();
};