var common = require('../common');
var enumerable = require('../');

exports["IndexOf a simple type not occurring"] = function(test) {
    var source = enumerable.create([3, 2, 7, 1, 5, 6, 3, 4]);

    test.equal(source.indexOf(10), undefined, "Index of 10 is undefined");
	test.done();
};

exports["IndexOf a simple type occurring once from beginning"] = function(test) {
    var source = enumerable.create([3, 2, 7, 1, 5, 6, 3, 4]);

    test.equal(source.indexOf(7), 2, "Index of 7 is 2");
	test.done();
};

exports["IndexOf a simple type occurring twice from beginning"] = function(test) {
    var source = enumerable.create([3, 2, 7, 1, 5, 6, 3, 4]).concat([3, 2, 7, 1, 5, 6, 3, 4]);

    test.equal(source.indexOf(1), 3, "Index of 1 is 3");
	test.done();
};

exports["IndexOf a simple type occurring once from position 2"] = function(test) {
    var source = enumerable.create([3, 2, 7, 1, 5, 6, 3, 4]).concat([3, 2, 7, 1, 5, 6, 3, 4]);

    test.equal(source.indexOf(1, 2), 3, "Index of 1 is 3");
	test.done();
};

exports["IndexOf a simple type occurring once from beginning within 2 indexes"] = function(test) {
    var source = enumerable.create([3, 2, 7, 1, 5, 6, 3, 4]);

    test.equal(source.indexOf(7, null, 2), undefined, "Index of 7");
    test.equal(source.indexOf(7, undefined, 2), undefined, "Index of 7");
    test.equal(source.indexOf(2, null, 2), 1, "Index of 2");
    test.equal(source.indexOf(2, undefined, 2), 1, "Index of 2");
	test.done();
};

exports["IndexOf a complex type occurring"] = function(test) {
    var result = enumerable.create(common.animals).orderBy(function(item) {
        return item.age;
    });

    test.equal(common.animals[3].children.length, 2, "Source expected result has children");
    test.equal(common.animals[3].name, "Goldie", "Source expected result name");
    test.equal(common.animals[3].age, 3, "Source expected result age");
    test.equal(result.elementAt(4).children.length, 2, "Result expected result has children");
    test.equal(result.elementAt(4).name, "Goldie", "Result expected result name");
    test.equal(result.elementAt(4).age, 3, "Result expected result age");
    test.equal(result.indexOf(common.animals[3]), 4, "Index of animal");
	test.done();
};