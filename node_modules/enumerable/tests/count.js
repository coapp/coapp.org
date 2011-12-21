var common = require('../common');
var enumerable = require('../');

exports["Count the number of items in Enumerable"] = function(test) {
    var value = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).count();

    test.equal(value, 10, "Enumerable contains 10 items");
	test.done();
};

exports["Count the number of items in Enuenumerable.createmerable with predicate"] = function(test) {
    var value = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).count(function(item) {
        return item <= 5;
    });

    test.equal(value, 6, "Enumerable contains 6 items left than or equal to 5");
	test.done();
};