var common = require('../common');
var enumerable = require('../');

exports["Get the Enumerable simple type elements which aren't in a second Array"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var second = [0, 2, 2, 6, 2, 3, 9, 10, 5, 3, 4, 5, 4];
    var result = source.except(second);

    test.equal(result.count(), 3, "Result contains 3 elements");
    test.equal(result.contains(1), true, "Result contains element with value 1");
    test.equal(result.contains(7), true, "Result contains element with value 7");
    test.equal(result.contains(8), true, "Result contains element with value 8");
    test.equal(result.contains(2), false, "Result doesn't contain element with value 2");
	test.done();
};

exports["Get the Enumerable complex type elements which aren't in a second Array"] = function(test) {
    var source = enumerable.create(common.animals);
    var second = [];
    second.push({ type: common.AnimalType.Fish, name: "Scales", age: 2, children: [] });
    second.push({ type: common.AnimalType.Cat, name: "Kitty", age: 4, children: [] });

    test.equal(source.count(), 10, "Source Enumerable has 10 items");

    var animalEqualityComparer = function(item1, item2) {
        return item1.type === item2.type && item1.name === item2.name && item1.age === item2.age;
    }

    var result = source.except(second, animalEqualityComparer);

    test.equal(result.count(), 8, "Result contains 8 elements");
    test.equal(result.contains(common.animals[0], animalEqualityComparer), true, "Result contains animal");
    test.equal(result.contains(common.animals[5], animalEqualityComparer), true, "Result contains animal");
    test.equal(result.contains(second[0], animalEqualityComparer), false, "Result doesn't contain animal");
    test.equal(result.contains(second[1], animalEqualityComparer), false, "Result doesn't contain animal");
	test.done();
};