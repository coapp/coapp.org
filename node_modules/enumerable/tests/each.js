var common = require('../common');
var enumerable = require('../');

exports["Iterate through each item of Enumerable"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var count = 0;

    source.each(function(item, index) {
        count++;
    });

    test.equal(count, 10, "Iterated through 10 items");
	test.done();
};

exports["Iterate through each item of a queried Enumerable"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    source = source.where(function(item) {
        return item > 5;
    });

    var count = 0;
    source.each(function(item, index) {
        count++;
    });

    test.equal(count, 4, "Iterated through 4 items");
	test.done();
};