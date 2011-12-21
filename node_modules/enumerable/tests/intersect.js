var common = require('../common');
var enumerable = require('../');

exports["Intersect an array of simple types"] = function(test) {
    var source = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = source.intersect([0, 5, 6]);

    test.equal(result.count(), 3, "Intersection contains a count of");
    test.equal(result.contains(0), true, "Result contains 0");
    test.equal(result.contains(5), true, "Result contains 5");
    test.equal(result.contains(6), true, "Result contains 6");
    test.equal(result.contains(7), false, "Result contains 7");
	test.done();
};

exports["Intersect an array of complex types"] = function(test) {
    var source = enumerable.create(common.animals);

	var pets = [];
	pets.push({ type: common.AnimalType.Dog, name: "Rover", age: 13, children: [] });
	pets.push({ type: common.AnimalType.Fish, name: "Goldie", age: 1, children: [] });
	pets.push({ type: common.AnimalType.Cat, name: "Digby", age: 2, children: ["Felix"] });

    var result = source.intersect(pets, function(item1, item2) {

        function areChildrenMatching() {
            var matchingChildren = true;
            enumerable.create(item1.children).each(function(item1Child) {
                if (enumerable.create(item2.children).contains(item1Child) === false) {
                    matchingChildren = false;
                    return;
                }
            });

            return matchingChildren;
        };

        return item1.type === item2.type &&
               item1.name === item2.name &&
               item1.age === item2.age &&
               areChildrenMatching();
    });

    test.equal(result.count(), 2, "Intersection contains a count of");
	test.done();
};