exports.arrayHas = function(array, value) {
	if (array)
		for (var i in array)
			if (value == array[i])
				return true;
	return false;
}

/**
 * callWhenDone: a simple synchronized callback closure
 * @author adrienjoly, whyd
 */
exports.callWhenDone = function(callback) {
	var counter = 0;
	return function (incr) {
		if (0 == (counter += incr))
			callback();
	};
};
