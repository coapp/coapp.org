



function addRange(sequence, elements) {
    ///	<summary>
    ///		1: addRange(sequence, array) - This function adds all the elements in an array to the sequence.
    ///		2: addRange(sequence, Enumerable) - This function adds all the elements in a Enumerable object to the sequence.
    ///	</summary>
    ///	<param name="sequence" type="Enumerable">
    ///     The sequence to add the elements to.
    ///	</param>
    ///	<param name="elements" type="Array">
    ///     1: The array to add to the Enumerable object.
    ///     2: The Enumerable object to add to the Enumerable object.
    ///	</param>
    ///	<returns type="Enumerable" />
    var thisEnumerable = sequence;
    var parameterEnumerable = ensureEnumerable(elements);

    each(parameterEnumerable, function (element) {
        thisEnumerable.elements.push(element);
        thisEnumerable.length++;
    });

    return sequence;
}	

    function clear(sequence) {
        ///	<summary>
        ///		Removes all elements from the sequence.
        ///	</summary>
        ///	<param name="sequence" type="Enumerable">
        ///     The sequence to clear.
        ///	</param>
        ///	<returns type="Enumerable" />
        while (sequence.elements.pop()) {
        }

        while (sequence.expressions.pop()) {
        }

        return sequence;
    }

function insert(sequence, index, item) {
    ///	<summary>
    ///		Inserts an element into the Enumerable at the specified index.
    ///	</summary>
    ///	<param name="index" type="Number" integer="true">
    ///		The zero-based index at which item should be inserted.
    ///	</param>
    ///	<param name="item" type="Object">
    ///		The object to insert.
    ///	</param>
    ///	<returns type="Enumerable" />
    if (index > sequence.elements.length && index < 0) {
        throw "Index argument is out of range of Enumerable.";
    }

    var first = sequence.elements.slice(0, index);
    var second = sequence.elements.slice(index, sequence.elements.length);
    var newItem = [];
    newItem.push(item);

    sequence.elements = first.concat(newItem).concat(second);

    return sequence;
}

function insertRange(sequence, index, items) {
    ///	<summary>
    ///		1: insertRange(index, array) - Inserts a the array elements into the Enumerable at the specified index.
    ///		2: insertRange(index, Enumerable) - Inserts the elements of the Enumerable object into the Enumerable at the specified index.
    ///	</summary>
    ///	<param name="index" type="Number" integer="true">
    ///		The zero-based index at which item should be inserted.
    ///	</param>
    ///	<param name="item" type="Array">
    ///		1: An array of objects to insert.
    ///		2: An Enumerable object to insert the elements of.
    ///	</param>
    ///	<returns type="Enumerable" />
    if (index > sequence.elements.length && index < 0) {
        throw "Index argument is out of range of Enumerable";
    }

    var first = sequence.elements.slice(0, index);
    var second = sequence.elements.slice(index, sequence.elements.length);
    var newItems = ensureEnumerable(items).elements;

    this.elements = first.concat(newItems).concat(second);

    return sequence;
}

function remove(sequence, item) {
    /// <summary>
    ///     Removes the first occurrence of a specific object from Enumerable.
    /// </summary>
    ///	<param name="item" type="Object">
    ///		The object to remove from the Enumerable. 
    ///	</param>
    ///	<returns type="Boolean" />
    var index = null;
    for (var i = 0; i < sequence.elements.length; i++) {
        if (sequence.elements[i] === item) {
            index = i;
            break;
        }
    }

    return removeAt(sequence, index);
}

function removeAll(sequence, predicate) {
    /// <summary>
    ///     Removes the all the elements that match the conditions defined by the specified predicate.
    /// </summary>
    ///	<param name="predicate" type="Function">
    ///		The predicate that defines the conditions of the elements to remove.
    ///	</param>
    ///	<returns type="Number" integer="true" />
    var matches = [];

    var length = sequence.elements.length;
    for (var i = 0; i < length; i++) {
        var element = sequence.elements[i];
        if (predicate(element, i)) {
            matches.push(element);
        }
    }

    var matchesLength = matches.length;
    for (var m = 0; m < matchesLength; m++) {
        remove(sequence, matches[m]);
    }

    return matches.length;
}

function removeAt(sequence, index) {
    /// <summary>
    ///     Removes the element at the specified index of the Enumerable.
    /// </summary>
    ///	<param name="item" type="Number" integer="true">
    ///		The zero-based index of the element to remove.
    ///	</param>
    ///	<returns type="Boolean" />
    if (index !== null && index < sequence.elements.length && index >= 0) {
        var first = sequence.elements.slice(0, index);
        var second = sequence.elements.slice(index + 1, sequence.elements.length);
        sequence.elements = first.concat(second);

        return true;
    } else {
        return false;
    }
}

function removeRange(sequence, index, count) {
    /// <summary>
    ///     Removes a range of elements from the Enumerable.
    /// </summary>
    ///	<param name="index" type="Number" integer="true">
    ///		The zero-based starting index of the range of elements to remove.
    ///	</param>
    ///	<param name="count" type="Number" integer="true">
    ///		The number of elements to remove.
    ///	</param>
    ///	<returns type="Boolean" />
    if (count < 0) {
        throw "Count is out of range";
    }

    var toRemove = [];
    var top = index + count;
    if (top > sequence.elements.length) {
        top = sequence.elements.length;
    }

    for (var i = index; i < top; i++) {
        toRemove.push(sequence.elements[i]);
    }

    var res = false;
    for (var j = 0; j < toRemove.length; j++) {
        res = remove(sequence, toRemove[j]);
    }

    return res;
}



    Enumerable.fn = Enumerable.prototype = {
	
		add: function (element) {
            ///	<summary>
            ///		This function adds an element to the Enumerable object.
            ///	</summary>
            ///	<param name="element" type="Object">
            ///     The object to add.
            ///	</param>
            var t = this.execute();
            add(t, element);
            this.elements = t.elements;
        },

        addRange: function (elements) {
            ///	<summary>
            ///		1: addRange(array) - This function adds all the elements in an array to the Enumerable object.
            ///		2: addRange(Enumerable) - This function adds all the elements in a Enumerable object to the Enumerable object.
            ///	</summary>
            ///	<param name="elements" type="Array" ArrayElementType="Object">
            ///     1: The array to add to the Enumerable object.
            ///     2: The Enumerable object to add to the Enumerable object.
            ///	</param>
            var t = this.execute();
            addRange(t, elements);
            this.elements = t.elements;
        },

	        clear: function () {
	            ///	<summary>
	            ///		Removes all elements from the Enumerable.
	            ///	</summary>
	            clear.call(this, this);
	        },

        insert: function (index, item) {
            ///	<summary>
            ///		Inserts an element into the Enumerable at the specified index.
            ///	</summary>
            ///	<param name="index" type="Number" integer="true">
            ///		The zero-based index at which item should be inserted.
            ///	</param>
            ///	<param name="item" type="Object">
            ///		The object to insert.
            ///	</param>
            ///	<returns type="Enumerable" />
            return addExpression(this, insert, [index, item]);
        },

        insertRange: function (index, items) {
            ///	<summary>
            ///		1: insertRange(index, array) - Inserts a the array elements into the Enumerable at the specified index.
            ///		2: insertRange(index, Enumerable) - Inserts the elements of the Enumerable object into the Enumerable at the specified index.
            ///	</summary>
            ///	<param name="index" type="Number" integer="true">
            ///		The zero-based index at which item should be inserted.
            ///	</param>
            ///	<param name="item" type="Array">
            ///		1: An array of objects to insert.
            ///		2: An Enumerable object to insert the elements of.
            ///	</param>
            ///	<returns type="Enumerable" />
            return addExpression(this, insertRange, [index, items]);
        },

		remove: function (item) {
            /// <summary>
            ///     Removes the first occurrence of a specific object from Enumerable.
            /// </summary>
            ///	<param name="item" type="Object">
            ///		The object to remove from the Enumerable. 
            ///	</param>
            ///	<returns type="Boolean" />
            var t = this.execute();
            var res = remove(t, item);
            this.elements = t.elements;
            return res;
        },

        removeAll: function (predicate) {
            /// <summary>
            ///     Removes the all the elements that match the conditions defined by the specified predicate.
            /// </summary>
            ///	<param name="predicate" type="Function">
            ///		The predicate that defines the conditions of the elements to remove.
            ///	</param>
            ///	<returns type="Number" integer="true" />
            var t = this.execute();
            var res = removeAll(t, predicate);
            this.elements = t.elements;

            return res;
        },

        removeAt: function (index) {
            /// <summary>
            ///     Removes the element at the specified index of the Enumerable.
            /// </summary>
            ///	<param name="item" type="Number" integer="true">
            ///		The zero-based index of the element to remove.
            ///	</param>
            ///	<returns type="Boolean" />
            var t = this.execute();
            var res = removeAt(t, index);
            this.elements = t.elements;

            return res;
        },

        removeRange: function (index, count) {
            /// <summary>
            ///     Removes a range of elements from the Enumerable.
            /// </summary>
            ///	<param name="index" type="Number" integer="true">
            ///		The zero-based starting index of the range of elements to remove.
            ///	</param>
            ///	<param name="count" type="Number" integer="true">
            ///		The number of elements to remove.
            ///	</param>
            ///	<returns type="Boolean" />
            var t = this.execute();
            var res = removeRange(t, index, count);
            this.elements = t.elements;

            return res;
        },
	
	};