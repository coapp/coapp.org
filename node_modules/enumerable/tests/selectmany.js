var common = require('../common');
var enumerable = require('../');

exports["SelectMany from Enumerable of complex types"] = function(test) {
    var source = enumerable.create(common.animals);

    var result = source.selectMany(function(item, index) {
        return item.children;
    }).execute();

    test.equal(result.count(), 5, "Contains 5 elements");
    test.equal(result.elementAt(0), "Rover", "Contains item");
    test.equal(result.elementAt(1), "Scales", "Contains item");
    test.equal(result.elementAt(2), "Goldie", "Contains item");
    test.equal(result.elementAt(3), "Digby", "Contains item");
    test.equal(result.elementAt(4), "Kitty", "Contains item");
	test.done();
};

exports["SelectMany from Enumerable of complex types with resultSelector"] = function(test) {
    var source = enumerable.create(common.animals);

    var result = source.selectMany(function(item, index) {
        return item.children;
    }, function(item, selectedItem) {
        return item.name + " has a child called " + selectedItem;
    }).execute();

    test.equal(result.count(), 5, "Contains 5 elements");
    test.equal(result.elementAt(0), "Rex has a child called Rover", "Contains item");
    test.equal(result.elementAt(1), "Goldie has a child called Scales", "Contains item");
    test.equal(result.elementAt(2), "Goldie has a child called Goldie", "Contains item");
    test.equal(result.elementAt(3), "Fudge has a child called Digby", "Contains item");
    test.equal(result.elementAt(4), "Fudge has a child called Kitty", "Contains item");
	test.done();
};