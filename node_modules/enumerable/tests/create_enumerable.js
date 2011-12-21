var common = require('../common');
var enumerable = require('../');

exports['Create an enumerable without a parameter'] = function(test) {
    var result = enumerable.create();

    test.equal(result.count(), 0);
	test.done();
};

exports['Create an enumerable from an array'] = function(test) {
    var result = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    test.equal(result.count(), 10);
	test.done();
};

exports['Create an enumerable from an object thats not an array'] = function(test) {
    var result = enumerable.create({ type: common.AnimalType.Dog, name: "Rover", age: 13, children: [] });

	test.equal(result.first().type, common.AnimalType.Dog);
	test.done();
};