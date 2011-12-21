var common = require('../common');
var enumerable = require('../');

var pets = [];
pets.push({ type: common.AnimalType.Dog, name: "Rover", age: 13, children: [] });
pets.push({ type: common.AnimalType.Fish, name: "Goldie", age: 1, children: [] });
pets.push({ type: common.AnimalType.Cat, name: "Digby", age: 2, children: ["Felix"] });

exports["ToDictionary elements in an Enumerable of complex type"] = function(test) {
    var source = enumerable.create(common.animals);
    var exception = null;

    try {
        var result = source.toDictionary(function(item) {
            return item.type;
        });
    } catch (e) {
        exception = e;
    }

    test.equal(exception !== null, true, "Exception occurred");
    test.equal(exception, "An item with the same key has already been added.", "Exception");
	test.done();
};

exports["ToDictionary elements in an Enumerable of complex type without selector"] = function(test) {
    var source = enumerable.create(pets);
    var result = source.toDictionary(function(item) {
        return item.type;
    });

    test.equal(typeof result[common.AnimalType.Cat] !== "undefined", true, "Contains a key 'cat'");
    test.equal(typeof result[common.AnimalType.Fish] !== "undefined", true, "Contains a key 'fish'");
    test.equal(typeof result[common.AnimalType.Dog] !== "undefined", true, "Contains a key 'dog'");
	test.done();
};

exports["ToDictionary elements in an Enumerable of complex type with selector"] = function(test) {
    var source = enumerable.create(pets);
    var result = source.toDictionary(function(item) {
        return item.type;
    }, function(item) {
        return { name: item.name };
    });

    test.equal(typeof result[common.AnimalType.Cat] !== "undefined", true, "Contains a key 'cat'");
    test.equal(typeof result[common.AnimalType.Fish] !== "undefined", true, "Contains a key 'fish'");
    test.equal(typeof result[common.AnimalType.Dog] !== "undefined", true, "Contains a key 'dog'");
    test.equal(result[common.AnimalType.Cat].name, "Digby", "Digby called");
    test.equal(result[common.AnimalType.Fish].name, "Goldie", "Goldie called");
    test.equal(result[common.AnimalType.Dog].name, "Rover", "Rover called");
	test.done();
};

exports["ToDictionary elements in an Enumerable of complex type with selector and equalitycomparer"] = function(test) {
    var source = enumerable.create(pets);
    var result = source.toDictionary(function(item) {
        return item.type;
    }, function(item) {
        return { name: item.name };
    }, function(item1, item2) {
        return item1 === item2;
    });

    test.equal(typeof result[common.AnimalType.Cat] !== "undefined", true, "Contains a key 'cat'");
    test.equal(typeof result[common.AnimalType.Fish] !== "undefined", true, "Contains a key 'fish'");
    test.equal(typeof result[common.AnimalType.Dog] !== "undefined", true, "Contains a key 'dog'");
    test.equal(result[common.AnimalType.Cat].name, "Digby", "Digby called");
    test.equal(result[common.AnimalType.Fish].name, "Goldie", "Goldie called");
    test.equal(result[common.AnimalType.Dog].name, "Rover", "Rover called");
	test.done();
};