var common = require('../common');
var enumerable = require('../');

exports['Array of simple types'] = function(test) {
    var t1 = enumerable.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    var result = t1.concat([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);

    test.equal(result.count(), 20);
	test.done();
};