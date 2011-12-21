var common = require('../common');
var enumerable = require('../');

exports["GroupBy a simple type as key"] = function(test) {
    var source = enumerable.create(common.animals);
    var groupedByAnimalType = source.groupBy(function(item) {
        return item.type;
    })
    .execute();

    var numberOfGroups = groupedByAnimalType.count();
    test.equal(numberOfGroups, 3, "Result is 3");

    var keyAnimalEqualityComparer = function(item1, item2) {
        return item1.key === item2;
    };

    var containsCats = groupedByAnimalType.contains(common.AnimalType.Cat, keyAnimalEqualityComparer);
    test.equal(containsCats, true, "Grouped items contains cats");

    var containsDogs = groupedByAnimalType.contains(common.AnimalType.Dog, keyAnimalEqualityComparer);
    test.equal(containsDogs, true, "Grouped items contains dogs");

    var containsFish = groupedByAnimalType.contains(common.AnimalType.Fish, keyAnimalEqualityComparer);
    test.equal(containsFish, true, "Grouped items contains fish");

    var containsGoats = groupedByAnimalType.contains(common.AnimalType.Goat, keyAnimalEqualityComparer);
    test.equal(containsGoats, false, "Grouped items contains goats");

    var numberCats = 0;
    groupedByAnimalType.where(function(item) {
        return item.key === common.AnimalType.Cat;
    })
    .select(function(item) {
        return item.values;
    })
    .each(function(item) {
        numberCats += item.count();
    });
    test.equal(numberCats, 4, "Number of cats 4");

    var numberDogs = 0;
    groupedByAnimalType.where(function(item) {
        return item.key === common.AnimalType.Dog;
    })
    .select(function(item) {
        return item.values;
    })
    .each(function(item) {
        numberDogs += item.count();
    });
    test.equal(numberDogs, 3, "Number of dogs 3");

    var numberFish = 0;
    groupedByAnimalType.where(function(item) {
        return item.key === common.AnimalType.Fish;
    })
    .select(function(item) {
        return item.values;
    })
    .each(function(item) {
        numberFish += item.count();
    });
    test.equal(numberFish, 3, "Number of fish 3");
	test.done();
};

exports["GroupBy a complex type as key"] = function(test) {
    var source = enumerable.create(common.animals);
    source = source.concat([{ type: common.AnimalType.Cat, name: "Fluffles", age: 2, children: [] }]);

    var groupedByAnimalType = source.groupBy(function(item) {
        return { type: item.type, age: item.age };
    }, function(item1, item2) {
        return item1.type === item2.type && item1.age === item2.age;
    });

    var numberOfGroups = groupedByAnimalType.count();
    test.equal(numberOfGroups, 10, "Result is 10");

    var numberCatsAged2 = 0;
    groupedByAnimalType.where(function(item) {
        return item.key.type === common.AnimalType.Cat && item.key.age === 2;
    })
    .each(function(item) {
        numberCatsAged2 += item.values.count();
    });

    test.equal(numberCatsAged2, 2, "Grouped items contains 2 cats aged 2");
	test.done();
};