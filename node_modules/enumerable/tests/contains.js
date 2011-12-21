var common = require('../common');
var enumerable = require('../');

exports["simple type"] = function(test) {
    var value = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).contains(3);
    test.equal(value, true, "List contains the value");

    var value = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).contains(11);
    test.equal(value, false, "List doesn't contains the value");
	test.done();
};

exports["complex type"] = function(test) {
    var value = enumerable.create(common.animals).contains({ age: 4, type: common.AnimalType.Cat }, function(item1, item2) {
        return item1.age === item2.age && item1.type === item2.type;
    });
    test.equal(value, true, "List contains the value");

    var value = enumerable.create(common.animals).contains({ age: 3, type: common.AnimalType.Cat }, function(item1, item2) {
        return item1.age === item2.age && item1.type === item2.type;
    });
    test.equal(value, false, "List doesn't contains the value");
	test.done();
};	