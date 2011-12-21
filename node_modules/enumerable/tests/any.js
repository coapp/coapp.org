var common = require('../common');
var enumerable = require('../');

exports['Array items of simple type'] = function(test) {
    var value = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).any(function(item) {
        return item > 6;
    });
    test.equal(value, true);

    var value = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).any(function(item) {
        return item < 0;
    });
    test.equal(value, false);
	test.done();
};

exports['Enumerable items of complex type'] = function(test) {
    var value = enumerable.create(common.animals).any(function(item) {
        return item.type === common.AnimalType.Fish;
    });
    test.equal(value, true);

    var value = enumerable.create(common.animals).any(function(item) {
        return item.type === common.AnimalType.Goat;
    });
    test.equal(value, false);
	test.done();
};