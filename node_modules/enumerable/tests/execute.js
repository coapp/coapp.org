var common = require('../common');
var enumerable = require('../');

exports["Execute Enumerable.Where.Select"] = function(test) {
    var source = enumerable.create(common.animals);

    var result = source.where(function(item) {
        return item.age > 9;
    }).select(function(item) {
        return item.name + " is " + item.age + " years old";
    }).execute();

    test.equal(source.count(), 10, "Source Enumerable has 10 items");

    var animalEqualityComparer = function(item1, item2) {
        return item1.type === item2.type && item1.name === item2.name && item1.age === item2.age;
    }

    test.equal(result.count(), 3, "Result contains 3 elements");
    test.equal(result.contains('Rex is 12 years old'), true, "Result contains 'Rex is 12 years old'");
    test.equal(result.contains('Rover is 13 years old'), true, "Result contains 'Rex is 13 years old'");
    test.equal(result.contains('Fudge is 20 years old'), true, "Result contains 'Fudge is 20 years old'");
    test.equal(result.contains('Scales is 2 years old'), false, "Result contains 'Scales is 2 years old'");

	test.done();
};