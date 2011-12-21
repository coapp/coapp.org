var common = require('../common');
var enumerable = require('../');

var pets = [];
pets.push({ type: common.AnimalType.Dog, name: "Rover", age: 13, children: [] });
pets.push({ type: common.AnimalType.Fish, name: "Goldie", age: 1, children: [] });
pets.push({ type: common.AnimalType.Cat, name: "Digby", age: 2, children: ["Felix"] });

exports["OrderBy Enumerable of simple types"] = function(test) {
    var source = enumerable.create([6, 2, 7, 3, 1]);
    var result = source.orderBy();
    var resultArray = result.toArray();

    test.equal(resultArray[0], 1, "Element 0");
    test.equal(resultArray[1], 2, "Element 1");
    test.equal(resultArray[2], 3, "Element 2");
    test.equal(resultArray[3], 6, "Element 3");
    test.equal(resultArray[4], 7, "Element 4");
	test.done();
};

exports["OrderBy Enumerable of complex types with number"] = function(test) {
    var source = enumerable.create(pets);
    var result = source.orderBy(function(item) {
        return item.age;
    });
    var resultArray = result.toArray();

    test.equal(resultArray[0].age, 1, "Element 0");
    test.equal(resultArray[1].age, 2, "Element 1");
    test.equal(resultArray[2].age, 13, "Element 2");
	test.done();
};

exports["OrderBy Enumerable of complex types with string"] = function(test) {
    var source = enumerable.create(pets);
    var result = source.orderBy(function(item1) {
        return item1.name;
    });
    var resultArray = result.toArray();

    test.equal(resultArray[0].name, "Digby", "Element 0");
    test.equal(resultArray[1].name, "Goldie", "Element 1");
    test.equal(resultArray[2].name, "Rover", "Element 2");
	test.done();
};

exports["OrderBy Enumerable of complex types with custom function"] = function(test) {
    var source = enumerable.create(pets);

    var result = source.orderBy(null, function(item1, item2) {
        if (item1.name === item2.name) {
            return 0;
        } else if (item1.name < item2.name) {
            return -1;
        } else if (item2.name < item1.name) {
            return 1;
        }
    });
    var resultArray = result.toArray();

    test.equal(resultArray[0].name, "Digby", "Element 0");
    test.equal(resultArray[1].name, "Goldie", "Element 1");
    test.equal(resultArray[2].name, "Rover", "Element 2");
	test.done();
};