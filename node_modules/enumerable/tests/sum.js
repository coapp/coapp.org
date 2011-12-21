var common = require('../common');
var enumerable = require('../');

exports["Sum elements in an Enumerable of simple type without selector"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.sum();

    test.equal(result, 45, "Sum");
	test.done();
};

exports["Sum elements in an Enumerable of simple type with selector"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.sum(function(item) {
        return item;
    });

    test.equal(result, 45, "Sum");
	test.done();
};

exports["Sum elements in an Enumerable of complex type with selector"] = function(test) {
	var pets = [];
	pets.push({ type: common.AnimalType.Dog, name: "Rover", age: 13, children: [] });
	pets.push({ type: common.AnimalType.Fish, name: "Goldie", age: 1, children: [] });
	pets.push({ type: common.AnimalType.Cat, name: "Digby", age: 2, children: ["Felix"] });
	
    var source = enumerable.create(pets);
    var result = source.sum(function(item) {
        return item.age;
    });

    test.equal(result, 16, "Sum");
	test.done();
};