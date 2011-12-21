var common = require('../common');
var enumerable = require('../');

var pets = [];
pets.push({ type: common.AnimalType.Dog, name: "Rover", age: 13, children: [] });
pets.push({ type: common.AnimalType.Fish, name: "Goldie", age: 1, children: [] });
pets.push({ type: common.AnimalType.Cat, name: "Digby", age: 2, children: ["Felix"] });

exports["Union an Enumerable of simple type with Enumerable of simple type"] = function(test) {
    var source1 = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var source2 = enumerable.create([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
    var result = source1.union(source2);

    test.equal(result.count(), 20, "Result contains");
	test.done();
};

exports["Union an Enumerable of simple type with Array of simple type"] = function(test) {
    var source1 = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source1.union([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);

    test.equal(result.count(), 20, "Result contains");
	test.done();
};

exports["Union an Enumerable of simple type with Enumerable of with same values"] = function(test) {
    var source1 = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var source2 = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source1.union(source2);

    test.equal(result.count(), 10, "Result contains");
	test.done();
};

exports["Union an Enumerable of complex type with Enumerable of complex type"] = function(test) {
    var source1 = enumerable.create(common.animals);
    var source2 = enumerable.create(pets);
    var result = source1.union(source2);

    test.equal(result.count(), 13, "Result contains");
	test.done();
};

exports["Union an Enumerable of complex type with Enumerable of complex type with equalitycomparer"] = function(test) {
    var source1 = enumerable.create(common.animals);
    var source2 = enumerable.create(pets);
    var result = source1.union(source2, function(item1, item2) {
        return item1.type === item2.type;
    });

    test.equal(result.count(), 3, "Result contains");
	test.done();
};