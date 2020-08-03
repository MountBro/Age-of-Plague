(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$document = _Browser_document;
var $author$project$Message$GotViewport = function (a) {
	return {$: 'GotViewport', a: a};
};
var $author$project$Model$HomePage = {$: 'HomePage'};
var $author$project$Model$NoCard = {$: 'NoCard'};
var $author$project$Model$NoRegion = {$: 'NoRegion'};
var $author$project$ColorScheme$Polar = {$: 'Polar'};
var $author$project$Model$SelHexOff = {$: 'SelHexOff'};
var $author$project$Card$Card = F6(
	function (selMode, cost, action, name, describe, fd) {
		return {action: action, cost: cost, describe: describe, fd: fd, name: name, selMode: selMode};
	});
var $author$project$Card$FreezeI = {$: 'FreezeI'};
var $author$project$Card$NoSel = {$: 'NoSel'};
var $author$project$Card$blizzard = A6(
	$author$project$Card$Card,
	$author$project$Card$NoSel,
	8,
	_List_fromArray(
		[$author$project$Card$FreezeI, $author$project$Card$FreezeI, $author$project$Card$FreezeI]),
	'Blizzard',
	'Freeze the viruses.',
	'Freeze the spread of virus for 3 rounds.');
var $author$project$Card$AttractPeoI = function (a) {
	return {$: 'AttractPeoI', a: a};
};
var $author$project$Card$StopAttractI = function (a) {
	return {$: 'StopAttractI', a: a};
};
var $author$project$Card$TileSel = {$: 'TileSel'};
var $author$project$Card$cellBroadcast = A6(
	$author$project$Card$Card,
	$author$project$Card$TileSel,
	4,
	_List_fromArray(
		[
			$author$project$Card$AttractPeoI(
			_Utils_Tuple2(0, 0)),
			$author$project$Card$StopAttractI(
			_Utils_Tuple2(0, 0))
		]),
	'Cell Broadcast',
	'Ban local population flow.',
	'For a tile, attract 1 population from each \n neighboring tile.');
var $author$project$Card$Freeze = function (a) {
	return {$: 'Freeze', a: a};
};
var $author$project$Card$coldWave = A6(
	$author$project$Card$Card,
	$author$project$Card$NoSel,
	1,
	_List_fromArray(
		[
			$author$project$Card$Freeze(0.5)
		]),
	'Cold Wave',
	'50% of virus freezing chance.',
	'There\'s a probability of 50% to freeze the spread \nof virus for 1 round.');
var $author$project$Card$Summon = function (a) {
	return {$: 'Summon', a: a};
};
var $author$project$Card$CutTileI = function (a) {
	return {$: 'CutTileI', a: a};
};
var $author$project$Card$megaCut = A6(
	$author$project$Card$Card,
	$author$project$Card$TileSel,
	5,
	_List_fromArray(
		[
			$author$project$Card$CutTileI(
			_Utils_Tuple2(0, 0))
		]),
	'Mega Cut',
	'Eliminated virus on the chosen tile.',
	'Eliminates virus on one tile.');
var $author$project$Card$compulsoryMR = A6(
	$author$project$Card$Card,
	$author$project$Card$NoSel,
	6,
	_List_fromArray(
		[
			$author$project$Card$Summon(
			_List_fromArray(
				[$author$project$Card$megaCut, $author$project$Card$megaCut]))
		]),
	'Compulsory Medical Recruitment',
	'Summoned two [MegaCut].',
	'Immediately summons [MegaCut] x2');
var $author$project$Card$CutHexI = function (a) {
	return {$: 'CutHexI', a: a};
};
var $author$project$Card$HexSel = {$: 'HexSel'};
var $author$project$Card$cut = A6(
	$author$project$Card$Card,
	$author$project$Card$HexSel,
	1,
	_List_fromArray(
		[
			$author$project$Card$CutHexI(
			_Utils_Tuple2(0, 0))
		]),
	'Cut',
	'Eliminated virus on the chosen hex.',
	'Eliminates virus on one hex.');
var $author$project$Card$FreezevirusI = function (a) {
	return {$: 'FreezevirusI', a: a};
};
var $author$project$Card$defenseline = A6(
	$author$project$Card$Card,
	$author$project$Card$TileSel,
	2,
	_List_fromArray(
		[
			$author$project$Card$FreezevirusI(
			_Utils_Tuple2(0, 0)),
			$author$project$Card$FreezevirusI(
			_Utils_Tuple2(0, 0))
		]),
	'Defensive Line',
	'Froze virus.',
	'Freezes the spread of viruses for 2 rounds in a tile');
var $author$project$Card$DroughtI_Kill = function (a) {
	return {$: 'DroughtI_Kill', a: a};
};
var $author$project$Card$drought = A6(
	$author$project$Card$Card,
	$author$project$Card$TileSel,
	2,
	_List_fromArray(
		[
			$author$project$Card$DroughtI_Kill(
			_Utils_Tuple2(
				_Utils_Tuple2(0, 0),
				0.5)),
			$author$project$Card$DroughtI_Kill(
			_Utils_Tuple2(
				_Utils_Tuple2(0, 0),
				0.5))
		]),
	'Drought',
	'‧ 50% to kill local virus; \n‧ Power output halves.',
	'Choose a tile, in two rounds, the viruses have\n a probability of 50% to die. \nThe power output halves for two rounds.');
var $author$project$Card$EnhancedHealingI = {$: 'EnhancedHealingI'};
var $author$project$Card$enhancedHealing = A6(
	$author$project$Card$Card,
	$author$project$Card$NoSel,
	4,
	_List_fromArray(
		[$author$project$Card$EnhancedHealingI]),
	'Enhanced Healing',
	'All hospital healing +1.',
	'Slightly raises the efficiency of hospital healing.');
var $author$project$Card$HospitalI = function (a) {
	return {$: 'HospitalI', a: a};
};
var $author$project$Card$hospital = A6(
	$author$project$Card$Card,
	$author$project$Card$TileSel,
	4,
	_List_fromArray(
		[
			$author$project$Card$HospitalI(
			_Utils_Tuple2(0, 0))
		]),
	'Hospital',
	'Hospital built.',
	'Puts a hospital on a tile.');
var $author$project$Card$firstAid = A6(
	$author$project$Card$Card,
	$author$project$Card$NoSel,
	2,
	_List_fromArray(
		[
			$author$project$Card$Summon(
			_List_fromArray(
				[$author$project$Card$hospital]))
		]),
	'FirstAid',
	'Summoned one [Hospital].',
	'Immediately sommons one [Hospital]');
var $author$project$Card$Activate996I = {$: 'Activate996I'};
var $author$project$Card$fubao = A6(
	$author$project$Card$Card,
	$author$project$Card$NoSel,
	1,
	_List_fromArray(
		[$author$project$Card$Activate996I, $author$project$Card$Activate996I]),
	'996',
	'‧Power +1, death rate increases 5%.',
	'In the next 2 rounds, +1 power, \nbut the death rate permanently rises 5%.');
var $author$project$Card$AVI = function (a) {
	return {$: 'AVI', a: a};
};
var $author$project$Card$goingViral = A6(
	$author$project$Card$Card,
	$author$project$Card$TileSel,
	8,
	_List_fromArray(
		[
			$author$project$Card$AVI(
			_Utils_Tuple2(0, 0))
		]),
	'Going Viral',
	'Release the anti-virus.',
	'Select a tile. Release the nano-viruses, \nwhich move randomly for 3 rounds and \nhave a "cut" effect.');
var $author$project$Card$HumanCloneI = function (a) {
	return {$: 'HumanCloneI', a: a};
};
var $author$project$Card$humanClone = A6(
	$author$project$Card$Card,
	$author$project$Card$TileSel,
	3,
	_List_fromArray(
		[
			$author$project$Card$HumanCloneI(
			_Utils_Tuple2(0, 0))
		]),
	'Human Clone',
	'Double the local population.',
	'Doubles the population of a certain tile.');
var $author$project$Card$JudgeI_Kill = function (a) {
	return {$: 'JudgeI_Kill', a: a};
};
var $author$project$Card$judgement = A6(
	$author$project$Card$Card,
	$author$project$Card$TileSel,
	6,
	_List_fromArray(
		[
			$author$project$Card$JudgeI_Kill(
			_Utils_Tuple2(
				_Utils_Tuple2(0, 0),
				0.25))
		]),
	'Judgement',
	'Purify or destroy tile.',
	'Select a tile. For each hex on and around \nthe tile, either the people or the viruses die. \nThe probability is 50%.');
var $author$project$Card$EvacuateI = function (a) {
	return {$: 'EvacuateI', a: a};
};
var $author$project$Card$StopEVAI = function (a) {
	return {$: 'StopEVAI', a: a};
};
var $author$project$Card$lowSoundWave = A6(
	$author$project$Card$Card,
	$author$project$Card$TileSel,
	4,
	_List_fromArray(
		[
			$author$project$Card$EvacuateI(
			_Utils_Tuple2(0, 0)),
			$author$project$Card$StopEVAI(
			_Utils_Tuple2(0, 0))
		]),
	'Infrasound',
	'Evacuate the tile.',
	'Select a tile. Distribute all population to\n neighboring tiles.');
var $author$project$Card$medMob = A6(
	$author$project$Card$Card,
	$author$project$Card$NoSel,
	6,
	_List_fromArray(
		[
			$author$project$Card$Summon(
			_List_fromArray(
				[$author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut]))
		]),
	'Medical Mobilization',
	'Summoned three [Cut].',
	'Immediately summons [Cut] x3');
var $author$project$Card$MegaCloneI = {$: 'MegaCloneI'};
var $author$project$Card$megaClone = A6(
	$author$project$Card$Card,
	$author$project$Card$NoSel,
	8,
	_List_fromArray(
		[$author$project$Card$MegaCloneI]),
	'Mega Clone',
	'Healthy population x1.5.',
	'Healthy population x1.5.');
var $author$project$Card$IncPowerI = function (a) {
	return {$: 'IncPowerI', a: a};
};
var $author$project$Card$onStandby = A6(
	$author$project$Card$Card,
	$author$project$Card$NoSel,
	0,
	_List_fromArray(
		[
			$author$project$Card$IncPowerI(2)
		]),
	'On Standby',
	'+2 power',
	'Immediately + 2 power.');
var $author$project$Card$OrganCloneI = function (a) {
	return {$: 'OrganCloneI', a: a};
};
var $author$project$Card$organClone = A6(
	$author$project$Card$Card,
	$author$project$Card$TileSel,
	3,
	_List_fromArray(
		[
			$author$project$Card$OrganCloneI(
			_Utils_Tuple2(0, 0))
		]),
	'Organ Clone',
	'Each local saves one patient.',
	'Inside the chosen tile, each one of the dead could \nsave one infected.');
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Card$powerOverload = A6(
	$author$project$Card$Card,
	$author$project$Card$NoSel,
	0,
	_List_fromArray(
		[
			$author$project$Card$IncPowerI(3),
			$author$project$Card$IncPowerI(-3)
		]),
	'Power Overload',
	'+3 power, next round -3 power.',
	'+3 power, next round -3 power.');
var $author$project$Card$PurificationI = function (a) {
	return {$: 'PurificationI', a: a};
};
var $author$project$Card$purification = A6(
	$author$project$Card$Card,
	$author$project$Card$TileSel,
	3,
	_List_fromArray(
		[
			$author$project$Card$PurificationI(
			_Utils_Tuple2(0, 0))
		]),
	'Purification',
	'Healed all local patients.',
	'Heals all patients in a tile.');
var $author$project$Card$QuarantineI = function (a) {
	return {$: 'QuarantineI', a: a};
};
var $author$project$Card$quarantine = A6(
	$author$project$Card$Card,
	$author$project$Card$TileSel,
	4,
	_List_fromArray(
		[
			$author$project$Card$QuarantineI(
			_Utils_Tuple2(0, 0))
		]),
	'Quarantine',
	'Build a quarantine tile.',
	'Puts one tile in quarantine');
var $author$project$Card$PowDoubleI_Freeze = function (a) {
	return {$: 'PowDoubleI_Freeze', a: a};
};
var $author$project$Card$rain = A6(
	$author$project$Card$Card,
	$author$project$Card$NoSel,
	3,
	_List_fromArray(
		[
			$author$project$Card$PowDoubleI_Freeze(0.5),
			$author$project$Card$PowDoubleI_Freeze(0.5)
		]),
	'Rain',
	'‧ 50% of virus freezing chance;\n‧ The power output +1.',
	'In two rounds, there is a probability of 50% to \nfreeze the spread of viruses for 1 round. The power output +1 for two rounds.');
var $author$project$Card$ResurgenceI = function (a) {
	return {$: 'ResurgenceI', a: a};
};
var $author$project$Card$resurgence = A6(
	$author$project$Card$Card,
	$author$project$Card$TileSel,
	8,
	_List_fromArray(
		[
			$author$project$Card$ResurgenceI(
			_Utils_Tuple2(0, 0))
		]),
	'Resurgence',
	'Restore 20% of the dead.',
	'For each tile, restore 20% of the dead.');
var $author$project$Card$SacrificeI = function (a) {
	return {$: 'SacrificeI', a: a};
};
var $author$project$Card$sacrifice = A6(
	$author$project$Card$Card,
	$author$project$Card$TileSel,
	4,
	_List_fromArray(
		[
			$author$project$Card$SacrificeI(
			_Utils_Tuple2(0, 0))
		]),
	'Sacrifice',
	'Cleared local virus and patients.',
	'Kill both the viruses and infected people in a tile.');
var $author$project$Card$WarehouseI = function (a) {
	return {$: 'WarehouseI', a: a};
};
var $author$project$Card$warehouse = A6(
	$author$project$Card$Card,
	$author$project$Card$TileSel,
	4,
	_List_fromArray(
		[
			$author$project$Card$WarehouseI(
			_Utils_Tuple2(0, 0))
		]),
	'Warehouse',
	'+2 maximum power.',
	'+2 maximum power.');
var $author$project$Card$Warmwave_KIA = function (a) {
	return {$: 'Warmwave_KIA', a: a};
};
var $author$project$Card$warmwave = A6(
	$author$project$Card$Card,
	$author$project$Card$TileSel,
	1,
	_List_fromArray(
		[
			$author$project$Card$Warmwave_KIA(
			_Utils_Tuple2(
				_Utils_Tuple2(0, 0),
				0.25))
		]),
	'Warm Wave',
	'25% of chance to kill the local virus.',
	'Choose a tile. There is a probability of 25% \nto kill the viruses.');
var $author$project$Card$allCards = _List_fromArray(
	[$author$project$Card$powerOverload, $author$project$Card$onStandby, $author$project$Card$coldWave, $author$project$Card$blizzard, $author$project$Card$rain, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$megaCut, $author$project$Card$megaCut, $author$project$Card$megaCut, $author$project$Card$megaCut, $author$project$Card$megaCut, $author$project$Card$megaCut, $author$project$Card$fubao, $author$project$Card$organClone, $author$project$Card$humanClone, $author$project$Card$humanClone, $author$project$Card$megaClone, $author$project$Card$purification, $author$project$Card$sacrifice, $author$project$Card$resurgence, $author$project$Card$defenseline, $author$project$Card$hospital, $author$project$Card$hospital, $author$project$Card$hospital, $author$project$Card$hospital, $author$project$Card$hospital, $author$project$Card$quarantine, $author$project$Card$quarantine, $author$project$Card$quarantine, $author$project$Card$enhancedHealing, $author$project$Card$cellBroadcast, $author$project$Card$drought, $author$project$Card$warehouse, $author$project$Card$warehouse, $author$project$Card$warmwave, $author$project$Card$goingViral, $author$project$Card$judgement, $author$project$Card$lowSoundWave, $author$project$Card$compulsoryMR, $author$project$Card$firstAid, $author$project$Card$medMob]);
var $elm$browser$Browser$Dom$getViewport = _Browser_withWindow(_Browser_getViewport);
var $author$project$Virus$initAntiVirus = {
	life: 0,
	pos: _List_Nil,
	rules: _List_fromArray(
		[0, 1, 2, 3, 4, 5, 6])
};
var $author$project$Model$initBehavior = {populationFlow: true, virusEvolve: true};
var $author$project$Tile$City = function (tilesIndex) {
	return {tilesIndex: tilesIndex};
};
var $author$project$Tile$Tile = F9(
	function (indice, population, sick, dead, cureEff, peoFlow, hos, qua, wareHouse) {
		return {cureEff: cureEff, dead: dead, hos: hos, indice: indice, peoFlow: peoFlow, population: population, qua: qua, sick: sick, wareHouse: wareHouse};
	});
var $author$project$Tile$initTile = F2(
	function (_v0, population) {
		var x = _v0.a;
		var y = _v0.b;
		return A9(
			$author$project$Tile$Tile,
			_Utils_Tuple2(x, y),
			population,
			0,
			0,
			0,
			true,
			false,
			false,
			false);
	});
var $author$project$Tile$initTiles = F2(
	function (p, l) {
		return A2(
			$elm$core$List$map,
			function (x) {
				return A2($author$project$Tile$initTile, x, p);
			},
			l);
	});
var $author$project$Tile$initCity = F2(
	function (tilepeo, l) {
		var tiles = A2($author$project$Tile$initTiles, tilepeo, l);
		return $author$project$Tile$City(tiles);
	});
var $author$project$Virus$Virus = F5(
	function (rules, pos, number, infect, kill) {
		return {infect: infect, kill: kill, number: number, pos: pos, rules: rules};
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Geometry$getElement = F2(
	function (n, lst) {
		return A2(
			$elm$core$List$drop,
			n - 1,
			A2($elm$core$List$take, n, lst));
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Model$tutorialHands = _List_fromArray(
	[
		_List_fromArray(
		[$author$project$Card$megaClone]),
		_List_fromArray(
		[$author$project$Card$cut, $author$project$Card$megaCut])
	]);
var $author$project$Virus$virus1 = A5($author$project$Virus$Virus, _List_Nil, _List_Nil, 1, 1, 0);
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Geometry$generateZone = function (pos) {
	var j = pos.b;
	var i = pos.a;
	return _List_fromArray(
		[
			_Utils_Tuple2(i, j - 1),
			_Utils_Tuple2(i, j + 1),
			_Utils_Tuple2(i + 1, j),
			_Utils_Tuple2(i + 1, j - 1),
			_Utils_Tuple2(i - 1, j),
			_Utils_Tuple2(i - 1, j + 1)
		]);
};
var $author$project$Geometry$converTiletoHex = function (_v0) {
	var i = _v0.a;
	var j = _v0.b;
	return A2(
		$elm$core$List$cons,
		_Utils_Tuple2((2 * i) - j, i + (3 * j)),
		$author$project$Geometry$generateZone(
			_Utils_Tuple2((2 * i) - j, i + (3 * j))));
};
var $author$project$Virus$virus2 = A5(
	$author$project$Virus$Virus,
	_List_fromArray(
		[2, 3, 4]),
	_Utils_ap(
		_List_fromArray(
			[
				_Utils_Tuple2(0, 1),
				_Utils_Tuple2(0, 2),
				_Utils_Tuple2(0, 3),
				_Utils_Tuple2(0, -1),
				_Utils_Tuple2(0, 0),
				_Utils_Tuple2(1, -1),
				_Utils_Tuple2(1, 0)
			]),
		_Utils_ap(
			$author$project$Geometry$converTiletoHex(
				_Utils_Tuple2(1, 0)),
			$author$project$Geometry$converTiletoHex(
				_Utils_Tuple2(1, 1)))),
	2,
	1,
	0);
var $author$project$Geometry$cartesianProduct = F2(
	function (l1, l2) {
		return A3(
			$elm$core$List$foldr,
			function (li1) {
				return function (li2) {
					return _Utils_ap(li1, li2);
				};
			},
			_List_Nil,
			A2(
				$elm$core$List$map,
				function (x) {
					return A2(
						$elm$core$List$map,
						function (y) {
							return _Utils_Tuple2(x, y);
						},
						l2);
				},
				l1));
	});
var $author$project$Virus$virus3 = A5(
	$author$project$Virus$Virus,
	_List_fromArray(
		[2, 3]),
	_Utils_ap(
		A2(
			$author$project$Geometry$cartesianProduct,
			_List_fromArray(
				[1]),
			_List_fromArray(
				[1, 2, 3])),
		_Utils_ap(
			A2(
				$author$project$Geometry$cartesianProduct,
				_List_fromArray(
					[-1, 0]),
				_List_fromArray(
					[1])),
			_List_fromArray(
				[
					_Utils_Tuple2(0, 4),
					_Utils_Tuple2(-1, 5)
				]))),
	5,
	1,
	0.12);
var $author$project$Geometry$converTiletoHex_ = function (_v0) {
	var i = _v0.a;
	var j = _v0.b;
	return _Utils_Tuple2((2 * i) - j, i + (3 * j));
};
var $author$project$Virus$virus4 = A5(
	$author$project$Virus$Virus,
	_List_fromArray(
		[2, 4]),
	_Utils_ap(
		_List_fromArray(
			[
				_Utils_Tuple2(1, -4),
				_Utils_Tuple2(2, -4),
				_Utils_Tuple2(2, -3),
				_Utils_Tuple2(-2, -2),
				_Utils_Tuple2(-3, -1),
				_Utils_Tuple2(-3, 0),
				_Utils_Tuple2(3, 0),
				_Utils_Tuple2(3, 1)
			]),
		_Utils_ap(
			$author$project$Geometry$converTiletoHex(
				_Utils_Tuple2(1, -1)),
			_Utils_ap(
				$author$project$Geometry$converTiletoHex(
					_Utils_Tuple2(-1, -1)),
				_Utils_ap(
					$author$project$Geometry$converTiletoHex(
						_Utils_Tuple2(-1, 1)),
					$author$project$Geometry$generateZone(
						$author$project$Geometry$converTiletoHex_(
							_Utils_Tuple2(0, 3))))))),
	4,
	1,
	0.2);
var $author$project$Virus$virus5 = A5(
	$author$project$Virus$Virus,
	_List_fromArray(
		[2, 3, 6]),
	_Utils_ap(
		A2(
			$author$project$Geometry$cartesianProduct,
			_List_fromArray(
				[-1]),
			_List_fromArray(
				[0, 1, 2])),
		_Utils_ap(
			A2(
				$author$project$Geometry$cartesianProduct,
				_List_fromArray(
					[-2]),
				_List_fromArray(
					[3, 4, 5])),
			_Utils_ap(
				A2(
					$author$project$Geometry$cartesianProduct,
					_List_fromArray(
						[-3]),
					_List_fromArray(
						[6, 7])),
				_Utils_ap(
					A2(
						$author$project$Geometry$cartesianProduct,
						_List_fromArray(
							[-1, 0]),
						_List_fromArray(
							[8])),
					_Utils_ap(
						$author$project$Geometry$generateZone(
							$author$project$Geometry$converTiletoHex_(
								_Utils_Tuple2(0, 3))),
						$author$project$Geometry$generateZone(
							$author$project$Geometry$converTiletoHex_(
								_Utils_Tuple2(2, 2)))))))),
	3,
	1,
	0.48);
var $author$project$Virus$virus6 = A5(
	$author$project$Virus$Virus,
	_List_fromArray(
		[2, 5]),
	_Utils_ap(
		A2(
			$author$project$Geometry$cartesianProduct,
			_List_fromArray(
				[-2]),
			_List_fromArray(
				[3, 4, 5])),
		_Utils_ap(
			_List_fromArray(
				[
					_Utils_Tuple2(-3, 6)
				]),
			$author$project$Geometry$generateZone(
				$author$project$Geometry$converTiletoHex_(
					_Utils_Tuple2(-1, 1))))),
	6,
	1,
	0.05);
var $author$project$Virus$virus = _List_fromArray(
	[$author$project$Virus$virus1, $author$project$Virus$virus2, $author$project$Virus$virus3, $author$project$Virus$virus4, $author$project$Virus$virus5, $author$project$Virus$virus6]);
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Model$initHandsVirus = function (level) {
	var vir = A2(
		$elm$core$Maybe$withDefault,
		A5($author$project$Virus$Virus, _List_Nil, _List_Nil, 0, 0, 0),
		$elm$core$List$head(
			A2($author$project$Geometry$getElement, level, $author$project$Virus$virus)));
	var hand = (level <= 2) ? A3(
		$elm$core$List$foldr,
		function (x) {
			return function (y) {
				return _Utils_ap(x, y);
			};
		},
		_List_Nil,
		A2($author$project$Geometry$getElement, level, $author$project$Model$tutorialHands)) : _List_Nil;
	return _Utils_Tuple2(hand, vir);
};
var $author$project$Model$initModel = function (_v0) {
	return _Utils_Tuple2(
		{
			actionDescribe: _List_Nil,
			av: $author$project$Virus$initAntiVirus,
			behavior: $author$project$Model$initBehavior,
			cardSelected: $author$project$Model$NoCard,
			city: A2($author$project$Tile$initCity, 20, _List_Nil),
			counter: 3,
			currentLevel: 1,
			currentRound: 1,
			deck: $author$project$Card$allCards,
			drawChance: 0,
			flowRate: 1,
			freezeTile: _List_Nil,
			hands: $author$project$Model$initHandsVirus(1).a,
			maxPower: 10,
			mouseOver: _Utils_Tuple2(-233, -233),
			mouseOverCard: -1,
			mouseOverCardToReplace: -1,
			powRatio: 1.0,
			power: 50,
			region: $author$project$Model$NoRegion,
			replaceChance: 3,
			roundTodoCleared: false,
			screenSize: _Utils_Tuple2(600, 800),
			selHex: $author$project$Model$SelHexOff,
			selectedHex: _Utils_Tuple2(-233, -233),
			state: $author$project$Model$HomePage,
			theme: $author$project$ColorScheme$Polar,
			todo: _List_Nil,
			viewport: $elm$core$Maybe$Nothing,
			virus: $author$project$Model$initHandsVirus(1).b,
			virusInfo: false,
			warehouseNum: 0,
			waveNum: 0
		},
		A2($elm$core$Task$perform, $author$project$Message$GotViewport, $elm$browser$Browser$Dom$getViewport));
};
var $author$project$Message$AddKey = function (a) {
	return {$: 'AddKey', a: a};
};
var $author$project$Model$Playing = {$: 'Playing'};
var $author$project$Message$Resize = F2(
	function (a, b) {
		return {$: 'Resize', a: a, b: b};
	});
var $author$project$Message$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 'Every', a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {processes: processes, taggers: taggers};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 'Nothing') {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$Name = function (a) {
	return {$: 'Name', a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 'Offset', a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.processes;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(_Utils_Tuple0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.taggers);
		if (_v0.$ === 'Nothing') {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Message$Character = function (a) {
	return {$: 'Character', a: a};
};
var $author$project$Message$Control = function (a) {
	return {$: 'Control', a: a};
};
var $elm$core$Debug$log = _Debug_log;
var $author$project$Message$toKeyValue = function (string) {
	var _v0 = $elm$core$Debug$log(string);
	var _v1 = $elm$core$String$uncons(string);
	if ((_v1.$ === 'Just') && (_v1.a.b === '')) {
		var _v2 = _v1.a;
		var _char = _v2.a;
		return $author$project$Message$Character(_char);
	} else {
		return $author$project$Message$Control(string);
	}
};
var $author$project$Message$keyDecoder = A2(
	$elm$json$Json$Decode$map,
	$author$project$Message$toKeyValue,
	A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$browser$Browser$Events$Document = {$: 'Document'};
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {event: event, key: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.key;
		var event = _v0.event;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'keydown');
var $elm$browser$Browser$Events$Window = {$: 'Window'};
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		$elm$browser$Browser$Events$on,
		$elm$browser$Browser$Events$Window,
		'resize',
		A2(
			$elm$json$Json$Decode$field,
			'target',
			A3(
				$elm$json$Json$Decode$map2,
				func,
				A2($elm$json$Json$Decode$field, 'innerWidth', $elm$json$Json$Decode$int),
				A2($elm$json$Json$Decode$field, 'innerHeight', $elm$json$Json$Decode$int))));
};
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onKeyDown(
				A2($elm$json$Json$Decode$map, $author$project$Message$AddKey, $author$project$Message$keyDecoder)),
				_Utils_eq(model.state, $author$project$Model$Playing) ? $elm$core$Platform$Sub$batch(
				_List_fromArray(
					[
						A2($elm$time$Time$every, 50, $author$project$Message$Tick),
						$elm$browser$Browser$Events$onResize($author$project$Message$Resize)
					])) : $elm$core$Platform$Sub$none
			]));
};
var $author$project$Model$CardPage = {$: 'CardPage'};
var $author$project$Message$DrawCard = function (a) {
	return {$: 'DrawCard', a: a};
};
var $author$project$Model$Drawing = {$: 'Drawing'};
var $author$project$Model$Feedback = function (a) {
	return {$: 'Feedback', a: a};
};
var $author$project$Message$InitializeHands = function (a) {
	return {$: 'InitializeHands', a: a};
};
var $author$project$Model$SelHexOn = {$: 'SelHexOn'};
var $author$project$Model$SelectCard = function (a) {
	return {$: 'SelectCard', a: a};
};
var $author$project$Model$Warning = function (a) {
	return {$: 'Warning', a: a};
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm_community$list_extra$List$Extra$count = function (predicate) {
	return A2(
		$elm$core$List$foldl,
		F2(
			function (x, acc) {
				return predicate(x) ? (acc + 1) : acc;
			}),
		0);
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Tile$hosNum = function (tlst) {
	return $elm$core$List$length(
		A2(
			$elm$core$List$filter,
			function (x) {
				return x.hos;
			},
			tlst));
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Tile$quaNum = function (tlst) {
	return $elm$core$List$length(
		A2(
			$elm$core$List$filter,
			function (x) {
				return x.qua;
			},
			tlst));
};
var $author$project$Tile$wareNum = function (tlst) {
	return $elm$core$List$length(
		A2(
			$elm$core$List$filter,
			function (x) {
				return x.wareHouse;
			},
			tlst));
};
var $author$project$Model$adjustDeck = function (model) {
	var hands = model.hands;
	var deck0 = model.deck;
	var city = model.city;
	var deck1 = (_Utils_cmp(
		$author$project$Tile$hosNum(city.tilesIndex) + A2(
			$elm_community$list_extra$List$Extra$count,
			$elm$core$Basics$eq($author$project$Card$hospital),
			hands),
		$elm$core$List$length(city.tilesIndex)) < 0) ? deck0 : A2(
		$elm$core$List$filter,
		function (x) {
			return !_Utils_eq(x, $author$project$Card$hospital);
		},
		deck0);
	var deck2 = (_Utils_cmp(
		$author$project$Tile$quaNum(city.tilesIndex) + A2(
			$elm_community$list_extra$List$Extra$count,
			$elm$core$Basics$eq($author$project$Card$quarantine),
			hands),
		$elm$core$List$length(city.tilesIndex)) < 0) ? deck1 : A2(
		$elm$core$List$filter,
		function (x) {
			return !_Utils_eq(x, $author$project$Card$quarantine);
		},
		deck1);
	var deck = (_Utils_cmp(
		$author$project$Tile$wareNum(city.tilesIndex) + A2(
			$elm_community$list_extra$List$Extra$count,
			$elm$core$Basics$eq($author$project$Card$warehouse),
			hands),
		$elm$core$List$length(city.tilesIndex)) < 0) ? deck2 : A2(
		$elm$core$List$filter,
		function (x) {
			return !_Utils_eq(x, $author$project$Card$warehouse);
		},
		deck2);
	return deck;
};
var $elm$random$Random$Generator = function (a) {
	return {$: 'Generator', a: a};
};
var $elm$random$Random$constant = function (value) {
	return $elm$random$Random$Generator(
		function (seed) {
			return _Utils_Tuple2(value, seed);
		});
};
var $elm_community$random_extra$Random$List$get = F2(
	function (index, list) {
		return $elm$core$List$head(
			A2($elm$core$List$drop, index, list));
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 'Seed', a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
				var lo = _v0.a;
				var hi = _v0.b;
				var range = (hi - lo) + 1;
				if (!((range - 1) & range)) {
					return _Utils_Tuple2(
						(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
						$elm$random$Random$next(seed0));
				} else {
					var threshhold = (((-range) >>> 0) % range) >>> 0;
					var accountForBias = function (seed) {
						accountForBias:
						while (true) {
							var x = $elm$random$Random$peel(seed);
							var seedN = $elm$random$Random$next(seed);
							if (_Utils_cmp(x, threshhold) < 0) {
								var $temp$seed = seedN;
								seed = $temp$seed;
								continue accountForBias;
							} else {
								return _Utils_Tuple2((x % range) + lo, seedN);
							}
						}
					};
					return accountForBias(seed0);
				}
			});
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0.a;
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v1 = genA(seed0);
				var a = _v1.a;
				var seed1 = _v1.b;
				return _Utils_Tuple2(
					func(a),
					seed1);
			});
	});
var $elm_community$random_extra$Random$List$choose = function (list) {
	if ($elm$core$List$isEmpty(list)) {
		return $elm$random$Random$constant(
			_Utils_Tuple2($elm$core$Maybe$Nothing, list));
	} else {
		var lastIndex = $elm$core$List$length(list) - 1;
		var gen = A2($elm$random$Random$int, 0, lastIndex);
		var front = function (i) {
			return A2($elm$core$List$take, i, list);
		};
		var back = function (i) {
			return A2($elm$core$List$drop, i + 1, list);
		};
		return A2(
			$elm$random$Random$map,
			function (index) {
				return _Utils_Tuple2(
					A2($elm_community$random_extra$Random$List$get, index, list),
					A2(
						$elm$core$List$append,
						front(index),
						back(index)));
			},
			gen);
	}
};
var $author$project$Model$cardGenerator = function (model) {
	return A2(
		$elm$random$Random$map,
		function (_v0) {
			var x = _v0.a;
			var y = _v0.b;
			return A2($elm$core$Maybe$withDefault, $author$project$Card$cut, x);
		},
		$elm_community$random_extra$Random$List$choose(
			$author$project$Model$adjustDeck(model)));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Ports$cardToMusic = _Platform_outgoingPort('cardToMusic', $elm$json$Json$Encode$string);
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0.a;
		return $elm$random$Random$Generator(
			function (seed) {
				return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
			});
	});
var $author$project$Model$cardsGenerator = F2(
	function (model, n) {
		return A2(
			$elm$random$Random$list,
			n,
			A2(
				$elm$random$Random$map,
				function (_v0) {
					var x = _v0.a;
					var y = _v0.b;
					return A2($elm$core$Maybe$withDefault, $author$project$Card$cut, x);
				},
				$elm_community$random_extra$Random$List$choose(model.deck)));
	});
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$Basics$round = _Basics_round;
var $author$project$Geometry$isInt = function (x) {
	return $elm$core$Basics$abs(
		x - $elm$core$Basics$round(x)) < 0.00001;
};
var $author$project$Geometry$converHextoTile = function (_v0) {
	var i = _v0.a;
	var j = _v0.b;
	return function (_v4) {
		var x = _v4.a;
		var y = _v4.b;
		return _Utils_Tuple2(
			$elm$core$Basics$round(x),
			$elm$core$Basics$round(y));
	}(
		A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2(0, 0),
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (_v3) {
						var x = _v3.a;
						var y = _v3.b;
						return $author$project$Geometry$isInt(x) && $author$project$Geometry$isInt(y);
					},
					A2(
						$elm$core$List$map,
						function (_v2) {
							var x = _v2.a;
							var y = _v2.b;
							return _Utils_Tuple2(((3 * x) + y) / 7, ((2 * y) - x) / 7);
						},
						A2(
							$elm$core$List$map,
							function (_v1) {
								var x = _v1.a;
								var y = _v1.b;
								return _Utils_Tuple2(x, y);
							},
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(i, j),
								$author$project$Geometry$generateZone(
									_Utils_Tuple2(i, j)))))))));
};
var $author$project$Todo$finished = function (todo) {
	return $elm$core$List$isEmpty(
		A2(
			$elm$core$List$filter,
			function (_v0) {
				var _v1 = _v0.a;
				var x = _v1.a;
				var y = _v1.b;
				var z = _v0.b;
				return x;
			},
			todo));
};
var $elm$core$Basics$ge = _Utils_ge;
var $elm$random$Random$Generate = function (a) {
	return {$: 'Generate', a: a};
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0.a;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0.a;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0.a;
		return $elm$random$Random$Generate(
			A2($elm$random$Random$map, func, generator));
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			$elm$random$Random$Generate(
				A2($elm$random$Random$map, tagger, generator)));
	});
var $elm_community$list_extra$List$Extra$findIndexHelp = F3(
	function (index, predicate, list) {
		findIndexHelp:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = list.a;
				var xs = list.b;
				if (predicate(x)) {
					return $elm$core$Maybe$Just(index);
				} else {
					var $temp$index = index + 1,
						$temp$predicate = predicate,
						$temp$list = xs;
					index = $temp$index;
					predicate = $temp$predicate;
					list = $temp$list;
					continue findIndexHelp;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$findIndex = $elm_community$list_extra$List$Extra$findIndexHelp(0);
var $elm_community$list_extra$List$Extra$elemIndex = function (x) {
	return $elm_community$list_extra$List$Extra$findIndex(
		$elm$core$Basics$eq(x));
};
var $author$project$Card$summonNum = _Utils_Tuple2(
	_List_fromArray(
		[$author$project$Card$medMob, $author$project$Card$firstAid, $author$project$Card$compulsoryMR]),
	_List_fromArray(
		[3, 1, 2]));
var $author$project$Update$judgeSummon = F2(
	function (card, n) {
		var num_ = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm_community$list_extra$List$Extra$elemIndex, card, $author$project$Card$summonNum.a));
		var num = num_ + 1;
		var add = A3(
			$elm$core$List$foldr,
			$elm$core$Basics$add,
			0,
			A2($author$project$Geometry$getElement, num, $author$project$Card$summonNum.b));
		return add + n;
	});
var $author$project$ColorScheme$Minimum = {$: 'Minimum'};
var $author$project$Model$mapLevel = _List_fromArray(
	[
		A2(
		$author$project$Geometry$cartesianProduct,
		_List_fromArray(
			[0, 1]),
		_List_fromArray(
			[0, 1])),
		A2(
		$author$project$Geometry$cartesianProduct,
		_List_fromArray(
			[0, 1]),
		_List_fromArray(
			[0, 1])),
		_Utils_ap(
		A2(
			$author$project$Geometry$cartesianProduct,
			_List_fromArray(
				[2]),
			_List_fromArray(
				[-3, -2, -1, 0, 1, 2])),
		_Utils_ap(
			A2(
				$author$project$Geometry$cartesianProduct,
				_List_fromArray(
					[1]),
				_List_fromArray(
					[-2, -1, 0, 1, 2])),
			_Utils_ap(
				A2(
					$author$project$Geometry$cartesianProduct,
					_List_fromArray(
						[0]),
					_List_fromArray(
						[-1, 0, 2, 3])),
				_Utils_ap(
					A2(
						$author$project$Geometry$cartesianProduct,
						_List_fromArray(
							[3]),
						_List_fromArray(
							[0, 1])),
					_List_fromArray(
						[
							_Utils_Tuple2(4, 0)
						]))))),
		_Utils_ap(
		A2(
			$author$project$Geometry$cartesianProduct,
			_List_fromArray(
				[-1, 0, 1]),
			_List_fromArray(
				[-1, 0, 1])),
		_Utils_ap(
			A2(
				$author$project$Geometry$cartesianProduct,
				_List_fromArray(
					[0, 1, 2]),
				_List_fromArray(
					[2, 3])),
			_List_fromArray(
				[
					_Utils_Tuple2(2, 1)
				]))),
		_List_fromArray(
		[
			_Utils_Tuple2(0, 0),
			_Utils_Tuple2(0, 1),
			_Utils_Tuple2(0, 2),
			_Utils_Tuple2(0, 3),
			_Utils_Tuple2(1, -1),
			_Utils_Tuple2(1, 0),
			_Utils_Tuple2(1, 1),
			_Utils_Tuple2(1, 2),
			_Utils_Tuple2(2, -2),
			_Utils_Tuple2(2, -1),
			_Utils_Tuple2(2, 0),
			_Utils_Tuple2(2, 1),
			_Utils_Tuple2(2, 2),
			_Utils_Tuple2(3, -1),
			_Utils_Tuple2(3, -2)
		])
	]);
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm_community$list_extra$List$Extra$uniqueHelp = F4(
	function (f, existing, remaining, accumulator) {
		uniqueHelp:
		while (true) {
			if (!remaining.b) {
				return $elm$core$List$reverse(accumulator);
			} else {
				var first = remaining.a;
				var rest = remaining.b;
				var computedFirst = f(first);
				if (A2($elm$core$Set$member, computedFirst, existing)) {
					var $temp$f = f,
						$temp$existing = existing,
						$temp$remaining = rest,
						$temp$accumulator = accumulator;
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				} else {
					var $temp$f = f,
						$temp$existing = A2($elm$core$Set$insert, computedFirst, existing),
						$temp$remaining = rest,
						$temp$accumulator = A2($elm$core$List$cons, first, accumulator);
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$unique = function (list) {
	return A4($elm_community$list_extra$List$Extra$uniqueHelp, $elm$core$Basics$identity, $elm$core$Set$empty, list, _List_Nil);
};
var $author$project$Model$map = function () {
	var map_ = $elm_community$list_extra$List$Extra$unique(
		A3(
			$elm$core$List$foldr,
			$elm$core$Basics$append,
			_List_Nil,
			A2($elm$core$List$drop, 2, $author$project$Model$mapLevel)));
	return _Utils_ap(
		$author$project$Model$mapLevel,
		_List_fromArray(
			[map_]));
}();
var $author$project$Model$initlevelmap = function (level) {
	var citytile = A2(
		$elm$core$Maybe$withDefault,
		_List_Nil,
		$elm$core$List$head(
			A2($author$project$Geometry$getElement, level, $author$project$Model$map)));
	return A2($author$project$Tile$initCity, 20, citytile);
};
var $author$project$Card$cardPile3 = _List_fromArray(
	[$author$project$Card$defenseline, $author$project$Card$defenseline, $author$project$Card$sacrifice, $author$project$Card$sacrifice, $author$project$Card$goingViral, $author$project$Card$goingViral, $author$project$Card$goingViral, $author$project$Card$judgement, $author$project$Card$judgement, $author$project$Card$powerOverload, $author$project$Card$onStandby, $author$project$Card$coldWave, $author$project$Card$rain, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$megaCut, $author$project$Card$megaCut, $author$project$Card$megaCut, $author$project$Card$megaCut, $author$project$Card$megaCut, $author$project$Card$hospital, $author$project$Card$hospital, $author$project$Card$hospital, $author$project$Card$hospital, $author$project$Card$hospital, $author$project$Card$hospital, $author$project$Card$hospital, $author$project$Card$quarantine, $author$project$Card$enhancedHealing, $author$project$Card$enhancedHealing, $author$project$Card$enhancedHealing, $author$project$Card$cellBroadcast, $author$project$Card$warehouse, $author$project$Card$warmwave, $author$project$Card$lowSoundWave, $author$project$Card$compulsoryMR, $author$project$Card$firstAid, $author$project$Card$firstAid, $author$project$Card$medMob, $author$project$Card$medMob, $author$project$Card$medMob]);
var $author$project$Card$cardPile4 = _List_fromArray(
	[$author$project$Card$megaClone, $author$project$Card$megaClone, $author$project$Card$organClone, $author$project$Card$organClone, $author$project$Card$organClone, $author$project$Card$resurgence, $author$project$Card$resurgence, $author$project$Card$purification, $author$project$Card$purification, $author$project$Card$purification, $author$project$Card$purification, $author$project$Card$powerOverload, $author$project$Card$onStandby, $author$project$Card$coldWave, $author$project$Card$rain, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$megaCut, $author$project$Card$megaCut, $author$project$Card$megaCut, $author$project$Card$megaCut, $author$project$Card$megaCut, $author$project$Card$fubao, $author$project$Card$humanClone, $author$project$Card$humanClone, $author$project$Card$humanClone, $author$project$Card$hospital, $author$project$Card$hospital, $author$project$Card$hospital, $author$project$Card$quarantine, $author$project$Card$quarantine, $author$project$Card$quarantine, $author$project$Card$enhancedHealing, $author$project$Card$cellBroadcast, $author$project$Card$warehouse, $author$project$Card$warehouse, $author$project$Card$warmwave, $author$project$Card$lowSoundWave, $author$project$Card$compulsoryMR, $author$project$Card$firstAid, $author$project$Card$medMob, $author$project$Card$medMob]);
var $author$project$Card$cardPile5 = _List_fromArray(
	[$author$project$Card$blizzard, $author$project$Card$blizzard, $author$project$Card$blizzard, $author$project$Card$drought, $author$project$Card$drought, $author$project$Card$drought, $author$project$Card$powerOverload, $author$project$Card$powerOverload, $author$project$Card$onStandby, $author$project$Card$coldWave, $author$project$Card$coldWave, $author$project$Card$rain, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$megaCut, $author$project$Card$megaCut, $author$project$Card$megaCut, $author$project$Card$megaCut, $author$project$Card$megaCut, $author$project$Card$fubao, $author$project$Card$hospital, $author$project$Card$hospital, $author$project$Card$hospital, $author$project$Card$hospital, $author$project$Card$hospital, $author$project$Card$quarantine, $author$project$Card$quarantine, $author$project$Card$quarantine, $author$project$Card$enhancedHealing, $author$project$Card$cellBroadcast, $author$project$Card$warehouse, $author$project$Card$warehouse, $author$project$Card$warmwave, $author$project$Card$warmwave, $author$project$Card$lowSoundWave, $author$project$Card$compulsoryMR, $author$project$Card$firstAid, $author$project$Card$medMob, $author$project$Card$medMob]);
var $author$project$Card$cardPilestutorial = _List_fromArray(
	[$author$project$Card$blizzard]);
var $author$project$Card$cardPiles = _List_fromArray(
	[$author$project$Card$cardPilestutorial, $author$project$Card$allCards, $author$project$Card$cardPile3, $author$project$Card$cardPile4, $author$project$Card$cardPile5, $author$project$Card$allCards]);
var $author$project$Model$updateDeck = function (n) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Basics$append,
		_List_Nil,
		A2($author$project$Geometry$getElement, n, $author$project$Card$cardPiles));
};
var $author$project$InitLevel$levelInit = F2(
	function (n, model) {
		return (n < 3) ? _Utils_update(
			model,
			{
				actionDescribe: _List_Nil,
				av: $author$project$Virus$initAntiVirus,
				behavior: $author$project$Model$initBehavior,
				city: $author$project$Model$initlevelmap(n),
				counter: 3,
				currentLevel: n,
				currentRound: 1,
				deck: $author$project$Model$updateDeck(n),
				flowRate: 1,
				freezeTile: _List_Nil,
				hands: $author$project$Model$initHandsVirus(n).a,
				power: 30,
				selHex: $author$project$Model$SelHexOff,
				state: $author$project$Model$Playing,
				theme: $author$project$ColorScheme$Minimum,
				todo: _List_Nil,
				virus: $author$project$Model$initHandsVirus(n).b
			}) : _Utils_update(
			model,
			{
				actionDescribe: _List_Nil,
				av: $author$project$Virus$initAntiVirus,
				behavior: $author$project$Model$initBehavior,
				city: $author$project$Model$initlevelmap(n),
				counter: 3,
				currentLevel: n,
				currentRound: 1,
				deck: $author$project$Model$updateDeck(n),
				flowRate: 1,
				freezeTile: _List_Nil,
				hands: _List_Nil,
				power: 6,
				replaceChance: 3,
				selHex: $author$project$Model$SelHexOff,
				state: $author$project$Model$Drawing,
				todo: _List_Nil,
				virus: $author$project$Model$initHandsVirus(n).b,
				waveNum: 0
			});
	});
var $author$project$ColorScheme$Plain = {$: 'Plain'};
var $author$project$ColorScheme$Urban = {$: 'Urban'};
var $author$project$Update$loadTheme = F2(
	function (n, model) {
		switch (n) {
			case 3:
				return _Utils_update(
					model,
					{theme: $author$project$ColorScheme$Plain});
			case 4:
				return _Utils_update(
					model,
					{theme: $author$project$ColorScheme$Urban});
			case 5:
				return _Utils_update(
					model,
					{theme: $author$project$ColorScheme$Polar});
			default:
				return _Utils_update(
					model,
					{theme: $author$project$ColorScheme$Minimum});
		}
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $author$project$Card$NoAction = {$: 'NoAction'};
var $author$project$Todo$finishedEmptyQueue = _Utils_Tuple2(
	_Utils_Tuple2(false, _List_Nil),
	A6(
		$author$project$Card$Card,
		$author$project$Card$NoSel,
		0,
		_List_fromArray(
			[$author$project$Card$NoAction]),
		' ',
		' ',
		' '));
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$RegionFill$fillRegion = F2(
	function (card, sel) {
		return _Utils_eq(card, $author$project$Card$cut) ? _Utils_Tuple2(
			_Utils_Tuple2(
				_Utils_Tuple2(
					true,
					_List_fromArray(
						[
							$author$project$Card$CutHexI(sel)
						])),
				card),
			$elm$core$Platform$Cmd$none) : (_Utils_eq(card, $author$project$Card$megaCut) ? _Utils_Tuple2(
			_Utils_Tuple2(
				_Utils_Tuple2(
					true,
					_List_fromArray(
						[
							$author$project$Card$CutTileI(sel)
						])),
				card),
			$elm$core$Platform$Cmd$none) : (_Utils_eq(card, $author$project$Card$organClone) ? _Utils_Tuple2(
			_Utils_Tuple2(
				_Utils_Tuple2(
					true,
					_List_fromArray(
						[
							$author$project$Card$OrganCloneI(sel)
						])),
				card),
			$elm$core$Platform$Cmd$none) : (_Utils_eq(card, $author$project$Card$humanClone) ? _Utils_Tuple2(
			_Utils_Tuple2(
				_Utils_Tuple2(
					true,
					_List_fromArray(
						[
							$author$project$Card$HumanCloneI(sel)
						])),
				card),
			$elm$core$Platform$Cmd$none) : (_Utils_eq(card, $author$project$Card$purification) ? _Utils_Tuple2(
			_Utils_Tuple2(
				_Utils_Tuple2(
					true,
					_List_fromArray(
						[
							$author$project$Card$PurificationI(sel)
						])),
				card),
			$elm$core$Platform$Cmd$none) : (_Utils_eq(card, $author$project$Card$resurgence) ? _Utils_Tuple2(
			_Utils_Tuple2(
				_Utils_Tuple2(
					true,
					_List_fromArray(
						[
							$author$project$Card$ResurgenceI(sel)
						])),
				card),
			$elm$core$Platform$Cmd$none) : (_Utils_eq(card, $author$project$Card$sacrifice) ? _Utils_Tuple2(
			_Utils_Tuple2(
				_Utils_Tuple2(
					true,
					_List_fromArray(
						[
							$author$project$Card$SacrificeI(sel)
						])),
				card),
			$elm$core$Platform$Cmd$none) : (_Utils_eq(card, $author$project$Card$defenseline) ? _Utils_Tuple2(
			_Utils_Tuple2(
				_Utils_Tuple2(
					true,
					_List_fromArray(
						[
							$author$project$Card$FreezevirusI(sel),
							$author$project$Card$FreezevirusI(sel)
						])),
				card),
			$elm$core$Platform$Cmd$none) : (_Utils_eq(card, $author$project$Card$hospital) ? _Utils_Tuple2(
			_Utils_Tuple2(
				_Utils_Tuple2(
					true,
					_List_fromArray(
						[
							$author$project$Card$HospitalI(sel)
						])),
				card),
			$elm$core$Platform$Cmd$none) : (_Utils_eq(card, $author$project$Card$quarantine) ? _Utils_Tuple2(
			_Utils_Tuple2(
				_Utils_Tuple2(
					true,
					_List_fromArray(
						[
							$author$project$Card$QuarantineI(sel)
						])),
				card),
			$elm$core$Platform$Cmd$none) : (_Utils_eq(card, $author$project$Card$cellBroadcast) ? _Utils_Tuple2(
			_Utils_Tuple2(
				_Utils_Tuple2(
					true,
					_List_fromArray(
						[
							$author$project$Card$AttractPeoI(sel),
							$author$project$Card$StopAttractI(sel)
						])),
				card),
			$elm$core$Platform$Cmd$none) : (_Utils_eq(card, $author$project$Card$drought) ? _Utils_Tuple2(
			_Utils_Tuple2(
				_Utils_Tuple2(
					true,
					_List_fromArray(
						[
							$author$project$Card$DroughtI_Kill(
							_Utils_Tuple2(sel, 0.5)),
							$author$project$Card$DroughtI_Kill(
							_Utils_Tuple2(sel, 0.5))
						])),
				card),
			$elm$core$Platform$Cmd$none) : (_Utils_eq(card, $author$project$Card$warehouse) ? _Utils_Tuple2(
			_Utils_Tuple2(
				_Utils_Tuple2(
					true,
					_List_fromArray(
						[
							$author$project$Card$WarehouseI(sel)
						])),
				card),
			$elm$core$Platform$Cmd$none) : (_Utils_eq(card, $author$project$Card$warmwave) ? _Utils_Tuple2(
			_Utils_Tuple2(
				_Utils_Tuple2(
					true,
					_List_fromArray(
						[
							$author$project$Card$Warmwave_KIA(
							_Utils_Tuple2(sel, 0.25))
						])),
				card),
			$elm$core$Platform$Cmd$none) : (_Utils_eq(card, $author$project$Card$goingViral) ? _Utils_Tuple2(
			_Utils_Tuple2(
				_Utils_Tuple2(
					true,
					_List_fromArray(
						[
							$author$project$Card$AVI(sel)
						])),
				card),
			$elm$core$Platform$Cmd$none) : (_Utils_eq(card, $author$project$Card$judgement) ? _Utils_Tuple2(
			_Utils_Tuple2(
				_Utils_Tuple2(
					true,
					_List_fromArray(
						[
							$author$project$Card$JudgeI_Kill(
							_Utils_Tuple2(sel, 0.5))
						])),
				card),
			$elm$core$Platform$Cmd$none) : (_Utils_eq(card, $author$project$Card$lowSoundWave) ? _Utils_Tuple2(
			_Utils_Tuple2(
				_Utils_Tuple2(
					true,
					_List_fromArray(
						[
							$author$project$Card$EvacuateI(sel),
							$author$project$Card$StopEVAI(sel)
						])),
				card),
			$elm$core$Platform$Cmd$none) : _Utils_Tuple2($author$project$Todo$finishedEmptyQueue, $elm$core$Platform$Cmd$none)))))))))))))))));
	});
var $author$project$RegionFill$mFillRegion = function (_v0) {
	var model = _v0.a;
	var cm = _v0.b;
	var _v1 = model.cardSelected;
	if (_v1.$ === 'NoCard') {
		return _Utils_Tuple2(model, cm);
	} else {
		var card = _v1.a;
		var _v2 = model.selHex;
		if (_v2.$ === 'SelHexOn') {
			return (!_Utils_eq(
				model.selectedHex,
				_Utils_Tuple2(-233, -233))) ? _Utils_Tuple2(
				_Utils_update(
					model,
					{
						selHex: $author$project$Model$SelHexOff,
						selectedHex: _Utils_Tuple2(-233, -233),
						todo: _Utils_ap(
							model.todo,
							_List_fromArray(
								[
									A2($author$project$RegionFill$fillRegion, card, model.selectedHex).a
								]))
					}),
				$elm$core$Platform$Cmd$batch(
					_List_fromArray(
						[
							cm,
							A2($author$project$RegionFill$fillRegion, card, model.selectedHex).b
						]))) : _Utils_Tuple2(model, cm);
		} else {
			return _Utils_Tuple2(model, cm);
		}
	}
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$Basics$not = _Basics_not;
var $author$project$Parameters$para = {
	a: 15,
	af: 12.0,
	basicPowerInc: 4,
	cdfs: 12,
	cdlp: 16.0,
	cdm: 10.0,
	cdw: 300.0,
	clh: 20.0,
	clp: 15.0,
	conbot: 200.0,
	consoleWidth: 205.0,
	consolefs: 11,
	consolelm: 18.0,
	consolelp: 16.0,
	dcsc: '#5bcab4',
	dhw: 300.0,
	dhx: 320.0,
	dhy: 200.0,
	drawButtonW: 50.0,
	drawButtonX: 20.0,
	drawButtonY: 450.0,
	drawCardCost: 2,
	fgW: 50.0,
	fgX: 500.0,
	fgY: 280.0,
	gbc: '#a5bcc0',
	gbsc: '#6f787e',
	h: 600,
	hcdi: 50.0,
	hcg: 10.0,
	hclm: 100.0,
	hctm: 20.0,
	hcw: 60.0,
	hlp: 25.0,
	houseButtonCW: 50.0,
	houseButtonCX: 380.0,
	houseButtonCY: 280.0,
	houseButtonW: 50.0,
	houseButtonX: 930.0,
	houseButtonY: 500.0,
	icg: 20.0,
	icgsa: 50.0,
	icgssw: 3.0,
	icgsx: 870.0,
	icgsy: 500.0,
	iclm: 60.0,
	ictm: 34.0,
	icw: 120.0,
	infh: 415.0,
	inflm: 10.0,
	inftm: 20.0,
	infw: 330.0,
	infx: 650.0,
	infy: 0.0,
	l2shift: _Utils_Tuple2(0.0, 50.0),
	l3shift: _Utils_Tuple2(0.0, 20.0),
	l4shift: _Utils_Tuple2(0.0, -50.0),
	l5shift: _Utils_Tuple2(-10.0, 20.0),
	l6shift: _Utils_Tuple2(-26.0, 35.0),
	mr: 10,
	mtc: '#5b9fa6',
	nextButtonW: 50.0,
	nextButtonX: 20.0,
	nextButtonY: 510.0,
	nrbc: '#6796de',
	pifs: 100,
	pix: 20.0,
	piy: 100.0,
	repr: 40.0,
	repx: 50.0,
	repy: 500.0,
	tileOrigin: _Utils_Tuple2(440.0, 360.0),
	tor: 16,
	w: 1000,
	warehouseOutput: 2,
	warehousePowerInc: 2,
	wlp: 200.0,
	xlp: 710.0,
	ylp: 520.0
};
var $elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _v0) {
				var trues = _v0.a;
				var falses = _v0.b;
				return pred(x) ? _Utils_Tuple2(
					A2($elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2($elm$core$List$cons, x, falses));
			});
		return A3(
			$elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var $author$project$Model$CardPlayed_ = F2(
	function (a, b) {
		return {$: 'CardPlayed_', a: a, b: b};
	});
var $author$project$Message$FreezeRet = F2(
	function (a, b) {
		return {$: 'FreezeRet', a: a, b: b};
	});
var $author$project$Message$JudgeVirPeo = F2(
	function (a, b) {
		return {$: 'JudgeVirPeo', a: a, b: b};
	});
var $author$project$Message$KillTileVir = F2(
	function (a, b) {
		return {$: 'KillTileVir', a: a, b: b};
	});
var $author$project$Virus$createAV = function (hlst) {
	return {
		life: 2,
		pos: _List_fromArray(
			[hlst]),
		rules: _List_fromArray(
			[0, 1, 2, 3, 4])
	};
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Tile$validNeighborTile = F2(
	function (tlst, t) {
		var lstn = $author$project$Geometry$generateZone(t.indice);
		return ((!t.qua) && t.peoFlow) ? A2(
			$elm$core$List$filter,
			function (x) {
				return A2($elm$core$List$member, x.indice, lstn) && ((x.population > 0) && ((!x.qua) && t.peoFlow));
			},
			tlst) : _List_Nil;
	});
var $author$project$Population$evacuate = F2(
	function (t, city) {
		var lstnTile = A2(
			$elm$core$List$sortBy,
			function ($) {
				return $.sick;
			},
			A2($author$project$Tile$validNeighborTile, city.tilesIndex, t));
		var leavelst = A2($elm$core$List$take, t.population, lstnTile);
		var l = $elm$core$List$length(lstnTile);
		var sa = (!t.sick) ? 0 : A2($elm$core$Basics$modBy, l, t.sick);
		var sicklst1 = A2($elm$core$List$drop, sa, leavelst);
		var sb = (!t.sick) ? 0 : $elm$core$Basics$round((t.sick - sa) / l);
		var a = (!t.population) ? 0 : A2($elm$core$Basics$modBy, l, t.population);
		var b = (!t.population) ? 0 : $elm$core$Basics$round((t.population - a) / l);
		var l1 = A2($elm$core$List$drop, a, leavelst);
		var ln = A2($elm$core$List$take, a, leavelst);
		return A2(
			$elm$core$List$map,
			function (x) {
				return A2($elm$core$List$member, x, ln) ? (A2($elm$core$List$member, x, sicklst1) ? _Utils_update(
					x,
					{population: (x.population + b) + 1, sick: x.sick + sb}) : _Utils_update(
					x,
					{population: (x.population + b) + 1, sick: (x.sick + sb) + 1})) : (A2($elm$core$List$member, x, l1) ? (A2($elm$core$List$member, x, sicklst1) ? _Utils_update(
					x,
					{population: x.population + b, sick: x.sick + sb}) : _Utils_update(
					x,
					{population: x.population + b, sick: (x.sick + sb) + 1})) : (_Utils_eq(x, t) ? _Utils_update(
					x,
					{population: 0, sick: 0}) : x));
			},
			city.tilesIndex);
	});
var $elm$random$Random$float = F2(
	function (a, b) {
		return $elm$random$Random$Generator(
			function (seed0) {
				var seed1 = $elm$random$Random$next(seed0);
				var range = $elm$core$Basics$abs(b - a);
				var n1 = $elm$random$Random$peel(seed1);
				var n0 = $elm$random$Random$peel(seed0);
				var lo = (134217727 & n1) * 1.0;
				var hi = (67108863 & n0) * 1.0;
				var val = ((hi * 134217728.0) + lo) / 9007199254740992.0;
				var scaled = (val * range) + a;
				return _Utils_Tuple2(
					scaled,
					$elm$random$Random$next(seed1));
			});
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Model$CardPlayed = function (a) {
	return {$: 'CardPlayed', a: a};
};
var $author$project$Action$updateLog = F2(
	function (card, model) {
		var log = _List_fromArray(
			[
				$author$project$Model$CardPlayed(card)
			]);
		return _Utils_update(
			model,
			{
				actionDescribe: _Utils_ap(model.actionDescribe, log)
			});
	});
var $author$project$Action$performAction = F3(
	function (card, action, model) {
		switch (action.$) {
			case 'IncPowerI':
				var inc = action.a;
				if (_Utils_eq(card, $author$project$Card$powerOverload)) {
					if (inc > 0) {
						var str = 'Power increased by ' + ($elm$core$String$fromInt(inc) + '.');
						var ml = A2($author$project$Model$CardPlayed_, card, str);
						return _Utils_Tuple2(
							A2(
								$author$project$Action$updateLog,
								card,
								_Utils_update(
									model,
									{
										actionDescribe: _Utils_ap(
											model.actionDescribe,
											_List_fromArray(
												[ml]))
									})),
							$elm$core$Platform$Cmd$none);
					} else {
						if (inc < 0) {
							var str = 'Power decreased by ' + ($elm$core$String$fromInt(-inc) + '.');
							var ml = A2($author$project$Model$CardPlayed_, card, str);
							return _Utils_Tuple2(
								A2(
									$author$project$Action$updateLog,
									card,
									_Utils_update(
										model,
										{
											actionDescribe: _Utils_ap(
												model.actionDescribe,
												_List_fromArray(
													[ml]))
										})),
								$elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					}
				} else {
					return _Utils_Tuple2(
						A2(
							$author$project$Action$updateLog,
							card,
							_Utils_update(
								model,
								{power: model.power + inc})),
						$elm$core$Platform$Cmd$none);
				}
			case 'Freeze':
				var prob = action.a;
				return _Utils_Tuple2(
					A2($author$project$Action$updateLog, card, model),
					A2(
						$elm$random$Random$generate,
						$author$project$Message$FreezeRet(prob),
						A2($elm$random$Random$float, 0, 1)));
			case 'FreezeI':
				var behavior_ = model.behavior;
				var behavior = _Utils_update(
					behavior_,
					{virusEvolve: false});
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{behavior: behavior})),
					$elm$core$Platform$Cmd$none);
			case 'PowDoubleI_Freeze':
				var prob = action.a;
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{power: model.power + 1})),
					A2(
						$elm$random$Random$generate,
						$author$project$Message$FreezeRet(prob),
						A2($elm$random$Random$float, 0, 1)));
			case 'CutHexI':
				var _v1 = action.a;
				var i = _v1.a;
				var j = _v1.b;
				var virus_ = model.virus;
				var pos_ = virus_.pos;
				var pos = A2(
					$elm$core$List$filter,
					function (_v2) {
						var x = _v2.a;
						var y = _v2.b;
						return !_Utils_eq(
							_Utils_Tuple2(x, y),
							_Utils_Tuple2(i, j));
					},
					pos_);
				var virus = _Utils_update(
					virus_,
					{pos: pos});
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{virus: virus})),
					$elm$core$Platform$Cmd$none);
			case 'CutTileI':
				var _v3 = action.a;
				var i = _v3.a;
				var j = _v3.b;
				var virus_ = model.virus;
				var pos_ = virus_.pos;
				var _v4 = $author$project$Geometry$converHextoTile(
					_Utils_Tuple2(i, j));
				var t1 = _v4.a;
				var t2 = _v4.b;
				var lc = A2(
					$elm$core$Debug$log,
					'chosenTile',
					_Utils_Tuple2(t1, t2));
				var _v5 = _Utils_Tuple2((2 * t1) - t2, t1 + (3 * t2));
				var c1 = _v5.a;
				var c2 = _v5.b;
				var pos = A2(
					$elm$core$List$filter,
					function (_v6) {
						var x = _v6.a;
						var y = _v6.b;
						return !A2(
							$elm$core$List$member,
							_Utils_Tuple2(x, y),
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(c1, c2),
								$author$project$Geometry$generateZone(
									_Utils_Tuple2(c1, c2))));
					},
					pos_);
				var virus = _Utils_update(
					virus_,
					{pos: pos});
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{virus: virus})),
					$elm$core$Platform$Cmd$none);
			case 'Activate996I':
				var virus_ = model.virus;
				var dr = A2($elm$core$Basics$min, 1.024 * virus_.kill, 0.6);
				var virus = _Utils_update(
					virus_,
					{kill: dr});
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{power: model.power + 1, virus: virus})),
					$elm$core$Platform$Cmd$none);
			case 'OrganCloneI':
				var _v7 = action.a;
				var i = _v7.a;
				var j = _v7.b;
				var tilelst_ = model.city.tilesIndex;
				var pos = $author$project$Geometry$converHextoTile(
					_Utils_Tuple2(i, j));
				var tilelst = A2(
					$elm$core$List$map,
					function (x) {
						return _Utils_eq(x.indice, pos) ? (((x.sick - x.dead) > 0) ? _Utils_update(
							x,
							{sick: x.sick - x.dead}) : _Utils_update(
							x,
							{sick: 0})) : x;
					},
					tilelst_);
				var city_ = model.city;
				var city = _Utils_update(
					city_,
					{tilesIndex: tilelst});
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{city: city})),
					$elm$core$Platform$Cmd$none);
			case 'HumanCloneI':
				var _v8 = action.a;
				var i = _v8.a;
				var j = _v8.b;
				var tilelst_ = model.city.tilesIndex;
				var pos = $author$project$Geometry$converHextoTile(
					_Utils_Tuple2(i, j));
				var tilelst = A2(
					$elm$core$List$map,
					function (x) {
						return _Utils_eq(x.indice, pos) ? _Utils_update(
							x,
							{population: x.population * 2}) : x;
					},
					tilelst_);
				var city_ = model.city;
				var city = _Utils_update(
					city_,
					{tilesIndex: tilelst});
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{city: city})),
					$elm$core$Platform$Cmd$none);
			case 'MegaCloneI':
				var tilelst_ = model.city.tilesIndex;
				var tilelst = A2(
					$elm$core$List$map,
					function (x) {
						return _Utils_update(
							x,
							{
								population: x.sick + $elm$core$Basics$ceiling((x.population - x.sick) * 1.5)
							});
					},
					tilelst_);
				var city_ = model.city;
				var city = _Utils_update(
					city_,
					{tilesIndex: tilelst});
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{city: city})),
					$elm$core$Platform$Cmd$none);
			case 'PurificationI':
				var _v9 = action.a;
				var i = _v9.a;
				var j = _v9.b;
				var tilelst_ = model.city.tilesIndex;
				var pos = $author$project$Geometry$converHextoTile(
					_Utils_Tuple2(i, j));
				var tilelst = A2(
					$elm$core$List$map,
					function (x) {
						return _Utils_eq(x.indice, pos) ? _Utils_update(
							x,
							{sick: 0}) : x;
					},
					tilelst_);
				var city_ = model.city;
				var city = _Utils_update(
					city_,
					{tilesIndex: tilelst});
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{city: city})),
					$elm$core$Platform$Cmd$none);
			case 'SacrificeI':
				var _v10 = action.a;
				var i = _v10.a;
				var j = _v10.b;
				var virus_ = model.virus;
				var virpos_ = virus_.pos;
				var virpos = A2(
					$elm$core$List$filter,
					function (x) {
						return !_Utils_eq(
							$author$project$Geometry$converHextoTile(x),
							_Utils_Tuple2(i, j));
					},
					virpos_);
				var virus = _Utils_update(
					virus_,
					{pos: virpos});
				var tilepos = $author$project$Geometry$converHextoTile(
					_Utils_Tuple2(i, j));
				var tilelst_ = model.city.tilesIndex;
				var tilelst = A2(
					$elm$core$List$map,
					function (x) {
						return _Utils_eq(x.indice, tilepos) ? _Utils_update(
							x,
							{dead: x.dead + x.sick, population: x.population - x.sick, sick: 0}) : x;
					},
					tilelst_);
				var city_ = model.city;
				var city = _Utils_update(
					city_,
					{tilesIndex: tilelst});
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{city: city, virus: virus})),
					$elm$core$Platform$Cmd$none);
			case 'ResurgenceI':
				var _v11 = action.a;
				var i = _v11.a;
				var j = _v11.b;
				var tilelst_ = model.city.tilesIndex;
				var pos = $author$project$Geometry$converHextoTile(
					_Utils_Tuple2(i, j));
				var tilelst = A2(
					$elm$core$List$map,
					function (x) {
						return _Utils_eq(x.indice, pos) ? _Utils_update(
							x,
							{
								dead: x.dead - $elm$core$Basics$round(x.dead / 2),
								population: x.population + $elm$core$Basics$round(x.dead / 2)
							}) : x;
					},
					tilelst_);
				var city_ = model.city;
				var city = _Utils_update(
					city_,
					{tilesIndex: tilelst});
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{city: city})),
					$elm$core$Platform$Cmd$none);
			case 'FreezevirusI':
				var _v12 = action.a;
				var i = _v12.a;
				var j = _v12.b;
				var pos = $author$project$Geometry$converHextoTile(
					_Utils_Tuple2(i, j));
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{
								freezeTile: A2($elm$core$List$cons, pos, model.freezeTile)
							})),
					$elm$core$Platform$Cmd$none);
			case 'HospitalI':
				var _v13 = action.a;
				var i = _v13.a;
				var j = _v13.b;
				var city_ = model.city;
				var _v14 = $author$project$Geometry$converHextoTile(
					_Utils_Tuple2(i, j));
				var ti = _v14.a;
				var tj = _v14.b;
				var city = _Utils_update(
					city_,
					{
						tilesIndex: A2(
							$elm$core$List$map,
							function (x) {
								return _Utils_eq(
									x.indice,
									_Utils_Tuple2(ti, tj)) ? _Utils_update(
									x,
									{cureEff: 5, hos: true}) : x;
							},
							city_.tilesIndex)
					});
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{city: city})),
					$elm$core$Platform$Cmd$none);
			case 'QuarantineI':
				var _v15 = action.a;
				var i = _v15.a;
				var j = _v15.b;
				var city_ = model.city;
				var _v16 = $author$project$Geometry$converHextoTile(
					_Utils_Tuple2(i, j));
				var ti = _v16.a;
				var tj = _v16.b;
				var city = _Utils_update(
					city_,
					{
						tilesIndex: A2(
							$elm$core$List$map,
							function (x) {
								return _Utils_eq(
									x.indice,
									_Utils_Tuple2(ti, tj)) ? _Utils_update(
									x,
									{qua: true}) : x;
							},
							city_.tilesIndex)
					});
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{city: city})),
					$elm$core$Platform$Cmd$none);
			case 'EnhancedHealingI':
				var city_ = model.city;
				var city = _Utils_update(
					city_,
					{
						tilesIndex: A2(
							$elm$core$List$map,
							function (x) {
								return x.hos ? _Utils_update(
									x,
									{cureEff: x.cureEff + 1}) : x;
							},
							city_.tilesIndex)
					});
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{city: city})),
					$elm$core$Platform$Cmd$none);
			case 'AttractPeoI':
				var _v17 = action.a;
				var i = _v17.a;
				var j = _v17.b;
				var city_ = model.city;
				var _v18 = $author$project$Geometry$converHextoTile(
					_Utils_Tuple2(i, j));
				var ti = _v18.a;
				var tj = _v18.b;
				var city = _Utils_update(
					city_,
					{
						tilesIndex: A2(
							$elm$core$List$map,
							function (x) {
								return _Utils_eq(
									x.indice,
									_Utils_Tuple2(ti, tj)) ? _Utils_update(
									x,
									{peoFlow: false}) : x;
							},
							city_.tilesIndex)
					});
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{city: city})),
					$elm$core$Platform$Cmd$none);
			case 'StopAttractI':
				var _v19 = action.a;
				var i = _v19.a;
				var j = _v19.b;
				var city_ = model.city;
				var _v20 = $author$project$Geometry$converHextoTile(
					_Utils_Tuple2(i, j));
				var ti = _v20.a;
				var tj = _v20.b;
				var city = _Utils_update(
					city_,
					{
						tilesIndex: A2(
							$elm$core$List$map,
							function (x) {
								return _Utils_eq(
									x.indice,
									_Utils_Tuple2(ti, tj)) ? _Utils_update(
									x,
									{peoFlow: true}) : x;
							},
							city_.tilesIndex)
					});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{city: city}),
					$elm$core$Platform$Cmd$none);
			case 'DroughtI_Kill':
				var _v21 = action.a;
				var _v22 = _v21.a;
				var i = _v22.a;
				var j = _v22.b;
				var prob = _v21.b;
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{powRatio: 0.5 * model.powRatio})),
					A2(
						$elm$random$Random$generate,
						$author$project$Message$KillTileVir(
							_Utils_Tuple2(
								_Utils_Tuple2(i, j),
								prob)),
						A2($elm$random$Random$float, 0, 1)));
			case 'WarehouseI':
				var _v23 = action.a;
				var i = _v23.a;
				var j = _v23.b;
				var city_ = model.city;
				var _v24 = $author$project$Geometry$converHextoTile(
					_Utils_Tuple2(i, j));
				var ti = _v24.a;
				var tj = _v24.b;
				var city = _Utils_update(
					city_,
					{
						tilesIndex: A2(
							$elm$core$List$map,
							function (x) {
								return _Utils_eq(
									x.indice,
									_Utils_Tuple2(ti, tj)) ? _Utils_update(
									x,
									{wareHouse: true}) : x;
							},
							city_.tilesIndex)
					});
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{city: city, maxPower: $author$project$Parameters$para.warehousePowerInc + model.maxPower})),
					$elm$core$Platform$Cmd$none);
			case 'Warmwave_KIA':
				var _v25 = action.a;
				var _v26 = _v25.a;
				var i = _v26.a;
				var j = _v26.b;
				var prob = _v25.b;
				return _Utils_Tuple2(
					A2($author$project$Action$updateLog, card, model),
					A2(
						$elm$random$Random$generate,
						$author$project$Message$KillTileVir(
							_Utils_Tuple2(
								_Utils_Tuple2(i, j),
								prob)),
						A2($elm$random$Random$float, 0, 1)));
			case 'AVI':
				var _v27 = action.a;
				var i = _v27.a;
				var j = _v27.b;
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{
								av: $author$project$Virus$createAV(
									_Utils_Tuple2(i, j))
							})),
					$elm$core$Platform$Cmd$none);
			case 'JudgeI_Kill':
				var _v28 = action.a;
				var _v29 = _v28.a;
				var i = _v29.a;
				var j = _v29.b;
				var prob = _v28.b;
				return _Utils_Tuple2(
					A2($author$project$Action$updateLog, card, model),
					A2(
						$elm$random$Random$generate,
						$author$project$Message$JudgeVirPeo(
							_Utils_Tuple2(
								_Utils_Tuple2(i, j),
								prob)),
						A2($elm$random$Random$float, 0, 1)));
			case 'EvacuateI':
				var _v30 = action.a;
				var i = _v30.a;
				var j = _v30.b;
				var tlst = model.city.tilesIndex;
				var city = model.city;
				var _v31 = $author$project$Geometry$converHextoTile(
					_Utils_Tuple2(i, j));
				var ti = _v31.a;
				var tj = _v31.b;
				var t = A2(
					$elm$core$Maybe$withDefault,
					A9(
						$author$project$Tile$Tile,
						_Utils_Tuple2(-100, -100),
						0,
						0,
						0,
						0,
						true,
						false,
						false,
						false),
					$elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (x) {
								return _Utils_eq(
									x.indice,
									_Utils_Tuple2(ti, tj));
							},
							tlst)));
				var city_ = _Utils_update(
					city,
					{
						tilesIndex: A2($author$project$Population$evacuate, t, city)
					});
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{city: city_})),
					$elm$core$Platform$Cmd$none);
			case 'Summon':
				var cardlst = action.a;
				var hands_ = model.hands;
				var hands = A2($elm$core$List$append, hands_, cardlst);
				return _Utils_Tuple2(
					A2(
						$author$project$Action$updateLog,
						card,
						_Utils_update(
							model,
							{hands: hands})),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Action$pickAction = function (model) {
	var _v0 = A2(
		$elm$core$List$partition,
		function (_v1) {
			var _v2 = _v1.a;
			var x = _v2.a;
			var y = _v2.b;
			var z = _v1.b;
			return !x;
		},
		model.todo);
	var finished = _v0.a;
	var unfinished_ = _v0.b;
	var headQueue_ = A2(
		$elm$core$Maybe$withDefault,
		$author$project$Todo$finishedEmptyQueue,
		$elm$core$List$head(unfinished_));
	var card = headQueue_.b;
	var headAction = A2(
		$elm$core$Maybe$withDefault,
		$author$project$Card$NoAction,
		$elm$core$List$head(headQueue_.a.b));
	var headQueue = _Utils_Tuple2(
		_Utils_Tuple2(false, headQueue_.a.b),
		headQueue_.b);
	var todo = _Utils_ap(
		finished,
		_Utils_ap(
			_List_fromArray(
				[headQueue]),
			A2($elm$core$List$drop, 1, unfinished_)));
	return A3(
		$author$project$Action$performAction,
		card,
		headAction,
		_Utils_update(
			model,
			{todo: todo}));
};
var $elm_community$list_extra$List$Extra$remove = F2(
	function (x, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var y = xs.a;
			var ys = xs.b;
			return _Utils_eq(x, y) ? ys : A2(
				$elm$core$List$cons,
				y,
				A2($elm_community$list_extra$List$Extra$remove, x, ys));
		}
	});
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $author$project$Message$ReplaceCard = F2(
	function (a, b) {
		return {$: 'ReplaceCard', a: a, b: b};
	});
var $author$project$Update$replaceCard = F2(
	function (c, model) {
		if (A2($elm$core$List$member, c, model.hands) && (model.replaceChance > 0)) {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{replaceChance: model.replaceChance - 1}),
				A2(
					$elm$random$Random$generate,
					$author$project$Message$ReplaceCard(c),
					$author$project$Model$cardGenerator(model)));
		} else {
			var logreplace = A2($elm$core$Debug$log, 'card to replace does not exist in hands!', '');
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Ports$sendMsg = _Platform_outgoingPort('sendMsg', $elm$json$Json$Encode$string);
var $author$project$Card$targetCardlst = _List_fromArray(
	[$author$project$Card$cut, $author$project$Card$megaCut, $author$project$Card$organClone, $author$project$Card$humanClone, $author$project$Card$sacrifice, $author$project$Card$purification, $author$project$Card$resurgence, $author$project$Card$defenseline, $author$project$Card$hospital, $author$project$Card$quarantine, $author$project$Card$cellBroadcast, $author$project$Card$drought, $author$project$Card$warehouse, $author$project$Card$warmwave, $author$project$Card$goingViral, $author$project$Card$judgement, $author$project$Card$lowSoundWave]);
var $author$project$Model$toCardSelected = function (model) {
	var sel = model.cardSelected;
	if (sel.$ === 'SelectCard') {
		var c = sel.a;
		return $elm$core$Maybe$Just(c);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$NextRound$clearCurrentRoundTodo = function (model) {
	var todo_ = model.todo;
	var todo = A2(
		$elm$core$List$map,
		function (_v4) {
			var _v5 = _v4.a;
			var x = _v5.a;
			var y = _v5.b;
			var z = _v4.b;
			return _Utils_Tuple2(
				_Utils_Tuple2(true, y),
				z);
		},
		A2(
			$elm$core$List$filter,
			function (_v2) {
				var _v3 = _v2.a;
				var x = _v3.a;
				var y = _v3.b;
				var z = _v2.b;
				return !$elm$core$List$isEmpty(y);
			},
			A2(
				$elm$core$List$map,
				function (_v0) {
					var _v1 = _v0.a;
					var x = _v1.a;
					var y = _v1.b;
					var z = _v0.b;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							x,
							A2($elm$core$List$drop, 1, y)),
						z);
				},
				todo_)));
	return _Utils_update(
		model,
		{freezeTile: _List_Nil, roundTodoCleared: false, selHex: $author$project$Model$SelHexOff, todo: todo});
};
var $author$project$Virus$endlssVir = _List_fromArray(
	[
		_Utils_ap(
		A2(
			$author$project$Geometry$cartesianProduct,
			_List_fromArray(
				[-2]),
			_List_fromArray(
				[4, 5])),
		_Utils_ap(
			_List_fromArray(
				[
					_Utils_Tuple2(-3, 6),
					_Utils_Tuple2(-3, 7)
				]),
			$author$project$Geometry$generateZone(
				$author$project$Geometry$converTiletoHex_(
					_Utils_Tuple2(0, 3))))),
		_Utils_ap(
		$author$project$Geometry$generateZone(
			$author$project$Geometry$converTiletoHex_(
				_Utils_Tuple2(0, 3))),
		_List_fromArray(
			[
				_Utils_Tuple2(-3, 6),
				_Utils_Tuple2(-3, 7)
			])),
		_Utils_ap(
		$author$project$Geometry$generateZone(
			$author$project$Geometry$converTiletoHex_(
				_Utils_Tuple2(-1, -1))),
		_List_fromArray(
			[
				_Utils_Tuple2(-2, -2),
				_Utils_Tuple2(-3, 0),
				_Utils_Tuple2(-3, -1)
			])),
		_Utils_ap(
		$author$project$Geometry$generateZone(
			$author$project$Geometry$converTiletoHex_(
				_Utils_Tuple2(2, 3))),
		_List_fromArray(
			[
				_Utils_Tuple2(4, 7),
				_Utils_Tuple2(3, 8),
				_Utils_Tuple2(2, 9)
			])),
		_Utils_ap(
		$author$project$Geometry$generateZone(
			$author$project$Geometry$converTiletoHex_(
				_Utils_Tuple2(4, 0))),
		_List_fromArray(
			[
				_Utils_Tuple2(7, 2),
				_Utils_Tuple2(7, 3)
			])),
		_Utils_ap(
		$author$project$Geometry$generateZone(
			$author$project$Geometry$converTiletoHex_(
				_Utils_Tuple2(2, -3))),
		_List_fromArray(
			[
				_Utils_Tuple2(7, -5),
				_Utils_Tuple2(5, -6)
			]))
	]);
var $author$project$Virus$ruleLst = _List_fromArray(
	[
		_List_fromArray(
		[2, 5]),
		_List_fromArray(
		[2, 4]),
		_List_fromArray(
		[2, 3]),
		_List_fromArray(
		[2, 3, 6]),
		_List_fromArray(
		[2, 3, 5]),
		_List_fromArray(
		[2, 4, 6]),
		_List_fromArray(
		[2, 4, 5]),
		_List_fromArray(
		[2, 3, 4])
	]);
var $author$project$NextRound$selectVirus = F2(
	function (n, wave) {
		var rules = (wave > 6) ? A3(
			$elm$core$List$foldr,
			$elm$core$Basics$append,
			_List_Nil,
			A2(
				$author$project$Geometry$getElement,
				4 + A2($elm$core$Basics$modBy, 5, wave),
				$author$project$Virus$ruleLst)) : A3(
			$elm$core$List$foldr,
			$elm$core$Basics$append,
			_List_Nil,
			A2(
				$author$project$Geometry$getElement,
				1 + A2($elm$core$Basics$modBy, 3, n),
				$author$project$Virus$ruleLst));
		var pos = ((wave >= 3) && (!_Utils_eq(
			1 + A2($elm$core$Basics$modBy, 6, wave),
			1 + A2($elm$core$Basics$modBy, 5, n)))) ? $elm_community$list_extra$List$Extra$unique(
			A3(
				$elm$core$List$foldr,
				$elm$core$Basics$append,
				_List_Nil,
				_Utils_ap(
					A2(
						$author$project$Geometry$getElement,
						1 + A2($elm$core$Basics$modBy, 6, wave),
						$author$project$Virus$endlssVir),
					A2(
						$author$project$Geometry$getElement,
						1 + A2($elm$core$Basics$modBy, 5, n),
						$author$project$Virus$endlssVir)))) : (((wave >= 3) && _Utils_eq(
			1 + A2($elm$core$Basics$modBy, 6, wave),
			1 + A2($elm$core$Basics$modBy, 5, n))) ? $elm_community$list_extra$List$Extra$unique(
			A3(
				$elm$core$List$foldr,
				$elm$core$Basics$append,
				_List_Nil,
				_Utils_ap(
					A2(
						$author$project$Geometry$getElement,
						1 + A2($elm$core$Basics$modBy, 6, wave),
						$author$project$Virus$endlssVir),
					A2(
						$author$project$Geometry$getElement,
						1 + A2($elm$core$Basics$modBy, 6, n),
						$author$project$Virus$endlssVir)))) : A3(
			$elm$core$List$foldr,
			$elm$core$Basics$append,
			_List_Nil,
			A2(
				$author$project$Geometry$getElement,
				1 + A2($elm$core$Basics$modBy, 6, wave),
				$author$project$Virus$endlssVir)));
		return A5(
			$author$project$Virus$Virus,
			rules,
			pos,
			6,
			1,
			A2($elm$core$Basics$min, 0.1 + (wave * 0.04), 0.66));
	});
var $author$project$NextRound$endlessVirCreator = function (model) {
	var virus_ = model.virus;
	var tiles_ = model.city.tilesIndex;
	var tiles2 = A2(
		$elm$core$List$map,
		function (x) {
			return _Utils_update(
				x,
				{population: x.population + 2});
		},
		tiles_);
	var tiles1 = A2(
		$elm$core$List$map,
		function (x) {
			return x.qua ? _Utils_update(
				x,
				{qua: false}) : x;
		},
		tiles_);
	var num = model.virus.number;
	var virus = _Utils_update(
		virus_,
		{number: num - 1});
	var city_ = model.city;
	var city2 = _Utils_update(
		city_,
		{tilesIndex: tiles2});
	var city1 = _Utils_update(
		city_,
		{tilesIndex: tiles1});
	return ((model.currentLevel === 6) && ((num === 6) && $elm$core$List$isEmpty(virus.pos))) ? _Utils_update(
		model,
		{
			actionDescribe: A2(
				$elm$core$List$cons,
				$author$project$Model$Warning('Congrats!!\nYou\'ve defeated one wave!\nAll quaratines reset.\nEmergency is temporarily gone.'),
				model.actionDescribe),
			city: city1,
			virus: virus,
			waveNum: model.waveNum + 1
		}) : (((model.currentLevel === 6) && ((num === 5) && $elm$core$List$isEmpty(virus.pos))) ? _Utils_update(
		model,
		{
			actionDescribe: A2(
				$elm$core$List$cons,
				$author$project$Model$Warning('Next wave: 2 rounds\nPopulation bonus:\nSome refugees join your city.'),
				model.actionDescribe),
			city: city2,
			virus: virus
		}) : (((model.currentLevel === 6) && (num === 4)) ? _Utils_update(
		model,
		{
			actionDescribe: A2(
				$elm$core$List$cons,
				$author$project$Model$Warning('Next wave: next turn\n'),
				model.actionDescribe),
			virus: virus
		}) : (((model.currentLevel === 6) && (num === 3)) ? _Utils_update(
		model,
		{
			virus: A2($author$project$NextRound$selectVirus, model.currentRound, model.waveNum)
		}) : model)));
};
var $author$project$Model$initLog = function (model) {
	return _Utils_update(
		model,
		{actionDescribe: _List_Nil});
};
var $author$project$Model$Finished = function (a) {
	return {$: 'Finished', a: a};
};
var $author$project$Model$Wasted = {$: 'Wasted'};
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $author$project$Tile$sumPopulation = function (city) {
	return $elm$core$List$sum(
		A2(
			$elm$core$List$map,
			function (x) {
				return x.population;
			},
			city.tilesIndex));
};
var $author$project$Model$winCondition = _List_fromArray(
	[140, 160, 80, 50]);
var $author$project$NextRound$judgeWin = function (model) {
	return ((model.currentLevel === 1) && (model.currentRound === 4)) ? _Utils_update(
		model,
		{
			state: $author$project$Model$Finished(1)
		}) : (((model.currentLevel === 2) && ((model.currentRound >= 4) && $elm$core$List$isEmpty(model.virus.pos))) ? _Utils_update(
		model,
		{
			state: $author$project$Model$Finished(2)
		}) : (((model.currentRound === 21) && ((model.currentLevel > 2) && ((model.currentLevel < 6) && (_Utils_cmp(
		$author$project$Tile$sumPopulation(model.city),
		$elm$core$List$sum(
			A2($author$project$Geometry$getElement, model.currentLevel - 2, $author$project$Model$winCondition))) > -1)))) ? _Utils_update(
		model,
		{
			state: $author$project$Model$Finished(model.currentLevel)
		}) : (((model.currentLevel === 6) && (_Utils_cmp(
		$author$project$Tile$sumPopulation(model.city),
		$elm$core$List$sum(
			A2($author$project$Geometry$getElement, model.currentLevel - 2, $author$project$Model$winCondition))) > -1)) ? model : (((model.currentRound < 21) && ($author$project$Tile$sumPopulation(model.city) > 0)) ? model : _Utils_update(
		model,
		{state: $author$project$Model$Wasted})))));
};
var $author$project$NextRound$powerInc = function (model) {
	if (_Utils_cmp(
		model.power + $elm$core$Basics$round(model.powRatio * $author$project$Parameters$para.basicPowerInc),
		model.maxPower) > -1) {
		var w = $author$project$Model$Warning('Maximum Power reached. ');
		return _Utils_update(
			model,
			{
				actionDescribe: A2($elm$core$List$cons, w, model.actionDescribe),
				power: model.maxPower
			});
	} else {
		return _Utils_update(
			model,
			{
				power: model.power + $elm$core$Basics$round(model.powRatio * $author$project$Parameters$para.basicPowerInc)
			});
	}
};
var $author$project$Virus$countInfectedNeighbor = F2(
	function (pos, lstv) {
		var lstn = $author$project$Geometry$generateZone(pos);
		return $elm$core$List$sum(
			A2(
				$elm$core$List$map,
				function (x) {
					return A2($elm$core$List$member, x, lstv) ? 1 : 0;
				},
				lstn));
	});
var $author$project$Virus$countavNeighbor = F2(
	function (pos, lstv) {
		var lstn = $author$project$Geometry$generateZone(pos);
		return $elm$core$List$sum(
			A2(
				$elm$core$List$map,
				function (x) {
					return A2($elm$core$List$member, x, lstv) ? 1 : 0;
				},
				lstn));
	});
var $author$project$Virus$judgeAlive = F5(
	function (lstvir, vir, lstanti, anti, lstquatile) {
		var lsta = (anti.life > 0) ? A2(
			$elm$core$List$filter,
			function (x) {
				return A2(
					$elm$core$List$member,
					A2($author$project$Virus$countavNeighbor, x, anti.pos),
					anti.rules) && (!A2(
					$elm$core$List$member,
					$author$project$Geometry$converHextoTile(x),
					lstquatile));
			},
			lstanti) : _List_Nil;
		var lstv = A2(
			$elm$core$List$filter,
			function (x) {
				return A2(
					$elm$core$List$member,
					A2($author$project$Virus$countInfectedNeighbor, x, vir.pos),
					vir.rules) && ((!A2($elm$core$List$member, x, lsta)) && (!A2(
					$elm$core$List$member,
					$author$project$Geometry$converHextoTile(x),
					lstquatile)));
			},
			lstvir);
		return _Utils_Tuple2(
			_Utils_update(
				vir,
				{pos: lstv}),
			_Utils_update(
				anti,
				{
					life: A2($elm$core$Basics$max, anti.life - 1, 0),
					pos: lsta
				}));
	});
var $author$project$Tile$quarantineTiles = function (tlst) {
	return A2(
		$elm$core$List$map,
		function (x) {
			return x.indice;
		},
		A2(
			$elm$core$List$filter,
			function (x) {
				return x.qua;
			},
			tlst));
};
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $author$project$Virus$searchValidNeighbor = F2(
	function (virlst, lst) {
		return A2(
			$elm$core$List$filter,
			function (x) {
				return A2(
					$elm$core$List$member,
					$author$project$Geometry$converHextoTile(x),
					lst);
			},
			$elm_community$list_extra$List$Extra$unique(
				$elm$core$List$concat(
					A2(
						$elm$core$List$map,
						function (x) {
							return $author$project$Geometry$generateZone(x);
						},
						virlst))));
	});
var $author$project$Population$change = F3(
	function (virus, anti, city) {
		var validlst = A2(
			$elm$core$List$map,
			function (x) {
				return x.indice;
			},
			city.tilesIndex);
		var lstvir = A2($author$project$Virus$searchValidNeighbor, virus.pos, validlst);
		var lstquatile = $author$project$Tile$quarantineTiles(city.tilesIndex);
		var lstanti = A2($author$project$Virus$searchValidNeighbor, anti.pos, validlst);
		return A5($author$project$Virus$judgeAlive, lstvir, virus, lstanti, anti, lstquatile);
	});
var $author$project$Tile$sumDead = function (city) {
	return $elm$core$List$sum(
		A2(
			$elm$core$List$map,
			function (x) {
				return x.dead;
			},
			city.tilesIndex));
};
var $author$project$Tile$sumSick = function (city) {
	return $elm$core$List$sum(
		A2(
			$elm$core$List$map,
			function (x) {
				return x.sick;
			},
			city.tilesIndex));
};
var $author$project$NextRound$horrify = function (model) {
	if (A2(
		$elm$core$List$member,
		model.currentLevel,
		_List_fromArray(
			[4, 6]))) {
		var city = model.city;
		return ((_Utils_cmp(
			$author$project$Tile$sumSick(city) + $author$project$Tile$sumDead(city),
			$author$project$Tile$sumPopulation(city)) > -1) && (model.flowRate === 1)) ? _Utils_update(
			model,
			{
				actionDescribe: _Utils_ap(
					_List_fromArray(
						[
							$author$project$Model$Warning('Terror spreads among citizens:\npopulation flow x2.\n (Healthy<dead+sick)\n')
						]),
					model.actionDescribe),
				flowRate: 2
			}) : ((_Utils_cmp(
			$author$project$Tile$sumSick(city) + $author$project$Tile$sumDead(city),
			$author$project$Tile$sumPopulation(city)) > -1) ? model : ((model.flowRate === 2) ? _Utils_update(
			model,
			{
				actionDescribe: _Utils_ap(
					_List_fromArray(
						[
							$author$project$Model$Warning('Citzens calm down (Healthy<dead+sick)\nInitialize population flow rate.\n')
						]),
					model.actionDescribe),
				flowRate: 1
			}) : model));
	} else {
		return model;
	}
};
var $author$project$NextRound$mutate = F2(
	function (rule, model) {
		var vir_ = model.virus;
		var vir = (_Utils_eq(model.currentRound, $author$project$Parameters$para.mr) && (model.currentLevel < 6)) ? _Utils_update(
			vir_,
			{rules: rule}) : (((model.currentLevel === 6) && ((!A2($elm$core$Basics$modBy, $author$project$Parameters$para.mr, model.currentRound)) && ($elm$core$List$length(vir_.pos) < 4))) ? _Utils_update(
			vir_,
			{rules: rule}) : vir_);
		return _Utils_update(
			model,
			{
				actionDescribe: _Utils_ap(
					_List_fromArray(
						[
							$author$project$Model$Warning('Spread pattern mutates!!!\n(See the virus info panel)\n')
						]),
					model.actionDescribe),
				virus: vir
			});
	});
var $author$project$NextRound$revenge = F2(
	function (size, model) {
		if (model.currentLevel === 3) {
			if ((_Utils_cmp(
				size,
				$elm$core$List$length(model.virus.pos)) > 0) && (!model.counter)) {
				var virus_ = model.virus;
				var virus = _Utils_update(
					virus_,
					{
						infect: A2($elm$core$Basics$min, virus_.infect + 1, 2),
						kill: A2($elm$core$Basics$min, virus_.kill * 1.1, 0.66)
					});
				return _Utils_update(
					model,
					{
						actionDescribe: _Utils_ap(
							_List_fromArray(
								[
									$author$project$Model$Warning('Virus become stronger!!!\n(See the virus info panel)\n')
								]),
							model.actionDescribe),
						counter: 3,
						virus: virus
					});
			} else {
				if (_Utils_cmp(
					size,
					$elm$core$List$length(model.virus.pos)) < 0) {
					return _Utils_update(
						model,
						{counter: model.counter - 1});
				} else {
					return model;
				}
			}
		} else {
			return model;
		}
	});
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $elm$core$Debug$toString = _Debug_toString;
var $author$project$NextRound$takeOver = function (model) {
	var vir = model.virus;
	var r = model.currentRound;
	var lv = model.currentLevel;
	var freezeTiles = model.freezeTile;
	var city = model.city;
	var tilelst = ((lv !== 6) && _Utils_eq(r, $author$project$Parameters$para.tor)) ? A2(
		$elm$core$List$map,
		function (x) {
			return x.indice;
		},
		A2(
			$elm$core$List$filter,
			function (x) {
				return (_Utils_cmp((x.population - x.sick) * 3, x.dead) < 1) && (!A2($elm$core$List$member, x.indice, freezeTiles));
			},
			city.tilesIndex)) : (((lv === 6) && ((!_Utils_eq(vir.pos, _List_Nil)) && (!A2($elm$core$Basics$modBy, $author$project$Parameters$para.tor, r)))) ? A2(
		$elm$core$List$map,
		function (x) {
			return x.indice;
		},
		A2(
			$elm$core$List$filter,
			function (x) {
				return (_Utils_cmp((x.population - x.sick) * 6, x.dead) < 1) && (!A2($elm$core$List$member, x.indice, freezeTiles));
			},
			city.tilesIndex)) : _List_Nil);
	var extraVir = $elm$core$List$concat(
		A2(
			$elm$core$List$map,
			function (x) {
				return $author$project$Geometry$converTiletoHex(x);
			},
			tilelst));
	var message = $elm$core$List$isEmpty(extraVir) ? _List_Nil : _List_fromArray(
		[
			$author$project$Model$Warning(
			'Virus outbreaks in damaged areas\n' + ('(Dead>=' + ($elm$core$Debug$toString(3 * (((r / 17) | 0) + 1)) + 'xHealthy population)\n')))
		]);
	var pos = $elm_community$list_extra$List$Extra$unique(
		_Utils_ap(vir.pos, extraVir));
	var vir_ = _Utils_update(
		vir,
		{pos: pos});
	return _Utils_update(
		model,
		{
			actionDescribe: _Utils_ap(message, model.actionDescribe),
			virus: vir_
		});
};
var $author$project$Tile$neighborSick = F2(
	function (tlst, t) {
		var lstn = $author$project$Geometry$generateZone(t.indice);
		return $elm$core$List$sum(
			A2(
				$elm$core$List$map,
				function (x) {
					return x.sick;
				},
				A2(
					$elm$core$List$filter,
					function (x) {
						return A2($elm$core$List$member, x.indice, lstn) && ((x.population > 0) && (!x.qua));
					},
					tlst)));
	});
var $elm$core$List$unzip = function (pairs) {
	var step = F2(
		function (_v0, _v1) {
			var x = _v0.a;
			var y = _v0.b;
			var xs = _v1.a;
			var ys = _v1.b;
			return _Utils_Tuple2(
				A2($elm$core$List$cons, x, xs),
				A2($elm$core$List$cons, y, ys));
		});
	return A3(
		$elm$core$List$foldr,
		step,
		_Utils_Tuple2(_List_Nil, _List_Nil),
		pairs);
};
var $author$project$NextRound$unBlockable = function (model) {
	if (A2(
		$elm$core$List$member,
		model.currentLevel,
		_List_fromArray(
			[5, 6]))) {
		var city = model.city;
		var tlst = city.tilesIndex;
		var tilelst = A2(
			$elm$core$List$map,
			function (x) {
				return (x.qua && (_Utils_cmp(
					A2($author$project$Tile$neighborSick, tlst, x),
					(x.population - x.sick) * 3) > 0)) ? _Utils_Tuple2(
					_Utils_update(
						x,
						{qua: false}),
					1) : _Utils_Tuple2(x, 0);
			},
			tlst);
		var citytile = $elm$core$List$unzip(tilelst).a;
		var city_ = _Utils_update(
			city,
			{tilesIndex: citytile});
		var num = $elm$core$List$sum(
			$elm$core$List$unzip(tilelst).b);
		var actionDescribe = (!num) ? _Utils_ap(model.actionDescribe, _List_Nil) : ((num === 1) ? _Utils_ap(
			_List_fromArray(
				[
					$author$project$Model$Warning('Emergency!!!\nPatients broke into one quarantine!!\nPatients nearby>3x(quarantine population)\n\n')
				]),
			model.actionDescribe) : _Utils_ap(
			_List_fromArray(
				[
					$author$project$Model$Warning(
					'Emergency!!!\nPatients broke into ' + ($elm$core$Debug$toString(num) + ' quarantines!!\nPatients nearby>3x(quarantine population)\n'))
				]),
			model.actionDescribe));
		return _Utils_update(
			model,
			{actionDescribe: actionDescribe, city: city_});
	} else {
		return model;
	}
};
var $author$project$Tile$sickupdate = F3(
	function (t, lstvir, inf) {
		return A2(
			$elm$core$List$map,
			function (x) {
				var s = A2(
					$elm_community$list_extra$List$Extra$count,
					$elm$core$Basics$eq(x.indice),
					lstvir) * inf;
				var cure = x.cureEff;
				return x.hos ? (((_Utils_cmp((s + x.sick) - cure, x.population) < 1) && (((s + x.sick) - cure) >= 0)) ? _Utils_update(
					x,
					{sick: (s + x.sick) - cure}) : ((((s + x.sick) - cure) < 0) ? _Utils_update(
					x,
					{sick: 0}) : _Utils_update(
					x,
					{sick: x.population}))) : _Utils_update(
					x,
					{
						sick: A2($elm$core$Basics$min, x.sick + s, x.population)
					});
			},
			t);
	});
var $author$project$Population$infect = F2(
	function (virus, city) {
		var lstvirHexIndice = virus.pos;
		var lstvirTilesIndice = A2(
			$elm$core$List$map,
			function (x) {
				return $author$project$Geometry$converHextoTile(x);
			},
			lstvirHexIndice);
		var lstTile = city.tilesIndex;
		var inf = virus.infect;
		return _Utils_update(
			city,
			{
				tilesIndex: A3($author$project$Tile$sickupdate, lstTile, lstvirTilesIndice, inf)
			});
	});
var $author$project$Population$flowStructure = F2(
	function (model, t) {
		var flow = model.flowRate;
		var citytileslst = model.city.tilesIndex;
		var nindex = A2(
			$elm$core$List$map,
			function (x) {
				return x.indice;
			},
			A2(
				$elm$core$List$sortBy,
				function (x) {
					return x.hos ? x.sick : (x.sick + (x.dead * 2));
				},
				A2($author$project$Tile$validNeighborTile, citytileslst, t)));
		var numLeave = A2(
			$elm$core$Basics$min,
			flow * $elm$core$List$length(nindex),
			t.population);
		var leaveLst1 = A2(
			$elm$core$List$take,
			A2($elm$core$Basics$modBy, flow, numLeave),
			A2(
				$elm$core$List$drop,
				$elm$core$Basics$floor(numLeave / flow),
				nindex));
		var leaveLstn = A2(
			$elm$core$List$take,
			$elm$core$Basics$floor(numLeave / flow),
			nindex);
		var numsickLeave = $elm$core$Basics$round(numLeave * (t.sick / t.population));
		var sick1 = (!A2($elm$core$Basics$modBy, 2, numsickLeave)) ? _List_Nil : leaveLst1;
		var sickn = A2(
			$elm$core$List$take,
			$elm$core$Basics$floor(numsickLeave / flow),
			leaveLstn);
		return A2(
			$elm$core$List$cons,
			_Utils_Tuple2(
				t.indice,
				_Utils_Tuple2(0 - numLeave, 0 - numsickLeave)),
			A2(
				$elm$core$List$map,
				function (x) {
					return A2($elm$core$List$member, x, sickn) ? _Utils_Tuple2(
						x,
						_Utils_Tuple2(flow, flow)) : (A2($elm$core$List$member, x, sick1) ? _Utils_Tuple2(
						x,
						_Utils_Tuple2(1, 1)) : (A2($elm$core$List$member, x, leaveLst1) ? _Utils_Tuple2(
						x,
						_Utils_Tuple2(1, 0)) : (A2($elm$core$List$member, x, leaveLstn) ? _Utils_Tuple2(
						x,
						_Utils_Tuple2(flow, 0)) : _Utils_Tuple2(
						x,
						_Utils_Tuple2(0, 0)))));
				},
				nindex));
	});
var $author$project$Population$uPlow = F2(
	function (lst, t) {
		var lstindice = A2(
			$elm$core$List$filter,
			function (x) {
				return _Utils_eq(x.a, t.indice);
			},
			lst);
		var _v0 = $elm$core$List$unzip(
			$elm$core$List$unzip(lstindice).b);
		var leavelst = _v0.a;
		var sicklst = _v0.b;
		var leave = $elm$core$List$sum(leavelst);
		var sick = $elm$core$List$sum(sicklst);
		return _Utils_update(
			t,
			{population: t.population + leave, sick: t.sick + sick});
	});
var $author$project$Population$pFlow = F2(
	function (model, city) {
		var validtileslst = A2(
			$elm$core$List$filter,
			function (x) {
				return x.population > 0;
			},
			city.tilesIndex);
		var flowstructure = A3(
			$elm$core$List$foldr,
			$elm$core$Basics$append,
			_List_Nil,
			A2(
				$elm$core$List$map,
				function (x) {
					return A2($author$project$Population$flowStructure, model, x);
				},
				validtileslst));
		var newcitytiles = A2(
			$elm$core$List$map,
			function (x) {
				return A2($author$project$Population$uPlow, flowstructure, x);
			},
			city.tilesIndex);
		return _Utils_update(
			city,
			{tilesIndex: newcitytiles});
	});
var $author$project$Population$deathTile = F2(
	function (x, dr) {
		var dead = A2(
			$elm$core$Basics$max,
			$elm$core$Basics$round(x.sick * dr),
			1);
		return _Utils_update(
			x,
			{dead: x.dead + dead, population: x.population - dead, sick: x.sick - dead});
	});
var $author$project$Population$virusKill = F2(
	function (vir, city) {
		var patients = $author$project$Tile$sumSick(city);
		var dr = vir.kill;
		var estimateddeath = (!(!dr)) ? A2(
			$elm$core$Basics$max,
			$elm$core$Basics$floor(patients * dr),
			1) : 0;
		var _v0 = A2(
			$elm$core$List$partition,
			function (x) {
				return x.sick < 2;
			},
			A2(
				$elm$core$List$sortBy,
				function ($) {
					return $.sick;
				},
				A2(
					$elm$core$List$filter,
					function (x) {
						return x.sick > 0;
					},
					city.tilesIndex)));
		var lstInfected1 = _v0.a;
		var lstInfectedn = _v0.b;
		var deathn = $elm$core$List$sum(
			A2(
				$elm$core$List$map,
				function (x) {
					return $elm$core$Basics$round(dr * x.sick);
				},
				lstInfectedn));
		var _v1 = ((_Utils_cmp(deathn, estimateddeath) > -1) && (estimateddeath > 0)) ? _Utils_Tuple2(
			A2(
				$elm$core$List$take,
				$elm$core$Basics$floor(
					(deathn / estimateddeath) * $elm$core$List$length(lstInfectedn)),
				lstInfectedn),
			_List_Nil) : ((_Utils_cmp(deathn, estimateddeath) < 0) ? _Utils_Tuple2(
			lstInfectedn,
			A2($elm$core$List$take, estimateddeath - deathn, lstInfected1)) : _Utils_Tuple2(_List_Nil, _List_Nil));
		var dn = _v1.a;
		var d1 = _v1.b;
		var tilesIndex = A2(
			$elm$core$List$map,
			function (x) {
				return A2(
					$elm$core$List$member,
					x,
					_Utils_ap(dn, d1)) ? A2($author$project$Population$deathTile, x, dr) : x;
			},
			city.tilesIndex);
		return _Utils_update(
			city,
			{tilesIndex: tilesIndex});
	});
var $author$project$Population$updateCity = function (model) {
	var vir = model.virus;
	var city = model.city;
	var city_ = A2(
		$author$project$Population$infect,
		vir,
		A2(
			$author$project$Population$pFlow,
			model,
			A2($author$project$Population$virusKill, vir, city)));
	return city_;
};
var $author$project$NextRound$virusEvolve = function (model) {
	var vir = model.virus;
	var size = $elm$core$List$length(vir.pos);
	var rules = vir.rules;
	var newrules = $elm$core$List$sort(
		A2(
			$elm$core$List$append,
			rules,
			A2(
				$elm$core$List$take,
				1,
				A2(
					$elm$core$List$filter,
					function (x) {
						return !A2($elm$core$List$member, x, rules);
					},
					A2($elm$core$List$range, 2, 6)))));
	var frozeTile = model.freezeTile;
	var freezePos = A2(
		$elm$core$List$filter,
		function (x) {
			return A2(
				$elm$core$List$member,
				$author$project$Geometry$converHextoTile(x),
				frozeTile);
		},
		vir.pos);
	var city = $author$project$Population$updateCity(model);
	var _v0 = A3($author$project$Population$change, vir, model.av, model.city);
	var virus_ = _v0.a;
	var av = _v0.b;
	var virPos = _Utils_ap(
		A2(
			$elm$core$List$filter,
			function (x) {
				return !A2(
					$elm$core$List$member,
					$author$project$Geometry$converHextoTile(x),
					frozeTile);
			},
			virus_.pos),
		freezePos);
	var virus = _Utils_update(
		virus_,
		{pos: virPos});
	return $author$project$NextRound$horrify(
		A2(
			$author$project$NextRound$revenge,
			size,
			$author$project$NextRound$unBlockable(
				$author$project$NextRound$takeOver(
					A2(
						$author$project$NextRound$mutate,
						newrules,
						_Utils_update(
							model,
							{av: av, city: city, virus: virus}))))));
};
var $author$project$NextRound$renewStatus = function (model) {
	return $author$project$NextRound$endlessVirCreator(
		$author$project$NextRound$clearCurrentRoundTodo(
			$author$project$NextRound$judgeWin(
				$author$project$Model$initLog(
					$author$project$NextRound$powerInc(
						$author$project$NextRound$virusEvolve(model))))));
};
var $author$project$NextRound$toNextRound = function (model) {
	return (model.currentLevel === 1) ? (((model.currentRound === 1) && _Utils_eq(model.hands, _List_Nil)) ? _Utils_Tuple2(
		$author$project$NextRound$clearCurrentRoundTodo(
			$author$project$Model$initLog(
				_Utils_update(
					model,
					{
						currentRound: 2,
						hands: _List_fromArray(
							[$author$project$Card$hospital, $author$project$Card$hospital, $author$project$Card$hospital, $author$project$Card$warehouse, $author$project$Card$quarantine])
					}))),
		$elm$core$Platform$Cmd$none) : ((_Utils_eq(model.hands, _List_Nil) && (model.currentRound === 2)) ? _Utils_Tuple2(
		$author$project$NextRound$clearCurrentRoundTodo(
			$author$project$Model$initLog(
				_Utils_update(
					model,
					{currentRound: 3}))),
		$elm$core$Platform$Cmd$none) : (((model.currentRound === 3) && (!_Utils_eq(model.hands, _List_Nil))) ? _Utils_Tuple2(
		$author$project$NextRound$judgeWin(
			$author$project$NextRound$clearCurrentRoundTodo(
				$author$project$Model$initLog(
					_Utils_update(
						model,
						{currentRound: 4})))),
		$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none)))) : ((model.currentLevel === 2) ? ((model.currentRound === 1) ? _Utils_Tuple2(
		$author$project$Model$initLog(
			$author$project$NextRound$powerInc(
				$author$project$NextRound$clearCurrentRoundTodo(
					$author$project$NextRound$virusEvolve(
						_Utils_update(
							model,
							{
								currentRound: model.currentRound + 1,
								hands: _List_fromArray(
									[$author$project$Card$goingViral])
							}))))),
		$elm$core$Platform$Cmd$none) : (((model.currentRound < 4) && _Utils_eq(model.hands, _List_Nil)) ? _Utils_Tuple2(
		$author$project$Model$initLog(
			$author$project$NextRound$powerInc(
				$author$project$NextRound$clearCurrentRoundTodo(
					$author$project$NextRound$virusEvolve(
						_Utils_update(
							model,
							{currentRound: model.currentRound + 1}))))),
		$elm$core$Platform$Cmd$none) : ((model.currentRound === 4) ? _Utils_Tuple2(
		$author$project$Model$initLog(
			$author$project$NextRound$powerInc(
				$author$project$NextRound$clearCurrentRoundTodo(
					$author$project$NextRound$virusEvolve(
						_Utils_update(
							model,
							{
								currentRound: model.currentRound + 1,
								hands: _List_fromArray(
									[$author$project$Card$cut, $author$project$Card$quarantine, $author$project$Card$megaCut, $author$project$Card$megaCut, $author$project$Card$cut, $author$project$Card$megaCut, $author$project$Card$hospital]),
								power: 6,
								virus: $author$project$Virus$virus2
							}))))),
		$elm$core$Platform$Cmd$none) : ((model.currentRound > 4) ? _Utils_Tuple2(
		$author$project$NextRound$renewStatus(
			_Utils_update(
				model,
				{currentRound: model.currentRound + 1})),
		$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none))))) : (model.behavior.virusEvolve ? _Utils_Tuple2(
		$author$project$NextRound$renewStatus(
			_Utils_update(
				model,
				{currentRound: model.currentRound + 1, drawChance: 1})),
		$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
		$author$project$NextRound$endlessVirCreator(
			$author$project$NextRound$judgeWin(
				$author$project$Model$initLog(
					$author$project$NextRound$powerInc(
						$author$project$NextRound$clearCurrentRoundTodo(
							_Utils_update(
								model,
								{behavior: $author$project$Model$initBehavior, currentRound: model.currentRound + 1, drawChance: 1})))))),
		$elm$core$Platform$Cmd$none)));
};
var $author$project$Update$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'LevelBegin':
				var n = msg.a;
				return (n <= 2) ? _Utils_Tuple2(
					A2(
						$author$project$Update$loadTheme,
						n,
						A2($author$project$InitLevel$levelInit, n, model)),
					$elm$core$Platform$Cmd$none) : ((n === 5) ? _Utils_Tuple2(
					A2(
						$author$project$Update$loadTheme,
						n,
						A2($author$project$InitLevel$levelInit, n, model)),
					A2(
						$elm$random$Random$generate,
						$author$project$Message$InitializeHands,
						A2($author$project$Model$cardsGenerator, model, 6))) : _Utils_Tuple2(
					A2(
						$author$project$Update$loadTheme,
						n,
						A2($author$project$InitLevel$levelInit, n, model)),
					A2(
						$elm$random$Random$generate,
						$author$project$Message$InitializeHands,
						A2($author$project$Model$cardsGenerator, model, 4))));
			case 'InitializeHands':
				var lc = msg.a;
				var specialCards = (model.currentLevel === 5) ? _List_fromArray(
					[$author$project$Card$blizzard, $author$project$Card$drought, $author$project$Card$hospital, $author$project$Card$quarantine]) : ((model.currentLevel === 4) ? _List_fromArray(
					[$author$project$Card$megaClone, $author$project$Card$organClone, $author$project$Card$resurgence, $author$project$Card$purification, $author$project$Card$cut, $author$project$Card$hospital]) : ((model.currentLevel === 3) ? _List_fromArray(
					[$author$project$Card$defenseline, $author$project$Card$sacrifice, $author$project$Card$goingViral, $author$project$Card$judgement, $author$project$Card$hospital, $author$project$Card$hospital]) : _List_fromArray(
					[$author$project$Card$quarantine, $author$project$Card$hospital, $author$project$Card$cut, $author$project$Card$cut, $author$project$Card$megaCut, $author$project$Card$coldWave])));
				var loglc = A2($elm$core$Debug$log, 'lc', lc);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							hands: _Utils_ap(lc, specialCards)
						}),
					$elm$core$Platform$Cmd$none);
			case 'ReplaceCard':
				var c = msg.a;
				var replacement = msg.b;
				var hands_ = model.hands;
				var hands = A2(
					$elm$core$List$append,
					_List_fromArray(
						[replacement]),
					A2($elm_community$list_extra$List$Extra$remove, c, hands_));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{hands: hands}),
					$elm$core$Platform$Cmd$none);
			case 'Resize':
				var w = msg.a;
				var h = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							screenSize: _Utils_Tuple2(w, h)
						}),
					$elm$core$Platform$Cmd$none);
			case 'Tick':
				var newTime = msg.a;
				return (!$author$project$Todo$finished(model.todo)) ? $author$project$RegionFill$mFillRegion(
					$author$project$Action$pickAction(model)) : $author$project$RegionFill$mFillRegion(
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
			case 'AddKey':
				var kv = msg.a;
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'GotViewport':
				var viewport = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							screenSize: _Utils_Tuple2(viewport.viewport.width, viewport.viewport.height),
							viewport: $elm$core$Maybe$Just(viewport)
						}),
					$elm$core$Platform$Cmd$none);
			case 'VirusEvolve':
				return _Utils_Tuple2(
					$author$project$NextRound$virusEvolve(model),
					$elm$core$Platform$Cmd$none);
			case 'NextRound':
				return $author$project$NextRound$toNextRound(model);
			case 'DrawACard':
				if (_Utils_cmp(model.power, $author$project$Parameters$para.drawCardCost) > -1) {
					if (model.currentLevel === 1) {
						return ((model.currentRound === 3) && _Utils_eq(model.todo, _List_Nil)) ? _Utils_Tuple2(
							_Utils_update(
								model,
								{power: model.power - $author$project$Parameters$para.drawCardCost}),
							A2(
								$elm$random$Random$generate,
								$author$project$Message$DrawCard,
								$author$project$Model$cardGenerator(model))) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						if ((model.currentLevel === 2) && (model.currentRound <= 4)) {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						} else {
							if ($elm$core$List$length(model.hands) < 10) {
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{power: model.power - $author$project$Parameters$para.drawCardCost}),
									A2(
										$elm$random$Random$generate,
										$author$project$Message$DrawCard,
										$author$project$Model$cardGenerator(model)));
							} else {
								if ($elm$core$List$length(model.hands) >= 10) {
									var w = $author$project$Model$Warning('Can\'t draw a card right now:\nmaximum number of hands (10)\nreached.');
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{
												actionDescribe: _Utils_ap(
													model.actionDescribe,
													_List_fromArray(
														[w]))
											}),
										$elm$core$Platform$Cmd$none);
								} else {
									return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
								}
							}
						}
					}
				} else {
					var w = $author$project$Model$Warning('Can\'t draw a card right now:\npower insufficient.');
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								actionDescribe: _Utils_ap(
									model.actionDescribe,
									_List_fromArray(
										[w]))
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 'DrawCard':
				var c = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							hands: A2($elm$core$List$cons, c, model.hands)
						}),
					$elm$core$Platform$Cmd$none);
			case 'PlayCard':
				var card = msg.a;
				if (_Utils_cmp(card.cost, model.power) < 1) {
					if (_Utils_eq(model.selHex, $author$project$Model$SelHexOff)) {
						return A2($elm$core$List$member, card, $author$project$Card$targetCardlst) ? _Utils_Tuple2(
							_Utils_update(
								model,
								{
									actionDescribe: _Utils_ap(
										model.actionDescribe,
										_List_fromArray(
											[
												$author$project$Model$Warning('[' + (card.name + ']:\nPlease select a hexagon'))
											])),
									cardSelected: $author$project$Model$SelectCard(card),
									hands: A2($elm_community$list_extra$List$Extra$remove, card, model.hands),
									power: model.power - card.cost,
									selHex: $author$project$Model$SelHexOn
								}),
							$author$project$Ports$cardToMusic(
								A3($elm$core$String$replace, ' ', '', card.name))) : (((A2(
							$author$project$Update$judgeSummon,
							card,
							$elm$core$List$length(model.hands)) <= 10) && A2($elm$core$List$member, card, $author$project$Card$summonNum.a)) ? _Utils_Tuple2(
							_Utils_update(
								model,
								{
									cardSelected: $author$project$Model$SelectCard(card),
									hands: A2($elm_community$list_extra$List$Extra$remove, card, model.hands),
									power: model.power - card.cost,
									todo: _Utils_ap(
										model.todo,
										_List_fromArray(
											[
												_Utils_Tuple2(
												_Utils_Tuple2(true, card.action),
												card)
											]))
								}),
							$author$project$Ports$cardToMusic(
								A3($elm$core$String$replace, ' ', '', card.name))) : (((A2(
							$author$project$Update$judgeSummon,
							card,
							$elm$core$List$length(model.hands)) > 10) && A2($elm$core$List$member, card, $author$project$Card$summonNum.a)) ? _Utils_Tuple2(
							_Utils_update(
								model,
								{
									actionDescribe: _Utils_ap(
										model.actionDescribe,
										_List_fromArray(
											[
												$author$project$Model$Warning('Can\'t summon, maximum hand cards ( > 10 )!!!')
											]))
								}),
							$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
							_Utils_update(
								model,
								{
									cardSelected: $author$project$Model$SelectCard(card),
									hands: A2($elm_community$list_extra$List$Extra$remove, card, model.hands),
									power: model.power - card.cost,
									todo: _Utils_ap(
										model.todo,
										_List_fromArray(
											[
												_Utils_Tuple2(
												_Utils_Tuple2(true, card.action),
												card)
											]))
								}),
							$author$project$Ports$cardToMusic(
								A3($elm$core$String$replace, ' ', '', card.name)))));
					} else {
						var mc = $author$project$Model$toCardSelected(model);
						if (mc.$ === 'Just') {
							var c = mc.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										actionDescribe: _Utils_ap(
											model.actionDescribe,
											_List_fromArray(
												[
													$author$project$Model$Warning('[' + (c.name + ']:\nPlease select a hexagon'))
												]))
									}),
								$elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					}
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								actionDescribe: _Utils_ap(
									model.actionDescribe,
									_List_fromArray(
										[
											$author$project$Model$Warning('[' + (card.name + (']:\n' + 'Insufficient power!')))
										]))
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 'FreezeRet':
				var prob = msg.a;
				var rand = msg.b;
				var log = (_Utils_cmp(rand, prob) < 0) ? _List_fromArray(
					[
						$author$project$Model$Feedback('Luckily, the virus is frozen.')
					]) : _List_fromArray(
					[
						$author$project$Model$Feedback('Oops, the virus isn\'t frozen.')
					]);
				var behavior_ = model.behavior;
				var behavior = _Utils_update(
					behavior_,
					{
						virusEvolve: !(_Utils_cmp(rand, prob) < 0)
					});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							actionDescribe: _Utils_ap(model.actionDescribe, log),
							behavior: behavior
						}),
					$elm$core$Platform$Cmd$none);
			case 'SelectHex':
				var i = msg.a;
				var j = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							selectedHex: _Utils_Tuple2(i, j)
						}),
					$elm$core$Platform$Cmd$none);
			case 'MouseOver':
				var i = msg.a;
				var j = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							mouseOver: _Utils_Tuple2(i, j)
						}),
					$elm$core$Platform$Cmd$none);
			case 'MouseOverCard':
				var n = msg.a;
				return _Utils_eq(model.state, $author$project$Model$Playing) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{mouseOverCard: n}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'MouseOverCardToReplace':
				var n = msg.a;
				return _Utils_eq(model.state, $author$project$Model$Drawing) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{mouseOverCardToReplace: n}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'SelectCardToReplace':
				var c = msg.a;
				return A2($author$project$Update$replaceCard, c, model);
			case 'StartRound1':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{drawChance: 0, state: $author$project$Model$Playing}),
					$elm$core$Platform$Cmd$none);
			case 'Alert':
				var txt = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$Ports$sendMsg(txt));
			case 'KillTileVir':
				var _v2 = msg.a;
				var _v3 = _v2.a;
				var i = _v3.a;
				var j = _v3.b;
				var prob = _v2.b;
				var rand = msg.b;
				var virus_ = model.virus;
				var _v4 = $author$project$Geometry$converHextoTile(
					_Utils_Tuple2(i, j));
				var ti = _v4.a;
				var tj = _v4.b;
				var _v5 = (_Utils_cmp(prob, rand) < 1) ? _Utils_Tuple2(
					_Utils_update(
						virus_,
						{
							pos: A2(
								$elm$core$List$filter,
								function (x) {
									return !_Utils_eq(
										$author$project$Geometry$converHextoTile(x),
										_Utils_Tuple2(ti, tj));
								},
								virus_.pos)
						}),
					$author$project$Model$Feedback('Luckily, virus is killed')) : _Utils_Tuple2(
					virus_,
					$author$project$Model$Feedback('Oops, nothing changed'));
				var vir = _v5.a;
				var log = _v5.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							actionDescribe: _Utils_ap(
								model.actionDescribe,
								_List_fromArray(
									[log])),
							virus: vir
						}),
					$elm$core$Platform$Cmd$none);
			case 'JudgeVirPeo':
				var _v6 = msg.a;
				var _v7 = _v6.a;
				var i = _v7.a;
				var j = _v7.b;
				var prob = _v6.b;
				var rand = msg.b;
				var virus = model.virus;
				var tilelst = model.city.tilesIndex;
				var log = (_Utils_cmp(prob, rand) < 1) ? $author$project$Model$Feedback('Luckily, virus is killed') : $author$project$Model$Feedback('Sorry, people are killed');
				var city = model.city;
				var _v8 = $author$project$Geometry$converHextoTile(
					_Utils_Tuple2(i, j));
				var ti = _v8.a;
				var tj = _v8.b;
				var city_ = (_Utils_cmp(prob, rand) > 0) ? _Utils_update(
					city,
					{
						tilesIndex: A2(
							$elm$core$List$map,
							function (x) {
								return _Utils_eq(
									x.indice,
									_Utils_Tuple2(ti, tj)) ? _Utils_update(
									x,
									{dead: x.population + x.dead, population: 0, sick: 0}) : x;
							},
							tilelst)
					}) : city;
				var virus_ = (_Utils_cmp(prob, rand) < 1) ? _Utils_update(
					virus,
					{
						pos: A2(
							$elm$core$List$filter,
							function (x) {
								return !_Utils_eq(
									$author$project$Geometry$converHextoTile(x),
									_Utils_Tuple2(ti, tj));
							},
							virus.pos)
					}) : virus;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{city: city_, virus: virus_}),
					$elm$core$Platform$Cmd$none);
			case 'Click':
				switch (msg.a) {
					case 'home':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{state: $author$project$Model$HomePage}),
							$elm$core$Platform$Cmd$none);
					case 'card':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{state: $author$project$Model$CardPage}),
							$elm$core$Platform$Cmd$none);
					case 'startGame':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{state: $author$project$Model$Playing}),
							$elm$core$Platform$Cmd$none);
					default:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			default:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{virusInfo: !model.virusInfo}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$View$Document = F2(
	function (title, body) {
		return {body: body, title: title};
	});
var $author$project$Message$Click = function (a) {
	return {$: 'Click', a: a};
};
var $author$project$Message$LevelBegin = function (a) {
	return {$: 'LevelBegin', a: a};
};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$audio = _VirtualDom_node('audio');
var $elm$html$Html$br = _VirtualDom_node('br');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$loop = $elm$html$Html$Attributes$boolProperty('loop');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$html$Html$strong = _VirtualDom_node('strong');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$ViewMP$viewAll = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$html$Html$p,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('t1')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Age of Plague'),
					A2($elm$html$Html$br, _List_Nil, _List_Nil)
				])),
			A2(
			$elm$html$Html$p,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('t2')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('After the Apocalypse')
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container'),
					$elm$html$Html$Attributes$id('ctr')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('honeycomb ')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('hex'),
											$elm$html$Html$Attributes$id('tut1'),
											$elm$html$Html$Events$onClick(
											$author$project$Message$LevelBegin(1))
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('wrapper')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('hexagon color-1')
														]),
													_List_Nil)
												])),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('content')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$strong,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Tutorial1')
														]))
												]))
										])),
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('hex'),
											$elm$html$Html$Attributes$id('tut2'),
											$elm$html$Html$Events$onClick(
											$author$project$Message$LevelBegin(2))
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('wrapper')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('hexagon color-1')
														]),
													_List_Nil)
												])),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('content')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$strong,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Tutorial2')
														]))
												]))
										])),
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('hex'),
											$elm$html$Html$Attributes$id('city1'),
											$elm$html$Html$Events$onClick(
											$author$project$Message$LevelBegin(3))
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('wrapper')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('hexagon color-1')
														]),
													_List_Nil)
												])),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('content')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$strong,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('City 1')
														]))
												]))
										])),
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('hex'),
											$elm$html$Html$Attributes$id('city2'),
											$elm$html$Html$Events$onClick(
											$author$project$Message$LevelBegin(4))
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('wrapper')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('hexagon color-1')
														]),
													_List_Nil)
												])),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('content')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$strong,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('City 2')
														]))
												]))
										])),
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('hex'),
											$elm$html$Html$Attributes$id('city3'),
											$elm$html$Html$Events$onClick(
											$author$project$Message$LevelBegin(5))
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('wrapper')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('hexagon color-1')
														]),
													_List_Nil)
												])),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('content')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$strong,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('City 3')
														]))
												]))
										])),
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('hex'),
											$elm$html$Html$Attributes$id('endless'),
											$elm$html$Html$Events$onClick(
											$author$project$Message$LevelBegin(6))
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('wrapper')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('hexagon color-1')
														]),
													_List_Nil)
												])),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('content')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$strong,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Endless')
														]))
												]))
										])),
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('hex'),
											$elm$html$Html$Attributes$id('gallery'),
											$elm$html$Html$Events$onClick(
											$author$project$Message$Click('card'))
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('wrapper')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('hexagon color-1')
														]),
													_List_Nil)
												])),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('content')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$strong,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Collection')
														]))
												]))
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('shadows')
								]),
							_List_Nil)
						]))
				])),
			A2(
			$elm$html$Html$audio,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('bgm'),
					$elm$html$Html$Attributes$src('./assets/music/bgm1.mp3'),
					$elm$html$Html$Attributes$loop(true)
				]),
			_List_Nil)
		]));
var $author$project$ViewCards$backToHome = A2(
	$elm$html$Html$a,
	_List_fromArray(
		[
			$elm$html$Html$Events$onClick(
			$author$project$Message$Click('home')),
			$elm$html$Html$Attributes$id('cardsBack')
		]),
	_List_fromArray(
		[
			$elm$html$Html$text('Back')
		]));
var $author$project$ViewCards$filteredCards = _List_fromArray(
	[$author$project$Card$powerOverload, $author$project$Card$onStandby, $author$project$Card$coldWave, $author$project$Card$blizzard, $author$project$Card$rain, $author$project$Card$cut, $author$project$Card$megaCut, $author$project$Card$fubao, $author$project$Card$organClone, $author$project$Card$humanClone, $author$project$Card$megaClone, $author$project$Card$purification, $author$project$Card$sacrifice, $author$project$Card$resurgence, $author$project$Card$defenseline, $author$project$Card$hospital, $author$project$Card$quarantine, $author$project$Card$enhancedHealing, $author$project$Card$cellBroadcast, $author$project$Card$drought, $author$project$Card$warehouse, $author$project$Card$warmwave, $author$project$Card$goingViral, $author$project$Card$judgement, $author$project$Card$lowSoundWave, $author$project$Card$compulsoryMR, $author$project$Card$firstAid, $author$project$Card$medMob]);
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$ViewCards$viewSingleCard = F2(
	function (n, card) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('ctnr'),
					$elm$html$Html$Attributes$id(
					'c' + $elm$core$String$fromInt(n + 1)),
					A2($elm$html$Html$Attributes$attribute, 'data-info', card.describe),
					A2($elm$html$Html$Attributes$style, 'background-image', 'url(./assets/cardPNG/' + (card.name + '.png)'))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('story')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('info')
								]),
							_List_fromArray(
								[
									A2($elm$html$Html$h3, _List_Nil, _List_Nil)
								]))
						]))
				]));
	});
var $author$project$ViewCards$cardsArray = A2(
	$elm$core$List$map,
	function (_v0) {
		var n = _v0.a;
		var c = _v0.b;
		return A2($author$project$ViewCards$viewSingleCard, n, c);
	},
	A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, $author$project$ViewCards$filteredCards));
var $author$project$ViewCards$viewCard = _List_fromArray(
	[
		A2(
		$elm$html$Html$p,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('cardsTitle')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Cards Gallery')
			])),
		A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('wrpr')
			]),
		_Utils_ap(
			$author$project$ViewCards$cardsArray,
			_List_fromArray(
				[$author$project$ViewCards$backToHome])))
	]);
var $author$project$Message$Alert = function (a) {
	return {$: 'Alert', a: a};
};
var $author$project$Message$DrawACard = {$: 'DrawACard'};
var $author$project$ColorScheme$colorScheme = function (t) {
	switch (t.$) {
		case 'Minimum':
			return {bkg: '#191620', cdBkg: '#f2f2f0', cdStroke: '', cdText: 'black', consoleBkg: '#191620', consoleOpacity: 1.0, consoleStroke: '#4d454a', consoleText: '#86868d', constructionCaption: 'white', drawBkg: '#535455', drawStroke: 'white', guideBkg: '#a5bcc0', guideStroke: '#6f787e', guideTextColor: 'black', infBkg: 'purple', infOpacity: 0.8, infStroke: '#2e3f48', infText: 'white', levelProgressBkg: '#1e1e1f', levelProgressFill: '#e4fad2', levelProgressStroke: '#f6f6f6', nextRoundBkg: '#6a8ee2', powerColor: '#e4fad2', tile: '#acb0b1', tileStroke: 'white'};
		case 'Plain':
			return {bkg: '#435749', cdBkg: '#f2f2f0', cdStroke: '', cdText: 'black', consoleBkg: '#2a3645', consoleOpacity: 1.0, consoleStroke: '#4d454a', consoleText: '#86868d', constructionCaption: 'white', drawBkg: '#535455', drawStroke: 'white', guideBkg: '#a5bcc0', guideStroke: '#6f787e', guideTextColor: 'black', infBkg: 'purple', infOpacity: 0.8, infStroke: '#2e3f48', infText: 'white', levelProgressBkg: '#2c364b', levelProgressFill: '#e4fad2', levelProgressStroke: '#f6f6f6', nextRoundBkg: '#6a8ee2', powerColor: '#e4fad2', tile: '#627c12', tileStroke: 'white'};
		case 'Urban':
			return {bkg: '#071e26', cdBkg: '#f2f2f0', cdStroke: '', cdText: 'black', consoleBkg: 'black', consoleOpacity: 0.7, consoleStroke: '#4d454a', consoleText: '#23ff12', constructionCaption: 'white', drawBkg: '#535455', drawStroke: 'white', guideBkg: '#a5bcc0', guideStroke: '#6f787e', guideTextColor: 'black', infBkg: 'purple', infOpacity: 0.8, infStroke: '#2e3f48', infText: 'white', levelProgressBkg: '#131231', levelProgressFill: '#71c1d8', levelProgressStroke: '#f6f6f6', nextRoundBkg: '#6a8ee2', powerColor: '#e4fad2', tile: '#02c5ce', tileStroke: '#b957ce'};
		default:
			return {bkg: '#8698af', cdBkg: '#f2f2f0', cdStroke: '', cdText: 'black', consoleBkg: '#f8f8f8', consoleOpacity: 0.7, consoleStroke: '#97b2dc', consoleText: '#1c3981', constructionCaption: '#3276c2', drawBkg: '#535455', drawStroke: 'white', guideBkg: '#a5bcc0', guideStroke: '#6f787e', guideTextColor: 'black', infBkg: 'purple', infOpacity: 0.8, infStroke: '#2e3f48', infText: 'white', levelProgressBkg: '#1e1e1f', levelProgressFill: '#e4fad2', levelProgressStroke: '#f6f6f6', nextRoundBkg: '#6a8ee2', powerColor: '#e4fad2', tile: '#547286', tileStroke: 'yellow'};
	}
};
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$GameView$background = function (t) {
	var cs = $author$project$ColorScheme$colorScheme(t);
	return A2(
		$elm$svg$Svg$rect,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$x('0'),
				$elm$svg$Svg$Attributes$y('0'),
				$elm$svg$Svg$Attributes$width('1000'),
				$elm$svg$Svg$Attributes$height('600'),
				$elm$svg$Svg$Attributes$fill(cs.bkg)
			]),
		_List_Nil);
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$svg$Svg$Attributes$fontFamily = _VirtualDom_attribute('font-family');
var $elm$svg$Svg$Attributes$fontSize = _VirtualDom_attribute('font-size');
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $elm$svg$Svg$Attributes$xmlSpace = A2(_VirtualDom_attributeNS, 'http://www.w3.org/XML/1998/namespace', 'xml:space');
var $author$project$GameViewBasic$caption = F5(
	function (x, y, cstr, text, fontSize) {
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$fontSize(
					$elm$core$String$fromInt(fontSize)),
					$elm$svg$Svg$Attributes$fontFamily('Bree Serif'),
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(x)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(y)),
					$elm$svg$Svg$Attributes$fill(cstr),
					$elm$svg$Svg$Attributes$xmlSpace('preserve')
				]),
			_List_fromArray(
				[
					$elm$svg$Svg$text(text)
				]));
	});
var $elm$svg$Svg$image = $elm$svg$Svg$trustedNode('image');
var $author$project$GameViewBasic$onClick = function (message) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(message));
};
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$xlinkHref = function (value) {
	return A3(
		_VirtualDom_attributeNS,
		'http://www.w3.org/1999/xlink',
		'xlink:href',
		_VirtualDom_noJavaScriptUri(value));
};
var $author$project$GameViewButtons$drawButton = F4(
	function (x, y, w, model) {
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$author$project$GameViewBasic$onClick($author$project$Message$DrawACard)
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$image,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$xlinkHref('./assets/icons/card-draw.png'),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(w))
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(w)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat(w)),
							$elm$svg$Svg$Attributes$fill('transparent')
						]),
					_List_Nil)
				]));
	});
var $author$project$GameViewButtons$drawButton_ = A3($author$project$GameViewButtons$drawButton, $author$project$Parameters$para.drawButtonX, $author$project$Parameters$para.drawButtonY, $author$project$Parameters$para.drawButtonW);
var $author$project$GameView$endlessLevelProgress = function (model) {
	var r = model.currentRound;
	var digitNum = (r < 10) ? 1 : ((r < 100) ? 2 : 3);
	return A5(
		$author$project$GameViewBasic$caption,
		810 - (30 * (digitNum - 1)),
		$author$project$Parameters$para.houseButtonY + 45.0,
		'white',
		$elm$core$String$fromInt(model.currentRound),
		60);
};
var $elm$svg$Svg$animateTransform = $elm$svg$Svg$trustedNode('animateTransform');
var $elm$svg$Svg$Attributes$attributeName = _VirtualDom_attribute('attributeName');
var $elm$svg$Svg$Attributes$attributeType = _VirtualDom_attribute('attributeType');
var $elm$svg$Svg$Attributes$dur = _VirtualDom_attribute('dur');
var $elm$svg$Svg$Attributes$from = function (value) {
	return A2(
		_VirtualDom_attribute,
		'from',
		_VirtualDom_noJavaScriptUri(value));
};
var $elm$svg$Svg$Attributes$repeatCount = _VirtualDom_attribute('repeatCount');
var $elm$svg$Svg$Attributes$to = function (value) {
	return A2(
		_VirtualDom_attribute,
		'to',
		_VirtualDom_noJavaScriptUri(value));
};
var $elm$svg$Svg$Attributes$type_ = _VirtualDom_attribute('type');
var $author$project$SvgSrc$skeletonHand = F3(
	function (x, y, width) {
		return A2(
			$elm$svg$Svg$svg,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$image,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$xlinkHref('./assets/guide/SkeletonHand_.png'),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(width))
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$animateTransform,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$attributeName('transform'),
									$elm$svg$Svg$Attributes$attributeType('XML'),
									$elm$svg$Svg$Attributes$type_('translate'),
									$elm$svg$Svg$Attributes$from('0 0 '),
									$elm$svg$Svg$Attributes$to('20 0'),
									$elm$svg$Svg$Attributes$dur('1s'),
									$elm$svg$Svg$Attributes$repeatCount('indefinite')
								]),
							_List_Nil)
						]))
				]));
	});
var $author$project$SvgSrc$hand2IcStart = A3($author$project$SvgSrc$skeletonHand, $author$project$Parameters$para.icgsx - 180.0, $author$project$Parameters$para.icgsy + (0.2 * $author$project$Parameters$para.icgsa), 160.0);
var $author$project$GameViewButtons$houseButton = F3(
	function (x, y, w) {
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$author$project$GameViewBasic$onClick(
					$author$project$Message$Click('home'))
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$image,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$xlinkHref('./assets/icons/house.png'),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(w))
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(w)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat(w)),
							$elm$svg$Svg$Attributes$fill('transparent')
						]),
					_List_Nil)
				]));
	});
var $author$project$GameViewButtons$houseButton_ = A3($author$project$GameViewButtons$houseButton, $author$project$Parameters$para.houseButtonX, $author$project$Parameters$para.houseButtonY, $author$project$Parameters$para.houseButtonW);
var $author$project$Message$StartRound1 = {$: 'StartRound1'};
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $author$project$Geometry$polyPoint = F2(
	function (l1, l2) {
		if ($elm$core$List$isEmpty(l1) || $elm$core$List$isEmpty(l2)) {
			return '';
		} else {
			var head2 = A2(
				$elm$core$Maybe$withDefault,
				0.0,
				$elm$core$List$head(l2));
			var s2 = $elm$core$String$fromFloat(head2);
			var head1 = A2(
				$elm$core$Maybe$withDefault,
				0.0,
				$elm$core$List$head(l1));
			var s1 = $elm$core$String$fromFloat(head1);
			var s = s1 + (',' + (s2 + ' '));
			return _Utils_ap(
				s,
				A2(
					$author$project$Geometry$polyPoint,
					A2($elm$core$List$drop, 1, l1),
					A2($elm$core$List$drop, 1, l2)));
		}
	});
var $elm$svg$Svg$polyline = $elm$svg$Svg$trustedNode('polyline');
var $elm$svg$Svg$Attributes$rx = _VirtualDom_attribute('rx');
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $author$project$GameViewButtons$icGameStart = function (model) {
	var t = model.theme;
	var cs = $author$project$ColorScheme$colorScheme(t);
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$author$project$GameViewBasic$onClick($author$project$Message$StartRound1)
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$polyline,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$points(
						A2(
							$author$project$Geometry$polyPoint,
							_List_fromArray(
								[
									$author$project$Parameters$para.icgsx,
									$author$project$Parameters$para.icgsx,
									$author$project$Parameters$para.icgsx + (($elm$core$Basics$sqrt(3) / 2.0) * $author$project$Parameters$para.icgsa),
									$author$project$Parameters$para.icgsx
								]),
							_List_fromArray(
								[$author$project$Parameters$para.icgsy, $author$project$Parameters$para.icgsy + $author$project$Parameters$para.icgsa, $author$project$Parameters$para.icgsy + (0.5 * $author$project$Parameters$para.icgsa), $author$project$Parameters$para.icgsy]))),
						$elm$svg$Svg$Attributes$rx('4'),
						$elm$svg$Svg$Attributes$stroke('white'),
						$elm$svg$Svg$Attributes$strokeWidth(
						$elm$core$String$fromFloat($author$project$Parameters$para.icgssw)),
						$elm$svg$Svg$Attributes$fill('transparent')
					]),
				_List_Nil)
			]));
};
var $author$project$GameView$livingPopulationInfo = function (model) {
	var y = (model.currentLevel !== 6) ? 410.0 : 418.0;
	var x = (model.currentLevel !== 6) ? 750.0 : 780.0;
	var win = function () {
		var _v0 = model.currentLevel;
		switch (_v0) {
			case 3:
				return 140;
			case 4:
				return 160;
			case 5:
				return 80;
			case 6:
				return 50;
			default:
				return 0;
		}
	}();
	var living = $author$project$Tile$sumPopulation(model.city);
	var str = 'Living population/objective: ' + ($elm$core$String$fromInt(living) + ('/' + $elm$core$String$fromInt(win)));
	var fs = (model.currentLevel !== 6) ? 15 : 13;
	var color = (_Utils_cmp(
		living,
		$elm$core$Basics$floor(1.2 * win)) < 0) ? '#a90b08' : ((_Utils_cmp(
		living,
		$elm$core$Basics$floor(1.5 * win)) < 0) ? '#fd2d29' : ((_Utils_cmp(living, win * 2) < 0) ? '#fb8d8d' : 'white'));
	return A5($author$project$GameViewBasic$caption, x, y, color, str, fs);
};
var $author$project$Message$NextRound = {$: 'NextRound'};
var $author$project$GameViewButtons$nextButton = F3(
	function (x, y, w) {
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$author$project$GameViewBasic$onClick($author$project$Message$NextRound)
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$image,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$xlinkHref('./assets/icons/next-button.png'),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(w))
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(w)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat(w)),
							$elm$svg$Svg$Attributes$fill('transparent')
						]),
					_List_Nil)
				]));
	});
var $author$project$GameViewButtons$nextButton_ = A3($author$project$GameViewButtons$nextButton, $author$project$Parameters$para.nextButtonX, $author$project$Parameters$para.nextButtonY, $author$project$Parameters$para.nextButtonW);
var $author$project$GameView$powerIncInfo = function (model) {
	return A5(
		$author$project$GameViewBasic$caption,
		$author$project$Parameters$para.pix + 30.0,
		$author$project$Parameters$para.piy + 20.0,
		$author$project$ColorScheme$colorScheme(model.theme).powerColor,
		'/' + ($elm$core$String$fromInt(model.maxPower) + (', +' + ($elm$core$String$fromInt($author$project$Parameters$para.basicPowerInc) + ' per round.'))),
		10);
};
var $author$project$GameView$powerInfo = function (model) {
	return A5(
		$author$project$GameViewBasic$caption,
		$author$project$Parameters$para.pix,
		$author$project$Parameters$para.piy,
		$author$project$ColorScheme$colorScheme(model.theme).powerColor,
		$elm$core$String$fromInt(model.power),
		$author$project$Parameters$para.pifs);
};
var $author$project$GameView$cityInfo = function (model) {
	var _v0 = model.currentLevel;
	switch (_v0) {
		case 3:
			return 'Atlanta is a city with plain terrain and a \ntemperate climate, which makes it highly \nsusceptible to  viruses. Fortunately, people \nfound some nano-virus technologies from \na virus research institute before the \nnuclear war. With special programs, the\n nano-virus is capable of killing some\nmicroorganisms, including viruses.\n\n========SPECIAL CARDS==========\n🃟 Defensive Line\n🃟 Sacrifice \n🃟 Going Viral\n🃟 Judgement\n\n========OBJECTIVE==========\nNo less than 140 surviving population.\n';
		case 4:
			return 'Before the devastating war, Amber was a\n "Tech City" whose citizens were mainly\n made up of researchers and scholars.\nFortunately, Amber didn\'t take much \ndamage in the war. Therefore, it kept\n many cutting-edge technologies and\n later became the most populated area\n in the world. To make up for the labor\n loss, a highly advanced cloning system\n was developed.\n\n========SPECIAL CARDS==========\n🃟 Mega Clone \n🃟 Organ Clone\n🃟 Resurgence\n🃟 Purification\n\n========OBJECTIVE==========\nNo less than 160 surviving population.\n';
		case 5:
			return 'Welcome to St.Petersburg, the \nnorthernmost city with a population over\n 50,000. The climate here is extremely\n cold and dry. The resources harvested \nfrom land are very limited. Therefore, \npeople created a weather control system\n to adapt to the environment.\n\n========SPECIAL CARDS==========\n🃟 Blizzard \n🃟 Drought\n\n=========OBJECTIVE==========\nNo less than 80 surviving population.\n';
		default:
			return '';
	}
};
var $elm$core$String$lines = _String_lines;
var $author$project$GameView$cityInfoText = function (model) {
	var t = model.theme;
	var indexed = A2(
		$elm$core$List$indexedMap,
		$elm$core$Tuple$pair,
		$elm$core$String$lines(
			$author$project$GameView$cityInfo(model)));
	var cs = $author$project$ColorScheme$colorScheme(t);
	return A2(
		$elm$core$List$map,
		function (_v1) {
			var x = _v1.a;
			var y = _v1.b;
			var str = _v1.c;
			return A5($author$project$GameViewBasic$caption, x, y, cs.consoleText, str, 12);
		},
		A2(
			$elm$core$List$map,
			function (_v0) {
				var n = _v0.a;
				var str = _v0.b;
				return _Utils_Tuple3($author$project$Parameters$para.inflm, $author$project$Parameters$para.inftm + ($author$project$Parameters$para.clh * n), str);
			},
			indexed));
};
var $elm$svg$Svg$Attributes$fillOpacity = _VirtualDom_attribute('fill-opacity');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $author$project$GameView$renderCityInfo = function (model) {
	var y = $author$project$Parameters$para.ictm;
	var x = $author$project$Parameters$para.iclm + (5.0 * ($author$project$Parameters$para.icw + $author$project$Parameters$para.icg));
	var w = (1000.0 - x) - ($author$project$Parameters$para.icg * 0.5);
	var txt = $author$project$GameView$cityInfoText(model);
	var t = model.theme;
	var h = ((2.0 * 1.6) * $author$project$Parameters$para.icw) + $author$project$Parameters$para.icg;
	var vbArg = '0 0 ' + ($elm$core$String$fromFloat(w) + (' ' + $elm$core$String$fromFloat(h)));
	var cs = $author$project$ColorScheme$colorScheme(t);
	var bkg = A2(
		$elm$svg$Svg$rect,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromFloat(w)),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromFloat(h)),
				$elm$svg$Svg$Attributes$stroke(cs.consoleStroke),
				$elm$svg$Svg$Attributes$strokeWidth('4'),
				$elm$svg$Svg$Attributes$fill(cs.consoleBkg),
				$elm$svg$Svg$Attributes$fillOpacity(
				$elm$core$String$fromFloat(cs.consoleOpacity))
			]),
		_List_Nil);
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$x(
				$elm$core$String$fromFloat(x)),
				$elm$svg$Svg$Attributes$y(
				$elm$core$String$fromFloat(y)),
				$elm$svg$Svg$Attributes$viewBox(vbArg),
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromFloat(w)),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromFloat(h))
			]),
		A2($elm$core$List$cons, bkg, txt));
};
var $author$project$GameView$ml2s = function (m) {
	switch (m.$) {
		case 'Warning':
			var str = m.a;
			return $elm$core$List$reverse(
				$elm$core$String$lines('⚠' + (' ' + str)));
		case 'CardPlayed':
			var c = m.a;
			return $elm$core$List$reverse(
				$elm$core$String$lines('💬 ' + ('[' + (c.name + (']: \n' + c.describe)))));
		case 'Feedback':
			var str = m.a;
			return $elm$core$List$reverse(
				$elm$core$String$lines('⨀ ' + str));
		default:
			var c = m.a;
			var str = m.b;
			return $elm$core$List$reverse(
				$elm$core$String$lines('💬 ' + ('[' + (c.name + (']: \n' + str)))));
	}
};
var $author$project$GameView$consoleText = function (model) {
	var tm = ($author$project$Parameters$para.hctm + (1.6 * $author$project$Parameters$para.hcw)) + 10.0;
	var t = model.theme;
	var myLog = $elm$core$List$reverse(model.actionDescribe);
	var lm = $author$project$Parameters$para.consolelm;
	var indexed = A2(
		$elm$core$List$indexedMap,
		$elm$core$Tuple$pair,
		A3(
			$elm$core$List$foldl,
			function (x) {
				return function (y) {
					return _Utils_ap(x, y);
				};
			},
			_List_Nil,
			A2($elm$core$List$map, $author$project$GameView$ml2s, myLog)));
	var indexedLength = $elm$core$List$length(indexed);
	var cs = $author$project$ColorScheme$colorScheme(t);
	var lt = A2(
		$elm$core$List$map,
		function (_v1) {
			var y = _v1.a;
			var str = _v1.b;
			return A5($author$project$GameViewBasic$caption, lm * 0.3, y, cs.consoleText, str, $author$project$Parameters$para.consolefs);
		},
		A2(
			$elm$core$List$map,
			function (_v0) {
				var n = _v0.a;
				var str = _v0.b;
				return _Utils_Tuple2((indexedLength - n) * $author$project$Parameters$para.consolelp, str);
			},
			indexed));
	return lt;
};
var $author$project$GameView$renderConsole = function (model) {
	var w = $author$project$Parameters$para.consoleWidth;
	var tm = ($author$project$Parameters$para.hctm + (1.6 * $author$project$Parameters$para.hcw)) + 20.0;
	var t = model.theme;
	var lm = $author$project$Parameters$para.consolelm;
	var h = ($author$project$Parameters$para.drawButtonY - 20.0) - tm;
	var vbArg = '0 0 ' + ($elm$core$String$fromFloat(w) + (' ' + $elm$core$String$fromFloat(h)));
	var cs = $author$project$ColorScheme$colorScheme(t);
	var consoleBkg = A2(
		$elm$svg$Svg$rect,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromFloat(w)),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromFloat(h)),
				$elm$svg$Svg$Attributes$stroke(cs.consoleStroke),
				$elm$svg$Svg$Attributes$strokeWidth('4'),
				$elm$svg$Svg$Attributes$fill(cs.consoleBkg),
				$elm$svg$Svg$Attributes$fillOpacity(
				$elm$core$String$fromFloat(cs.consoleOpacity))
			]),
		_List_Nil);
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$x(
				$elm$core$String$fromFloat(lm)),
				$elm$svg$Svg$Attributes$y(
				$elm$core$String$fromFloat(tm)),
				$elm$svg$Svg$Attributes$viewBox(vbArg),
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromFloat(w)),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromFloat(h))
			]),
		_Utils_ap(
			_List_fromArray(
				[consoleBkg]),
			$author$project$GameView$consoleText(model)));
};
var $author$project$GameViewButtons$doorButton = F4(
	function (m, x, y, w) {
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$author$project$GameViewBasic$onClick(m)
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$image,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$xlinkHref('./assets/icons/open-gate.png'),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(w))
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(w)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat(w)),
							$elm$svg$Svg$Attributes$fill('transparent')
						]),
					_List_Nil)
				]));
	});
var $author$project$GameViewButtons$finishGateButton = function (m) {
	return A4($author$project$GameViewButtons$doorButton, m, $author$project$Parameters$para.fgX, $author$project$Parameters$para.fgY, $author$project$Parameters$para.fgW);
};
var $author$project$GameViewButtons$houseButtonCentral = A3($author$project$GameViewButtons$houseButton, $author$project$Parameters$para.houseButtonCX, $author$project$Parameters$para.houseButtonCY, $author$project$Parameters$para.houseButtonCW);
var $author$project$GameView$renderFinished = F2(
	function (n, model) {
		var next = (n < 6) ? _List_fromArray(
			[
				$author$project$GameViewButtons$finishGateButton(
				$author$project$Message$LevelBegin(model.currentLevel + 1))
			]) : _List_Nil;
		var home = $author$project$GameViewButtons$houseButtonCentral;
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$svg,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$viewBox('0 0 1000 600'),
							$elm$svg$Svg$Attributes$height('600'),
							$elm$svg$Svg$Attributes$width('1000'),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(model.screenSize.a)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat(model.screenSize.b))
						]),
					_Utils_ap(
						_List_fromArray(
							[home]),
						next))
				]));
	});
var $author$project$Message$tutorial = _List_fromArray(
	[
		_List_fromArray(
		['Welcome to the tutorial!\nIn the tutorial, you will learn the basics about this game.\nPlease click on the card [MegaClone] now.', 'After you had played the card, the card\'s action was\nlogged in the console. Now, please click next round.', 'On a tile, different kinds of buildings could co-exist but the same\nkind can\'t, please try the rest of the cards. Concerning the\npopulation distribution, please notice the numbers on the map.', 'Costs of card is demonstrated on the card. Playing a\ncard costs your power. Your power is displayed on the left\ntop corner. It would accumulate over turns.\nNow, please click next round.', 'The \'deck-like\' pattern on the left down corner\nis draw button. Drawing a card costs 2 power.\nNow please click draw.', 'Congrats! You\'ve finished tutorial1.\nNow please click next level to proceed to next level.']),
		_List_fromArray(
		['In the previous tutorial, you\'ve learned about cards and entering\nnext rounds. The colored stuff on the map is the [virus]. For details\n(spread pattern, special skills) about the virus, click the [i] button\non the right. Now, please try the button and the cards.\nOr you could just skip to next round', 'As you might have noticed, [MegaCut] clears virus on one\ntile while [cut] only clear a hexagon. Now please use [Going Viral]', 'Anti-virus (always blue) can be released by player, it exterminate\nlocal virus units and could survive three rounds\nPlease proceed to next turn to witness its spread.', 'Win or lose is decided by the remaining population after\ncertain rounds (except the endless mode). In this\ntutorial, however, you have to eliminate all the virus\non the map. Hint: remember to draw new cards and accumulate\n resource (power & economy) by clicking next round.', 'Please be aware of populationFlow between tiles. In each\nround, exchange of at most 2 population (including\npatients) occurs between neighboring tiles.\nPlease keep on fighting!', 'Great job!\nClick next turn to finish the tutorial.'])
	]);
var $author$project$Action$createGuide = function (model) {
	var str = A3(
		$elm$core$List$foldl,
		function (x) {
			return function (y) {
				return _Utils_ap(x, y);
			};
		},
		_List_Nil,
		A2($elm$core$List$take, model.currentLevel, $author$project$Message$tutorial));
	var card = A2($elm$core$List$map, $elm$core$Tuple$second, model.todo);
	var _v0 = model.currentLevel;
	switch (_v0) {
		case 1:
			return (_Utils_eq(
				model.hands,
				_List_fromArray(
					[$author$project$Card$megaClone])) && (model.currentRound === 1)) ? A2($author$project$Geometry$getElement, 1, str) : ((_Utils_eq(
				card,
				_List_fromArray(
					[$author$project$Card$megaClone])) && (model.currentRound === 1)) ? A2($author$project$Geometry$getElement, 2, str) : ((($elm$core$List$length(model.hands) > 0) && (model.currentRound === 2)) ? A2($author$project$Geometry$getElement, 3, str) : ((_Utils_eq(model.hands, _List_Nil) && (model.currentRound === 2)) ? A2($author$project$Geometry$getElement, 4, str) : ((_Utils_eq(model.hands, _List_Nil) && (model.currentRound === 3)) ? A2($author$project$Geometry$getElement, 5, str) : A2($author$project$Geometry$getElement, 6, str)))));
		case 2:
			return (model.currentRound === 1) ? A2($author$project$Geometry$getElement, 1, str) : ((model.currentRound === 2) ? A2($author$project$Geometry$getElement, 2, str) : ((model.currentRound < 5) ? A2($author$project$Geometry$getElement, 3, str) : (((model.currentRound !== 6) && (!$elm$core$List$isEmpty(model.virus.pos))) ? A2($author$project$Geometry$getElement, 4, str) : ((model.currentRound === 6) ? A2($author$project$Geometry$getElement, 5, str) : A2($author$project$Geometry$getElement, 6, str)))));
		default:
			return _List_Nil;
	}
};
var $elm$svg$Svg$defs = $elm$svg$Svg$trustedNode('defs');
var $elm$svg$Svg$Attributes$filter = _VirtualDom_attribute('filter');
var $author$project$Model$lr = function (model) {
	return _Utils_Tuple2(model.currentLevel, model.currentRound);
};
var $elm$svg$Svg$Attributes$dx = _VirtualDom_attribute('dx');
var $elm$svg$Svg$Attributes$dy = _VirtualDom_attribute('dy');
var $elm$svg$Svg$feColorMatrix = $elm$svg$Svg$trustedNode('feColorMatrix');
var $elm$svg$Svg$feGaussianBlur = $elm$svg$Svg$trustedNode('feGaussianBlur');
var $elm$svg$Svg$feMerge = $elm$svg$Svg$trustedNode('feMerge');
var $elm$svg$Svg$feMergeNode = $elm$svg$Svg$trustedNode('feMergeNode');
var $elm$svg$Svg$feOffset = $elm$svg$Svg$trustedNode('feOffset');
var $elm$svg$Svg$filter = $elm$svg$Svg$trustedNode('filter');
var $elm$svg$Svg$Attributes$filterUnits = _VirtualDom_attribute('filterUnits');
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $elm$svg$Svg$Attributes$in_ = _VirtualDom_attribute('in');
var $elm$svg$Svg$Attributes$result = _VirtualDom_attribute('result');
var $elm$svg$Svg$Attributes$stdDeviation = _VirtualDom_attribute('stdDeviation');
var $elm$svg$Svg$Attributes$values = function (value) {
	return A2(
		_VirtualDom_attribute,
		'values',
		_VirtualDom_noJavaScriptUri(value));
};
var $author$project$SvgDefs$sh2 = A2(
	$elm$svg$Svg$filter,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$x('-50%'),
			$elm$svg$Svg$Attributes$y('-50%'),
			$elm$svg$Svg$Attributes$width('200%'),
			$elm$svg$Svg$Attributes$height('200%'),
			$elm$svg$Svg$Attributes$filterUnits('objectBoundingBox'),
			$elm$svg$Svg$Attributes$id('shadow-filter')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$feOffset,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$dx('0'),
					$elm$svg$Svg$Attributes$dy('4'),
					$elm$svg$Svg$Attributes$in_('SourceAlpha'),
					$elm$svg$Svg$Attributes$result('shadowOffsetOuter1')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$feGaussianBlur,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$stdDeviation('10'),
					$elm$svg$Svg$Attributes$in_('shadowOffsetOuter1')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$feColorMatrix,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$values('0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.2 0'),
					$elm$svg$Svg$Attributes$in_('shadowBlurOuter1'),
					$elm$svg$Svg$Attributes$type_('matrix'),
					$elm$svg$Svg$Attributes$result('shadowMatrixOuter1')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$feMerge,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$feMergeNode,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$in_('shadowMatrixOuter1')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$feMergeNode,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$in_('SourceGraphic')
						]),
					_List_Nil)
				]))
		]));
var $author$project$GameView$renderGuide = function (model) {
	var y_ = A2(
		$elm$core$List$member,
		$author$project$Model$lr(model),
		_List_fromArray(
			[
				_Utils_Tuple2(1, 1),
				_Utils_Tuple2(1, 2),
				_Utils_Tuple2(1, 3)
			])) ? ($author$project$Parameters$para.conbot - 40.0) : ($author$project$Parameters$para.conbot - 40.0);
	var width = 500.0;
	var t = model.theme;
	var lstr = A3(
		$elm$core$List$foldl,
		function (x) {
			return function (y) {
				return _Utils_ap(x, y);
			};
		},
		_List_Nil,
		A2(
			$elm$core$List$map,
			$elm$core$String$lines,
			$author$project$Action$createGuide(model)));
	var length = $elm$core$List$length(lstr);
	var height = 10.0 + (length * 20);
	var cs = $author$project$ColorScheme$colorScheme(t);
	var bkg = A2(
		$elm$svg$Svg$svg,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$defs,
				_List_Nil,
				_List_fromArray(
					[$author$project$SvgDefs$sh2])),
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(width)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(height)),
						$elm$svg$Svg$Attributes$fill(cs.guideBkg),
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat($author$project$Parameters$para.clp + 230.0)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(y_)),
						$elm$svg$Svg$Attributes$rx('5'),
						$elm$svg$Svg$Attributes$strokeWidth('2'),
						$elm$svg$Svg$Attributes$stroke(cs.guideStroke),
						$elm$svg$Svg$Attributes$filter('url(#shadow-filter)')
					]),
				_List_Nil)
			]));
	return ((model.currentLevel === 1) || (model.currentLevel === 2)) ? A2(
		$elm$core$List$cons,
		bkg,
		A2(
			$elm$core$List$map,
			function (_v1) {
				var x = _v1.a;
				var y = _v1.b;
				var str = _v1.c;
				return A5($author$project$GameViewBasic$caption, x + 250.0, y + 20.0, cs.guideTextColor, str, 16);
			},
			A2(
				$elm$core$List$map,
				function (_v0) {
					var n = _v0.a;
					var str = _v0.b;
					return _Utils_Tuple3($author$project$Parameters$para.clp, y_ + ($author$project$Parameters$para.clh * n), str);
				},
				A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, lstr)))) : _List_Nil;
};
var $author$project$SvgSrc$revSkeletonHand = F3(
	function (x, y, width) {
		return A2(
			$elm$svg$Svg$svg,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$image,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$xlinkHref('./assets/guide/RevSkeletonHand_.png'),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(width))
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$animateTransform,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$attributeName('transform'),
									$elm$svg$Svg$Attributes$attributeType('XML'),
									$elm$svg$Svg$Attributes$type_('translate'),
									$elm$svg$Svg$Attributes$from('0 0 '),
									$elm$svg$Svg$Attributes$to('-20 0'),
									$elm$svg$Svg$Attributes$dur('1s'),
									$elm$svg$Svg$Attributes$repeatCount('indefinite')
								]),
							_List_Nil)
						]))
				]));
	});
var $author$project$SvgSrc$hand2Draw = A3($author$project$SvgSrc$revSkeletonHand, ($author$project$Parameters$para.drawButtonX + $author$project$Parameters$para.drawButtonW) + 30.0, $author$project$Parameters$para.drawButtonY + 10.0, 100.0);
var $author$project$SvgSrc$hand2FirstCard = function (model) {
	var x = (($author$project$Parameters$para.hclm + $author$project$Parameters$para.hcdi) + ($author$project$Parameters$para.hcw + $author$project$Parameters$para.hcg)) + 30.0;
	return A3($author$project$SvgSrc$revSkeletonHand, x, 45.0, 100.0);
};
var $author$project$SvgSrc$hand2NextRound = A3($author$project$SvgSrc$revSkeletonHand, ($author$project$Parameters$para.nextButtonX + $author$project$Parameters$para.nextButtonW) + 30.0, $author$project$Parameters$para.nextButtonY + 10.0, 100.0);
var $author$project$GameView$renderHand = function (model) {
	var toNext = (A2(
		$elm$core$List$member,
		$author$project$Model$lr(model),
		_List_fromArray(
			[
				_Utils_Tuple2(1, 1),
				_Utils_Tuple2(1, 2),
				_Utils_Tuple2(2, 1),
				_Utils_Tuple2(2, 2),
				_Utils_Tuple2(2, 3),
				_Utils_Tuple2(2, 4)
			])) && $elm$core$List$isEmpty(model.hands)) ? _List_fromArray(
		[$author$project$SvgSrc$hand2NextRound]) : _List_Nil;
	var toDraw = (A2(
		$elm$core$List$member,
		$author$project$Model$lr(model),
		_List_fromArray(
			[
				_Utils_Tuple2(1, 3)
			])) && $elm$core$List$isEmpty(model.hands)) ? _List_fromArray(
		[$author$project$SvgSrc$hand2Draw]) : _List_Nil;
	var toCard = ((_Utils_eq(
		$author$project$Model$lr(model),
		_Utils_Tuple2(1, 1)) || _Utils_eq(
		$author$project$Model$lr(model),
		_Utils_Tuple2(1, 2))) && (!$elm$core$List$isEmpty(model.hands))) ? _List_fromArray(
		[
			$author$project$SvgSrc$hand2FirstCard(model)
		]) : _List_Nil;
	return _Utils_ap(
		toCard,
		_Utils_ap(toNext, toDraw));
};
var $author$project$Card$cardComparison = F2(
	function (c1, c2) {
		return (_Utils_cmp(c1.cost, c2.cost) < 0) ? $elm$core$Basics$LT : ((_Utils_cmp(c1.cost, c2.cost) > 0) ? $elm$core$Basics$GT : ((_Utils_cmp(
			$elm$core$String$length(c1.name),
			$elm$core$String$length(c2.name)) > 0) ? $elm$core$Basics$GT : ((_Utils_cmp(
			$elm$core$String$length(c1.name),
			$elm$core$String$length(c2.name)) < 0) ? $elm$core$Basics$LT : $elm$core$Basics$EQ)));
	});
var $author$project$GameViewCards$renderCard = F5(
	function (width, n, x, y, c) {
		return A2(
			$elm$svg$Svg$svg,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$fill('black'),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(width)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat(1.6 * width))
						]),
					_List_Nil)
				]));
	});
var $author$project$Message$MouseOverCard = function (a) {
	return {$: 'MouseOverCard', a: a};
};
var $author$project$Message$PlayCard = function (a) {
	return {$: 'PlayCard', a: a};
};
var $author$project$GameViewBasic$onOver = function (message) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseover',
		$elm$json$Json$Decode$succeed(message));
};
var $author$project$GameViewCards$renderCardFilm = F6(
	function (width, n, x, y, c, model) {
		var w = $author$project$Parameters$para.cdw;
		var t = model.theme;
		var indexed = A2(
			$elm$core$List$indexedMap,
			$elm$core$Tuple$pair,
			$elm$core$String$lines(c.fd));
		var indexedLength = $elm$core$List$length(indexed);
		var h = (indexedLength * $author$project$Parameters$para.cdlp) + $author$project$Parameters$para.cdm;
		var vbArg = '0 0 ' + ($elm$core$String$fromFloat(w) + (' ' + $elm$core$String$fromFloat(h)));
		var cs = $author$project$ColorScheme$colorScheme(t);
		var lt = A2(
			$elm$core$List$map,
			function (_v1) {
				var y_ = _v1.a;
				var str = _v1.b;
				return A5($author$project$GameViewBasic$caption, $author$project$Parameters$para.cdm, y_ + (0.55 * $author$project$Parameters$para.cdm), cs.cdText, str, $author$project$Parameters$para.cdfs);
			},
			A2(
				$elm$core$List$map,
				function (_v0) {
					var n_ = _v0.a;
					var str = _v0.b;
					return _Utils_Tuple2($author$project$Parameters$para.cdm + (n_ * $author$project$Parameters$para.cdlp), str);
				},
				indexed));
		var cdy = y + (1.6 * $author$project$Parameters$para.hcw);
		var cdx = x + (0.25 * $author$project$Parameters$para.hcw);
		var cardDescription = A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(cdx)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(cdy)),
					$elm$svg$Svg$Attributes$viewBox(vbArg),
					$elm$svg$Svg$Attributes$width(
					$elm$core$String$fromFloat(w)),
					$elm$svg$Svg$Attributes$height(
					$elm$core$String$fromFloat(h))
				]),
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$rect,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$width(
								$elm$core$String$fromFloat(w)),
								$elm$svg$Svg$Attributes$height(
								$elm$core$String$fromFloat(h)),
								$elm$svg$Svg$Attributes$x('0'),
								$elm$svg$Svg$Attributes$y('0'),
								$elm$svg$Svg$Attributes$fill(cs.cdBkg),
								$elm$svg$Svg$Attributes$fillOpacity('0.8')
							]),
						_List_Nil)
					]),
				lt));
		var tint = _Utils_eq(n, model.mouseOverCard) ? A2(
			$elm$svg$Svg$svg,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$fill('yellow'),
							$elm$svg$Svg$Attributes$fillOpacity('0.3'),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(width)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat(1.6 * width))
						]),
					_List_Nil),
					cardDescription
				])) : A2($elm$svg$Svg$rect, _List_Nil, _List_Nil);
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$author$project$GameViewBasic$onClick(
					$author$project$Message$PlayCard(c)),
					$author$project$GameViewBasic$onOver(
					$author$project$Message$MouseOverCard(n))
				]),
			_List_fromArray(
				[
					tint,
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$fill('white'),
							$elm$svg$Svg$Attributes$fillOpacity('0.0'),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(width)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat(1.6 * width))
						]),
					_List_Nil)
				]));
	});
var $author$project$Card$toPngUrl = function (c) {
	return './assets/cardPNG/' + (A3($elm$core$String$replace, ' ', '', c.name) + '.png');
};
var $author$project$GameViewCards$renderCardPng = F4(
	function (width, x, y, c) {
		return A2(
			$elm$svg$Svg$svg,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$image,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$xlinkHref(
							$author$project$Card$toPngUrl(c)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(width)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat(1.6 * width))
						]),
					_List_Nil)
				]));
	});
var $elm$core$List$sortWith = _List_sortWith;
var $author$project$GameViewCards$renderHands = function (model) {
	var hands = A2($elm$core$List$sortWith, $author$project$Card$cardComparison, model.hands);
	var indexed = A2(
		$elm$core$List$map,
		function (_v6) {
			var n = _v6.a;
			var c = _v6.b;
			return _Utils_Tuple3(
				n,
				_Utils_Tuple2(($author$project$Parameters$para.hclm + $author$project$Parameters$para.hcdi) + (($author$project$Parameters$para.hcw + $author$project$Parameters$para.hcg) * n), $author$project$Parameters$para.hctm),
				c);
		},
		A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, hands));
	return _Utils_ap(
		A2(
			$elm$core$List$map,
			function (_v0) {
				var n = _v0.a;
				var _v1 = _v0.b;
				var x = _v1.a;
				var y = _v1.b;
				var c = _v0.c;
				return A5($author$project$GameViewCards$renderCard, $author$project$Parameters$para.hcw, n, x, y, c);
			},
			indexed),
		_Utils_ap(
			A2(
				$elm$core$List$map,
				function (_v2) {
					var n = _v2.a;
					var _v3 = _v2.b;
					var x = _v3.a;
					var y = _v3.b;
					var c = _v2.c;
					return A4($author$project$GameViewCards$renderCardPng, $author$project$Parameters$para.hcw, x, y, c);
				},
				indexed),
			A2(
				$elm$core$List$map,
				function (_v4) {
					var n = _v4.a;
					var _v5 = _v4.b;
					var x = _v5.a;
					var y = _v5.b;
					var c = _v4.c;
					return A6($author$project$GameViewCards$renderCardFilm, $author$project$Parameters$para.hcw, n, x, y, c, model);
				},
				indexed)));
};
var $author$project$Message$MouseOverCardToReplace = function (a) {
	return {$: 'MouseOverCardToReplace', a: a};
};
var $author$project$Message$SelectCardToReplace = function (a) {
	return {$: 'SelectCardToReplace', a: a};
};
var $author$project$GameViewCards$renderInitCardFilm = F6(
	function (width, n, x, y, c, model) {
		var w = $author$project$Parameters$para.cdw;
		var t = model.theme;
		var indexed = A2(
			$elm$core$List$indexedMap,
			$elm$core$Tuple$pair,
			$elm$core$String$lines(c.fd));
		var indexedLength = $elm$core$List$length(indexed);
		var h = (indexedLength * $author$project$Parameters$para.cdlp) + $author$project$Parameters$para.cdm;
		var vbArg = '0 0 ' + ($elm$core$String$fromFloat(w) + (' ' + $elm$core$String$fromFloat(h)));
		var cs = $author$project$ColorScheme$colorScheme(t);
		var lt = A2(
			$elm$core$List$map,
			function (_v1) {
				var y_ = _v1.a;
				var str = _v1.b;
				return A5($author$project$GameViewBasic$caption, $author$project$Parameters$para.cdm, y_ + (0.5 * $author$project$Parameters$para.cdm), cs.cdText, str, $author$project$Parameters$para.cdfs);
			},
			A2(
				$elm$core$List$map,
				function (_v0) {
					var n_ = _v0.a;
					var str = _v0.b;
					return _Utils_Tuple2($author$project$Parameters$para.cdm + (n_ * $author$project$Parameters$para.cdlp), str);
				},
				indexed));
		var cdy = y + (1.6 * $author$project$Parameters$para.icw);
		var cdx = x + (0.55 * $author$project$Parameters$para.icw);
		var cardDescription = A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(cdx)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(cdy)),
					$elm$svg$Svg$Attributes$viewBox(vbArg),
					$elm$svg$Svg$Attributes$width(
					$elm$core$String$fromFloat(w)),
					$elm$svg$Svg$Attributes$height(
					$elm$core$String$fromFloat(h))
				]),
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$rect,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$width(
								$elm$core$String$fromFloat(w)),
								$elm$svg$Svg$Attributes$height(
								$elm$core$String$fromFloat(h)),
								$elm$svg$Svg$Attributes$x('0'),
								$elm$svg$Svg$Attributes$y('0'),
								$elm$svg$Svg$Attributes$fill(cs.cdBkg),
								$elm$svg$Svg$Attributes$fillOpacity('0.5')
							]),
						_List_Nil)
					]),
				lt));
		var tint = (_Utils_eq(n, model.mouseOverCardToReplace) && (model.replaceChance > 0)) ? A2(
			$elm$svg$Svg$svg,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$fill('yellow'),
							$elm$svg$Svg$Attributes$fillOpacity('0.3'),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(width)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat(1.6 * width))
						]),
					_List_Nil),
					cardDescription
				])) : A2($elm$svg$Svg$rect, _List_Nil, _List_Nil);
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$author$project$GameViewBasic$onClick(
					$author$project$Message$SelectCardToReplace(c)),
					$author$project$GameViewBasic$onOver(
					$author$project$Message$MouseOverCardToReplace(n))
				]),
			_List_fromArray(
				[
					tint,
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$fill('white'),
							$elm$svg$Svg$Attributes$fillOpacity('0.0'),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(width)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat(1.6 * width))
						]),
					_List_Nil)
				]));
	});
var $author$project$GameViewCards$renderInitCards = function (model) {
	var hands = A2($elm$core$List$sortWith, $author$project$Card$cardComparison, model.hands);
	var indexed = A2(
		$elm$core$List$map,
		function (_v6) {
			var n = _v6.a;
			var c = _v6.b;
			return _Utils_Tuple3(
				n,
				_Utils_Tuple2(
					$author$project$Parameters$para.iclm + (($author$project$Parameters$para.icw + $author$project$Parameters$para.icg) * A2($elm$core$Basics$modBy, 5, n)),
					$author$project$Parameters$para.ictm + (((n / 5) | 0) * ((1.6 * $author$project$Parameters$para.icw) + $author$project$Parameters$para.icg))),
				c);
		},
		A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, hands));
	return _Utils_ap(
		A2(
			$elm$core$List$map,
			function (_v0) {
				var n = _v0.a;
				var _v1 = _v0.b;
				var x = _v1.a;
				var y = _v1.b;
				var c = _v0.c;
				return A5($author$project$GameViewCards$renderCard, $author$project$Parameters$para.icw, n, x, y, c);
			},
			indexed),
		_Utils_ap(
			A2(
				$elm$core$List$map,
				function (_v2) {
					var n = _v2.a;
					var _v3 = _v2.b;
					var x = _v3.a;
					var y = _v3.b;
					var c = _v2.c;
					return A4($author$project$GameViewCards$renderCardPng, $author$project$Parameters$para.icw, x, y, c);
				},
				indexed),
			A2(
				$elm$core$List$map,
				function (_v4) {
					var n = _v4.a;
					var _v5 = _v4.b;
					var x = _v5.a;
					var y = _v5.b;
					var c = _v4.c;
					return A6($author$project$GameViewCards$renderInitCardFilm, $author$project$Parameters$para.icw, n, x, y, c, model);
				},
				indexed)));
};
var $author$project$GameView$renderLevelProgress = function (model) {
	var wg = (A2($elm$core$Basics$min, model.currentRound, 20) / 20.0) * $author$project$Parameters$para.wlp;
	var t = model.theme;
	var cs = $author$project$ColorScheme$colorScheme(t);
	return A2(
		$elm$svg$Svg$svg,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat($author$project$Parameters$para.xlp)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat($author$project$Parameters$para.ylp)),
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat($author$project$Parameters$para.wlp)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat($author$project$Parameters$para.hlp)),
						$elm$svg$Svg$Attributes$strokeWidth('1'),
						$elm$svg$Svg$Attributes$stroke(cs.levelProgressStroke),
						$elm$svg$Svg$Attributes$fill(cs.levelProgressBkg)
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat($author$project$Parameters$para.xlp)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat($author$project$Parameters$para.ylp)),
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(wg)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat($author$project$Parameters$para.hlp)),
						$elm$svg$Svg$Attributes$fill(cs.levelProgressFill)
					]),
				_List_Nil)
			]));
};
var $author$project$GameView$renderPopulationGuide = function (model) {
	var t = model.theme;
	var cs = $author$project$ColorScheme$colorScheme(t);
	var bkg_ = A2(
		$elm$svg$Svg$svg,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$defs,
				_List_Nil,
				_List_fromArray(
					[$author$project$SvgDefs$sh2])),
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(270)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(95)),
						$elm$svg$Svg$Attributes$fill(cs.guideBkg),
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(640)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(300)),
						$elm$svg$Svg$Attributes$rx('5'),
						$elm$svg$Svg$Attributes$strokeWidth('2'),
						$elm$svg$Svg$Attributes$stroke(cs.guideStroke),
						$elm$svg$Svg$Attributes$filter('url(#shadow-filter)')
					]),
				_List_Nil)
			]));
	return ((model.currentLevel === 1) && (model.currentRound === 2)) ? A2(
		$elm$core$List$cons,
		bkg_,
		_List_fromArray(
			[
				A5($author$project$GameViewBasic$caption, 650.0, 320.0, 'green', 'Green figures: healthy population.', 16),
				A5($author$project$GameViewBasic$caption, 650.0, 350.0, 'yellow', 'Yellow figures: sick population.', 16),
				A5($author$project$GameViewBasic$caption, 650.0, 380.0, 'red', 'Red figures: dead number.', 16)
			])) : _List_Nil;
};
var $author$project$Geometry$posAdd = F2(
	function (_v0, _v1) {
		var x1 = _v0.a;
		var y1 = _v0.b;
		var x2 = _v1.a;
		var y2 = _v1.b;
		return _Utils_Tuple2(x1 + x2, y1 + y2);
	});
var $author$project$GameViewTiles$origin = function (model) {
	var _v0 = model.currentLevel;
	switch (_v0) {
		case 2:
			return A2($author$project$Geometry$posAdd, $author$project$Parameters$para.l2shift, $author$project$Parameters$para.tileOrigin);
		case 3:
			return A2($author$project$Geometry$posAdd, $author$project$Parameters$para.l3shift, $author$project$Parameters$para.tileOrigin);
		case 4:
			return A2($author$project$Geometry$posAdd, $author$project$Parameters$para.l4shift, $author$project$Parameters$para.tileOrigin);
		case 5:
			return A2($author$project$Geometry$posAdd, $author$project$Parameters$para.l5shift, $author$project$Parameters$para.tileOrigin);
		case 6:
			return A2($author$project$Geometry$posAdd, $author$project$Parameters$para.l6shift, $author$project$Parameters$para.tileOrigin);
		default:
			return $author$project$Parameters$para.tileOrigin;
	}
};
var $author$project$Geometry$rc = function (_v0) {
	var i = _v0.a;
	var j = _v0.b;
	var a = $author$project$Parameters$para.a;
	var x = a * (i + (2 * j));
	var y = -((a * i) * $elm$core$Basics$sqrt(3));
	return _Utils_Tuple2(x, y);
};
var $elm$svg$Svg$polygon = $elm$svg$Svg$trustedNode('polygon');
var $author$project$GameViewTiles$renderHex = F4(
	function (model, cstr, opa, _v0) {
		var i = _v0.a;
		var j = _v0.b;
		var a = $author$project$Parameters$para.a;
		var h = a / $elm$core$Basics$sqrt(3);
		var _v1 = $author$project$GameViewTiles$origin(model);
		var x0 = _v1.a;
		var y0 = _v1.b;
		var _v2 = A2(
			$author$project$Geometry$posAdd,
			$author$project$Geometry$rc(
				_Utils_Tuple2(i, j)),
			_Utils_Tuple2(x0, y0));
		var x = _v2.a;
		var y = _v2.b;
		return A2(
			$elm$svg$Svg$svg,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$polygon,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$points(
							A2(
								$author$project$Geometry$polyPoint,
								_List_fromArray(
									[x + a, x, x - a, x - a, x, x + a]),
								_List_fromArray(
									[y + h, y + (2 * h), y + h, y - h, y - (2 * h), y - h]))),
							$elm$svg$Svg$Attributes$fill(cstr),
							$elm$svg$Svg$Attributes$fillOpacity(
							$elm$core$String$fromFloat(opa))
						]),
					_List_Nil)
				]));
	});
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$clipPath = $elm$svg$Svg$trustedNode('clipPath');
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$style = $elm$svg$Svg$trustedNode('style');
var $elm$svg$Svg$title = $elm$svg$Svg$trustedNode('title');
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $author$project$SvgSrc$st1 = F2(
	function (x1, x2) {
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$id('Layer_1'),
					$elm$svg$Svg$Attributes$viewBox('0 0 51.39 52.03'),
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(x1 - 25.0)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(x2 - 26.3)),
					$elm$svg$Svg$Attributes$width('51.39'),
					$elm$svg$Svg$Attributes$height('52.03')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$defs,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$style,
							_List_Nil,
							_List_fromArray(
								[
									$elm$svg$Svg$text('.cls-1{fill:none;}.cls-2{clip-path:url(#clip-path);}.cls-3{fill:#f9fdfe;}.cls-4{fill:#f5fdfd;}.cls-5{fill:#e3f8fd;}')
								])),
							A2(
							$elm$svg$Svg$clipPath,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$id('clip-path'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_fromArray(
								[
									A2(
									$elm$svg$Svg$polygon,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$class('cls-1'),
											$elm$svg$Svg$Attributes$points('14.94 0.11 0 8.73 0 25.99 14.94 34.62 29.89 25.99 29.89 8.73 14.94 0.11')
										]),
									_List_Nil)
								]))
						])),
					A2(
					$elm$svg$Svg$title,
					_List_Nil,
					_List_fromArray(
						[
							$elm$svg$Svg$text('st1')
						])),
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('cls-2')
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-3'),
									$elm$svg$Svg$Attributes$d('M28.15,3q6.27,10.85,12.53,21.68c.15.26.13.34-.14.49L29.85,31.29a1.79,1.79,0,0,1,.35-1.85,6.33,6.33,0,0,1,1-.79c.6-.46,1.36-.74,1.69-1.5a.26.26,0,0,1,.36-.16c.38.13.59-.1.74-.38a.61.61,0,0,0-.19-.76c-.22-.24-.45-.47-.67-.7-.43-.44-.43-.44-.92-.07a4,4,0,0,1-.49.3c-.42.24-.43.23-.5-.24s-.43-.87-.66-.78-.7.14-.92.4a9.55,9.55,0,0,0-1.14,1.4c-.19.31-.35.75-.63.87a4.58,4.58,0,0,0-1.15.87c-.3.26-.56.5-.33,1,.11.2,0,.4-.22.54s-.48.13-.48-.2c0-.52-.22-.32-.44-.18a2.15,2.15,0,0,0-.67.64,1.29,1.29,0,0,1-.65.51,2,2,0,0,0-.94.76,2.16,2.16,0,0,1-1.06.75c-.26.1-.68.17-.67.54,0,.63-.41.9-.82,1.21a.5.5,0,0,1-.65,0,.8.8,0,0,0-.84-.08,6.82,6.82,0,0,0-1.6,1.16,2,2,0,0,1-2.44,0,.74.74,0,0,0-.71-.25c-.14,0-.29,0-.44,0-.3,0-.34-.19-.26-.37s.17-.6.6-.48a.51.51,0,0,0,.51-.21c.68-.65,1.34-1.32,2-2,.28-.27.25-.48,0-.76a2.8,2.8,0,0,1-.52-.88,2.26,2.26,0,0,1,.06-2.11c.25-.36.32-.87.73-1.15a.89.89,0,0,0,.32-1.26.84.84,0,0,1-.05-.17c-.05-.27-.16-.37-.46-.28s-.49.19-.72.07c-.81-.42-.9-1-.32-1.63l.15-.17c.46-.54.45-.74-.06-1.27-.06-.07-.11-.14-.17-.2-.22-.17-.23-.32-.05-.55.5-.63.48-.63-.24-.91-.18-.07-.37-.15-.38-.38a.47.47,0,0,1,.31-.44.58.58,0,0,1,.25-.09,8.58,8.58,0,0,1,1.52-.23.57.57,0,0,0,.59-.32,2.22,2.22,0,0,1,.89-.88c.56-.35,1.15-.67,1.7-1a19.17,19.17,0,0,1,2.31-.81s.08,0,.15.07A11.78,11.78,0,0,0,21.64,17c-.26.4-.94.38-1,1.05.4-.44.65-.17.91.11s.34.24.48.39a.59.59,0,0,0,.92,0l.27-.22a4.07,4.07,0,0,1,1.37-.86,1.37,1.37,0,0,0,.89-.69,1.41,1.41,0,0,1,.57-.54c.37-.25.82-.33,1.19-.58a1,1,0,0,0,.24-1.46c-.11-.14-.22-.34,0-.43.45-.23.51-.73.81-1a1.18,1.18,0,0,0,.33-1.32c-.11-.33-.17-.37-.44-.25s-.3,0-.27-.24.1-.67.13-1-.19-.53-.52-.41a.55.55,0,0,0-.39.44c0,.18-.06.44-.31.42a.57.57,0,0,1-.51-.43,2,2,0,0,1-.11-.87c0-.16-.08-.32-.2-.26-.33.16-.82,0-1,.36-.4.66-1,.38-1.41.27a1.59,1.59,0,0,0-1.06.09c-.15.06-.29.18-.45,0s-.54-.14-.76.09a.44.44,0,0,1-.75,0c-.18-.19-.36-.39-.55-.57a1,1,0,0,0-1.48.1c-.34.41-.73.77-1.1,1.14a.23.23,0,0,1-.36,0c-.12-.12-.08-.23,0-.34a3.58,3.58,0,0,1,.44-.43,2.32,2.32,0,0,0,.8-1.46c0-.09.08-.21,0-.28s-.22,0-.32.06a.31.31,0,0,0-.16.38c.16.31-.05.46-.22.64a7.13,7.13,0,0,0-.86.88c-.2.29-.34.44-.72.37a.65.65,0,0,0-.73.66c0,.12.09.3-.08.35s-.29-.09-.39-.23a.54.54,0,0,1,.09-.76,5.79,5.79,0,0,1,.57-.54c.24-.19.29-.39.08-.6a.46.46,0,0,0-.71-.05,2.4,2.4,0,0,1-1.61.92c-.14,0-.24.07-.21-.14a1,1,0,0,0-.6-1.18c-.77-.42-.86-.93-.27-1.57a3.32,3.32,0,0,1,.37-.38.45.45,0,0,0,.12-.69c-.24-.34,0-.54.19-.71s.51-.09.71.13a1.16,1.16,0,0,0,1.23.51c.42-.09.42-.19.24-.45a.77.77,0,0,1,0-.91.94.94,0,0,0,0-.89c-.32-.7-.32-.7.23-1.23.13-.12.25-.25.37-.38.43-.45.56-.47,1.09-.16.16.09.32.22.49.1s0-.31,0-.47a.79.79,0,0,1,.2-.82c.22-.2.4,0,.57.17a.32.32,0,0,0,.43.06.39.39,0,0,0,.21-.41c0-.12-.12-.24-.05-.38a1.32,1.32,0,0,1,1.42-.35c.28.18.58.36.85.56a.37.37,0,0,0,.55,0,2.7,2.7,0,0,1,1.11-.61.49.49,0,0,1,.5.07c.19.14.09.3,0,.44a.77.77,0,0,0,.31,1A2.68,2.68,0,0,1,24,2,2,2,0,0,0,25,3a4.85,4.85,0,0,0,1.27,0c.22,0,.49-.07.68,0A1.07,1.07,0,0,0,28.15,3ZM31,30.42c.15-.17.38-.3.19-.57a.32.32,0,0,0-.5,0c-.17.14-.45.27-.31.56S30.77,30.41,31,30.42Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-4'),
									$elm$svg$Svg$Attributes$d('M28.15,3a1.07,1.07,0,0,1-1.22.11c-.19-.12-.46,0-.68,0A4.85,4.85,0,0,1,25,3,2,2,0,0,1,24,2a2.68,2.68,0,0,0-.76-.91.77.77,0,0,1-.31-1c.05-.14.15-.3,0-.44a.49.49,0,0,0-.5-.07,2.7,2.7,0,0,0-1.11.61.37.37,0,0,1-.55,0c-.27-.2-.57-.38-.85-.56a1.32,1.32,0,0,0-1.42.35c-.07.14,0,.26.05.38a.39.39,0,0,1-.21.41A.32.32,0,0,1,17.9.79c-.17-.14-.35-.37-.57-.17a.79.79,0,0,0-.2.82c.05.16.23.32,0,.47s-.33,0-.49-.1c-.53-.31-.66-.29-1.09.16-.12.13-.24.26-.37.38-.55.53-.55.53-.23,1.23a.94.94,0,0,1,0,.89.77.77,0,0,0,0,.91c.18.26.18.36-.24.45a1.16,1.16,0,0,1-1.23-.51c-.2-.22-.46-.33-.71-.13s-.43.37-.19.71a.45.45,0,0,1-.12.69,3.32,3.32,0,0,0-.37.38c-.59.64-.5,1.15.27,1.57A1,1,0,0,1,13,9.72c0,.21.07.15.21.14a2.4,2.4,0,0,0,1.61-.92.46.46,0,0,1,.71.05c.21.21.16.41-.08.6a5.79,5.79,0,0,0-.57.54.54.54,0,0,0-.09.76c.1.14.21.27.39.23s.07-.23.08-.35a.65.65,0,0,1,.73-.66c.38.07.52-.08.72-.37a7.13,7.13,0,0,1,.86-.88c.17-.18.38-.33.22-.64A.31.31,0,0,1,18,7.84c.1-.07.2-.14.32-.06s.06.19,0,.28a2.32,2.32,0,0,1-.8,1.46,3.58,3.58,0,0,0-.44.43c-.12.11-.16.22,0,.34a.23.23,0,0,0,.36,0c.37-.37.76-.73,1.1-1.14A1,1,0,0,1,20,9.05c.19.18.37.38.55.57a.44.44,0,0,0,.75,0c.22-.23.47-.37.76-.09s.3,0,.45,0a1.59,1.59,0,0,1,1.06-.09c.45.11,1,.39,1.41-.27.19-.32.68-.2,1-.36.12-.06.22.1.2.26a2,2,0,0,0,.11.87.57.57,0,0,0,.51.43c.25,0,.27-.24.31-.42a.55.55,0,0,1,.39-.44c.33-.12.56.06.52.41s-.08.67-.13,1,0,.37.27.24.33-.08.44.25a1.18,1.18,0,0,1-.33,1.32c-.3.32-.36.82-.81,1-.17.09-.06.29,0,.43a1,1,0,0,1-.24,1.46c-.37.25-.82.33-1.19.58a1.41,1.41,0,0,0-.57.54,1.37,1.37,0,0,1-.89.69,4.07,4.07,0,0,0-1.37.86l-.27.22a.59.59,0,0,1-.92,0c-.14-.15-.34-.25-.48-.39s-.51-.55-.91-.11c.05-.67.73-.65,1-1.05a11.78,11.78,0,0,1,1.06-1.06c-.07,0-.12-.08-.15-.07a19.17,19.17,0,0,0-2.31.81c-.55.36-1.14.68-1.7,1a2.22,2.22,0,0,0-.89.88.57.57,0,0,1-.59.32,8.58,8.58,0,0,0-1.52.23.58.58,0,0,0-.25.09.47.47,0,0,0-.31.44c0,.23.2.31.38.38.72.28.74.28.24.91-.18.23-.17.38.05.55.06.06.11.13.17.2.51.53.52.73.06,1.27l-.15.17c-.58.68-.49,1.21.32,1.63.23.12.49,0,.72-.07s.41,0,.46.28a.84.84,0,0,0,.05.17A.89.89,0,0,1,17,26.4c-.41.28-.48.79-.73,1.15a2.26,2.26,0,0,0-.06,2.11,2.8,2.8,0,0,0,.52.88c.23.28.26.49,0,.76-.68.65-1.34,1.32-2,2a.51.51,0,0,1-.51.21c-.43-.12-.5.23-.6.48s0,.4.26.37c.15,0,.3,0,.44,0a.74.74,0,0,1,.71.25,2,2,0,0,0,2.44,0A6.82,6.82,0,0,1,19,33.37a.8.8,0,0,1,.84.08.5.5,0,0,0,.65,0c.41-.31.83-.58.82-1.21,0-.37.41-.44.67-.54A2.16,2.16,0,0,0,23,30.93a2,2,0,0,1,.94-.76,1.29,1.29,0,0,0,.65-.51,2.15,2.15,0,0,1,.67-.64c.22-.14.45-.34.44.18,0,.33.22.4.48.2s.33-.34.22-.54c-.23-.46,0-.7.33-1A4.58,4.58,0,0,1,27.91,27c.28-.12.44-.56.63-.87a9.55,9.55,0,0,1,1.14-1.4c.22-.26.61-.29.92-.4s.61.39.66.78.08.48.5.24a4,4,0,0,0,.49-.3c.49-.37.49-.37.92.07.22.23.45.46.67.7a.61.61,0,0,1,.19.76c-.15.28-.36.51-.74.38a.26.26,0,0,0-.36.16c-.33.76-1.09,1-1.69,1.5a6.33,6.33,0,0,0-1,.79,1.79,1.79,0,0,0-.35,1.85l-2.53,1.47a.56.56,0,0,0-.86-.32.58.58,0,0,1-.43,0,2.15,2.15,0,0,0-.64-.16c-.34,0-.59.13-.49-.44,0-.24,0-.5.16-.74s.12-.4-.18-.46a2,2,0,0,0-.35,0c-.93,0-1.41.75-2,1.24a.35.35,0,0,0-.05.46.3.3,0,0,1-.1.45c-.11.09-.17.24-.28.34s-.25.38,0,.58a.36.36,0,0,1,.08.55c-.06.08-.18.21,0,.29s.18-.11.26-.19.07-.15.11-.23.2-.25.44-.12.38.57.56.87c-.12.09-.31.11-.34.3l-1,.57c-.21-.06-.34.1-.48.18l-13,7.51L3.83,35a.67.67,0,0,1,.34-.1,1.08,1.08,0,0,0,1.09-.59A.86.86,0,0,1,5.77,34,.39.39,0,0,0,6,33.4a6.46,6.46,0,0,1-.22-1.63,8.84,8.84,0,0,1-.39-1.4c0-.05-.08-.13-.14-.15-.39-.17-.35-.44-.19-.73s.15-.34,0-.54-.09-.41.16-.55a2.86,2.86,0,0,0,1.15-1.5c0-.08,0-.21.1-.23.57-.09.82-.6,1.19-.92A3.06,3.06,0,0,0,9,23.87a1,1,0,0,1,.54-.82.47.47,0,0,0,.22-.37c0-.68.41-1.26.48-1.94a1.93,1.93,0,0,0-.45-1.46.63.63,0,0,1,0-.9.74.74,0,0,0,.2-.73.42.42,0,0,1,.09-.37,1.07,1.07,0,0,0,.19-.54c.06-.49-.25-1,0-1.47,0,0,0-.13-.08-.19a.62.62,0,0,1-.1-.46,5.16,5.16,0,0,0-.21-2.5A1.85,1.85,0,0,1,10,10.38c.12-.22.13-.4-.12-.51s-.32-.4-.24-.7a2.12,2.12,0,0,1,.23-.48c.14-.3.37-.58.24-.95a.63.63,0,0,1,.11-.66.84.84,0,0,0,.15-.46c0-.75,0-1.5.08-2.25,0-.37-.2-.73,0-1.08a.77.77,0,0,0-.08-.86c-.08-.13-.27-.31-.14-.43.28-.28.39-.68.68-.95S11.74.69,12,.3s.85-.34,1.17-.68c0,0,.09,0,.13,0,.33.11.39,0,.36-.33S13.72-1,14-1a1.44,1.44,0,0,0,1.26-.38A1.72,1.72,0,0,1,16.64-2,2.28,2.28,0,0,0,18-2.15a1.28,1.28,0,0,1,1.17-.16c.09,0,.19,0,.26-.12a.46.46,0,0,1,.64-.08c.28.16.54.11.64-.21S21-3,21.2-2.87a1.74,1.74,0,0,0,.89.23c.12,0,.25,0,.31-.13S22.32-3,22.23-3s-.25-.13-.17-.31.24-.19.41-.17A2.48,2.48,0,0,1,24.22-2.4c.38.48.41.53,1,.21ZM8.67,33.65a.86.86,0,0,1-.18-.89c0-.13-.06-.25-.14-.36a.65.65,0,0,1,0-.78,1,1,0,0,0,.19-.83c-.06-.19,0-.33.25-.39a1,1,0,0,0,.77-.71c.06-.21.19-.43.48-.36a.65.65,0,0,0,.68-.28c.26-.27.49-.62.8-.74a4,4,0,0,0,1.18-.83.56.56,0,0,0,.14-.86c-.34-.51-.19-.77.42-.76.31,0,.31-.12.37-.35A6.34,6.34,0,0,0,13.89,24c0-.91.31-1.84-.32-2.66a.7.7,0,0,1,0-.94.83.83,0,0,0,0-.95c-.15-.31-.45-.32-.73-.32a2.33,2.33,0,0,1-.83-.08.25.25,0,0,0-.36.15,3.66,3.66,0,0,0-.22,1.7c0,.36.11.76-.14,1.06a9.27,9.27,0,0,1-1.08,1.28.48.48,0,0,0-.2.42,1.09,1.09,0,0,1-.55,1c-.59.5-.52,1.34-1,1.87-.09.1,0,.31,0,.47s0,.35-.21.34-.28,0-.31.16.14.2.24.28.12.08.18.13c.41.32.41.42,0,.79l-1.73,1.7c-.47.46-.43.51,0,1.06.25.35.75.75.16,1.25a.18.18,0,0,0,0,.16,4.08,4.08,0,0,1,.18,2c0,.35-.16.79.19,1.09s.18.46,0,.69a2.62,2.62,0,0,1-.93.85.58.58,0,0,0-.18.83.89.89,0,0,0,1.49,0l.12-.13A1.24,1.24,0,0,0,8,36.55c-.06-.12-.21-.26,0-.39.4-.28.59-.73.92-1.07s.51-.64.06-1C8.83,34,8.79,33.86,8.67,33.65Zm11-21.49c-.08.14-.3.22-.3.46a1,1,0,0,1-.3.72c-.13.15-.24.39-.1.53.35.34.14.6,0,.88s-.2.44,0,.61a.55.55,0,0,1,.17.63c-.08.28.13.38.29.48s.34,0,.45-.16.22-.32.42-.38a2.58,2.58,0,0,0,1-.72,1.27,1.27,0,0,0,.27-1.15c-.05-.35-.34-.46-.68-.31-.09,0-.18.1-.27.15a.52.52,0,0,1-.62,0c-.16-.17-.06-.4.09-.56a1.16,1.16,0,0,0,.23-.92C20.23,12.05,20.05,12,19.69,12.16Zm-1.56,2.75c-.33-.57-.73-.63-1.2-.19a.94.94,0,0,1-.44.29c-.63.12-.9.67-1.3,1.07a.26.26,0,0,0,0,.42c.33.26.26.49,0,.72-.08.07-.16.14-.12.25a.22.22,0,0,0,.26.13.43.43,0,0,1,.45.28c.05.1.13.18.25.15s.11-.16.11-.26c0-.31.17-.41.46-.39.57,0,.57,0,.5-.57,0-.29-.14-.64.34-.7.1,0,.12-.12.16-.2a1,1,0,0,1,.47-.56C18.26,15.25,18.19,15.06,18.13,14.91Zm3.07-3.63c.37-.24.62-.66,1.1-.76.11,0,.08-.15,0-.23s-.11-.26-.25-.21c-.45.19-.95.19-1.39.38-.29.11-.33.36-.16.61S20.89,11.48,21.2,11.28Zm2.32-.54c.1.23.31.34.51.12s.47-.15.71,0,.34.19.41,0a.57.57,0,0,0-.21-.66c-.15-.1-.31-.18-.42,0s-.36.27-.61.12a.33.33,0,0,0-.45.05C23.34,10.46,23.43,10.59,23.52,10.74ZM22.3,15.35c.16-.44.57-.75.77-1.19a.2.2,0,0,0-.09-.23.17.17,0,0,0-.24,0c-.32.3-.64.6-.95.91-.17.16-.06.3.05.41S22.09,15.47,22.3,15.35ZM13,35a.33.33,0,0,0,.12-.47c-.16-.26-.38-.21-.61-.07s-.31.22-.18.45S12.71,35.15,13,35Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-5'),
									$elm$svg$Svg$Attributes$d('M25.18-2.19c-.55.32-.58.27-1-.21a2.48,2.48,0,0,0-1.75-1.12c-.17,0-.33,0-.41.17s.07.23.17.31.23.12.17.27-.19.12-.31.13a1.74,1.74,0,0,1-.89-.23c-.21-.1-.37-.16-.47.15s-.36.37-.64.21a.46.46,0,0,0-.64.08c-.07.08-.17.16-.26.12A1.28,1.28,0,0,0,18-2.15,2.28,2.28,0,0,1,16.64-2a1.72,1.72,0,0,0-1.39.65A1.44,1.44,0,0,1,14-1c-.27,0-.32,0-.29.26s0,.44-.36.33c0,0-.11,0-.13,0C12.89,0,12.33-.1,12,.3s-.82.43-1.18.75-.4.67-.68,1c-.13.12.06.3.14.43a.77.77,0,0,1,.08.86c-.16.35.07.71,0,1.08-.07.75-.06,1.5-.08,2.25a.84.84,0,0,1-.15.46.63.63,0,0,0-.11.66c.13.37-.1.65-.24.95a2.12,2.12,0,0,0-.23.48c-.08.3-.1.55.24.7s.24.29.12.51a1.85,1.85,0,0,0-.16,1.74,5.16,5.16,0,0,1,.21,2.5.62.62,0,0,0,.1.46c0,.06.1.16.08.19-.28.49,0,1,0,1.47a1.07,1.07,0,0,1-.19.54.42.42,0,0,0-.09.37.74.74,0,0,1-.2.73.63.63,0,0,0,0,.9,1.93,1.93,0,0,1,.45,1.46c-.07.68-.46,1.26-.48,1.94a.47.47,0,0,1-.22.37,1,1,0,0,0-.54.82,3.06,3.06,0,0,1-1.3,1.88c-.37.32-.62.83-1.19.92-.09,0-.07.15-.1.23a2.86,2.86,0,0,1-1.15,1.5c-.25.14-.4.33-.16.55s.16.34,0,.54-.2.56.19.73c.06,0,.14.1.14.15a8.84,8.84,0,0,0,.39,1.4A6.46,6.46,0,0,0,6,33.4a.39.39,0,0,1-.27.56.86.86,0,0,0-.51.39,1.08,1.08,0,0,1-1.09.59.67.67,0,0,0-.34.1L2.59,32.89c.06,0,.15-.08.16-.14a7.58,7.58,0,0,1,.46-1.61.42.42,0,0,0,0-.38c-.26-.4-.08-.67.23-.9.47-.36.58-.69.24-1.2A.78.78,0,0,1,4,27.39a.4.4,0,0,0,.2-.22,3.36,3.36,0,0,0-.72-1.62,1.25,1.25,0,0,0-1.56.38c-.17.19-.3.42-.54.51s-.43.09-.45-.22.6-1.21,1-1.16a1.73,1.73,0,0,0,1.42-.62,1.68,1.68,0,0,1,1.47-.53,1.2,1.2,0,0,0,1.42-.42c.13-.2.34-.59.71-.58s.37-.18.33-.42A1.09,1.09,0,0,0,7.08,22c-.17-.29,0-.74-.34-.9s-.69.05-1,.11-.38,0-.45-.29a.75.75,0,0,0-1.14-.42c-.15.08-.31.24-.49.1a.87.87,0,0,0-1.12,0,5.59,5.59,0,0,1,.32-.83c.26-.46.13-.74-.31-1-.25-.14-.56-.33-.38-.74.06-.14-.06-.2-.19-.23A2.93,2.93,0,0,0,.41,18a2.23,2.23,0,0,1-1.7,0,1,1,0,0,0-1.3.48c-.26.56-1,.62-1.13,1.28l0,0c-.38,0-.58.39-.89.53l-.31-.54c.24-.19.13-.35,0-.5s-.21-.47,0-.71A2.71,2.71,0,0,1-3.65,18c.15,0,.24-.09.26-.25s-.06-.24-.2-.3S-4,17.31-4,17.2c-.17-.53-.62-.61-1-.78s-.27-.39-.24-.65,0-.42.16-.4c.56,0,1.11.16,1.67.25,0,0,.06.1.11.13s.2.17.3.18c.39,0,.57.26.72.56s.25.38.52.21a.15.15,0,0,1,.2,0,.21.21,0,0,1,0,.25l-.11.19c-.09.15,0,.25.11.34a.62.62,0,0,0,.67,0c.13-.06.06-.2,0-.32a.58.58,0,0,1,.36-.87c.12-.05.25,0,.31-.2a8.51,8.51,0,0,0,.44-1.44c.14-.84,0-1-.89-.89-.12,0-.24,0-.35,0-.31.09-.66-.07-.91.07a1,1,0,0,1-1,0,.71.71,0,0,0-.63-.06c-.1,0-.2.13-.28,0s0-.22,0-.32a.54.54,0,0,1,.37-.23A.52.52,0,0,0-3,12.86a1.69,1.69,0,0,1,1-1.14c.48-.16.78-.29.92-.8s.77-.79,1.13-1.21c.11-.13.34-.31.19-.49s-.36.06-.53.13l0,0c-.11.17-.26.26-.45.15s-.11-.31-.08-.48.12-.34,0-.42C-1.34,8.39-1,8.09-1,7.82s.51-.74-.11-1c0,0,0,0,0-.08-.33-.68-.33-.68-1-.44-.41.15-.49.52-.16.79.16.13.41.27.22.48s-.31.68-.78.41c-.2-.12-.34,0-.37.19a1.94,1.94,0,0,0,0,.48,1.15,1.15,0,0,1-.28.78c-.13.18-.38.26-.46,0a13.79,13.79,0,0,1-.59-1.37c-.1-.52-.07-1.06-.2-1.57l25.9-15c.26-.16.35-.13.5.13C22.81-6.28,24-4.24,25.18-2.19ZM5.83,18.32c.2-.15.4-.28.32-.52s-.3-.13-.46-.12a6.12,6.12,0,0,0-1.05.1c-.3.08-.44.08-.44-.28s-.2-.42-.41-.25a3,3,0,0,1-1.16.57c-.3.07-.29.34-.2.58s.31.26.51.14a.59.59,0,0,1,.65,0,1.63,1.63,0,0,0,1.16.2C5.12,18.6,5.48,18.43,5.83,18.32ZM4.7,19.69c.18.29.51.43.7.27a.46.46,0,0,0,.16-.55c-.07-.17-.64-.22-.88-.07S4.7,19.58,4.7,19.69ZM5,17.14c0-.09-.13-.11-.19-.07a.22.22,0,0,0-.13.3.09.09,0,0,0,.14,0A.29.29,0,0,0,5,17.14Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-4'),
									$elm$svg$Svg$Attributes$d('M-4.64,20.36c.31-.14.51-.5.89-.53l0,0c.1-.66.87-.72,1.13-1.28A1,1,0,0,1-1.29,18a2.23,2.23,0,0,0,1.7,0A2.93,2.93,0,0,1,2,17.82c.13,0,.25.09.19.23-.18.41.13.6.38.74.44.25.57.53.31,1a5.59,5.59,0,0,0-.32.83.87.87,0,0,1,1.12,0c.18.14.34,0,.49-.1A.75.75,0,0,1,5.26,21c.07.24.19.34.45.29s.71-.28,1-.11.17.61.34.9a1.09,1.09,0,0,1,.15.46c0,.24,0,.43-.33.42s-.58.38-.71.58a1.2,1.2,0,0,1-1.42.42,1.68,1.68,0,0,0-1.47.53,1.73,1.73,0,0,1-1.42.62c-.4,0-1,.75-1,1.16s.23.3.45.22.37-.32.54-.51a1.25,1.25,0,0,1,1.56-.38,3.36,3.36,0,0,1,.72,1.62.4.4,0,0,1-.2.22.78.78,0,0,0-.3,1.27c.34.51.23.84-.24,1.2-.31.23-.49.5-.23.9a.42.42,0,0,1,0,.38,7.58,7.58,0,0,0-.46,1.61c0,.06-.1.09-.16.14ZM5.25,21.7a.41.41,0,0,0-.33-.23l-1.18-.19a.54.54,0,0,0-.55.18c-.29.35-.84.56-.63,1.18,0,.08-.06.19-.1.29-.09.27,0,.44.32.39a.52.52,0,0,0,.37-.22,2.35,2.35,0,0,1,1.89-1C5.27,22.06,5.41,22,5.25,21.7Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-4'),
									$elm$svg$Svg$Attributes$d('M-4.76,6.49c.13.51.1,1,.2,1.57A13.79,13.79,0,0,0-4,9.43c.08.24.33.16.46,0a1.15,1.15,0,0,0,.28-.78,1.94,1.94,0,0,1,0-.48c0-.24.17-.31.37-.19.47.27.59-.2.78-.41s-.06-.35-.22-.48c-.33-.27-.25-.64.16-.79.68-.24.68-.24,1,.44,0,0,0,.07,0,.08.62.28.2.66.11,1s-.37.57.09.81c.14.08,0,.27,0,.42s-.11.36.08.48.34,0,.45-.15l0,0c.17-.07.35-.34.53-.13s-.08.36-.19.49c-.36.42-1,.65-1.13,1.21s-.44.64-.92.8a1.69,1.69,0,0,0-1,1.14.52.52,0,0,1-.43.42.54.54,0,0,0-.37.23c-.06.1-.14.21,0,.32s.18,0,.28,0a.71.71,0,0,1,.63.06,1,1,0,0,0,1,0c.25-.14.6,0,.91-.07.11,0,.23,0,.35,0,.85-.12,1,.05.89.89a8.51,8.51,0,0,1-.44,1.44c-.06.16-.19.15-.31.2a.58.58,0,0,0-.36.87c0,.12.11.26,0,.32a.62.62,0,0,1-.67,0c-.11-.09-.2-.19-.11-.34l.11-.19a.21.21,0,0,0,0-.25.15.15,0,0,0-.2,0c-.27.17-.41,0-.52-.21s-.33-.56-.72-.56c-.1,0-.2-.11-.3-.18s-.07-.12-.11-.13c-.56-.09-1.11-.21-1.67-.25-.2,0-.14.25-.16.4s0,.54.24.65.87.25,1,.78c0,.11.3.16.46.22s.23.14.2.3-.11.21-.26.25A2.71,2.71,0,0,0-5,18.61c-.23.24-.3.46,0,.71s.29.31,0,.5l-3.24-5.61c.19-.18.47.07.63-.07.44-.4,1-.73,1.2-1.32a2.3,2.3,0,0,1,.67-1c.24-.22.48-.42.38-.82s.14-.41.43-.36a.89.89,0,0,0,.56,0c.57-.23,1,.07.9.68,0,.25,0,.45.28.53s.4-.06.53-.22.28-.35-.12-.35-.27-.23-.16-.4.27,0,.39,0,.28.12.4-.13A2.1,2.1,0,0,0-2,9.2c-.08-.26-.11-.24-.3-.15s-.33.29-.32-.11c0-.18-.12-.13-.22-.08a.76.76,0,0,0-.41.54c-.18.58-.54.64-1,.22-.15-.15-.19-.44-.45-.45a.64.64,0,0,1-.61-.79c.11-.55-.24-.93-.32-1.4ZM-4.64,13l-.46.27c-.14.09-.38.17-.19.38s.4.61.73.36a5.85,5.85,0,0,0,.94-1,.24.24,0,0,0,0-.29c-.08-.09-.19,0-.29,0A2.44,2.44,0,0,0-4.64,13Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-3'),
									$elm$svg$Svg$Attributes$d('M-5.61,7c.08.47.43.85.32,1.4a.64.64,0,0,0,.61.79c.26,0,.3.3.45.45.46.42.82.36,1-.22a.76.76,0,0,1,.41-.54c.1,0,.22-.1.22.08,0,.4.19.18.32.11s.22-.11.3.15a2.1,2.1,0,0,1-.12,1.61c-.12.25-.19.28-.4.13s-.28-.2-.39,0-.17.39.16.4.24.2.12.35-.3.31-.53.22-.31-.28-.28-.53c0-.61-.33-.91-.9-.68a.89.89,0,0,1-.56,0c-.29-.05-.51,0-.43.36s-.14.6-.38.82a2.3,2.3,0,0,0-.67,1c-.19.59-.76.92-1.2,1.32-.16.14-.44-.11-.63.07-.79-1.36-1.57-2.72-2.36-4.07-.11-.19-.09-.26.1-.37C-8.83,8.85-7.22,7.91-5.61,7Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-5'),
									$elm$svg$Svg$Attributes$d('M23.51,34.86c-.18-.3-.2-.67-.56-.87s-.34-.1-.44.12-.05.18-.11.23-.13.26-.26.19,0-.21,0-.29a.36.36,0,0,0-.08-.55c-.26-.2-.22-.38,0-.58s.17-.25.28-.34a.3.3,0,0,0,.1-.45.35.35,0,0,1,.05-.46c.62-.49,1.1-1.25,2-1.24a2,2,0,0,1,.35,0c.3.06.39.23.18.46s-.12.5-.16.74c-.1.57.15.45.49.44a2.15,2.15,0,0,1,.64.16.58.58,0,0,0,.43,0,.56.56,0,0,1,.86.32l-.62.35c-.18-.06-.3.08-.44.16C25.34,33.79,24.43,34.33,23.51,34.86ZM24.38,32c.09-.08.31-.2.19-.35s-.4-.12-.61,0-.26.19-.15.34S24.16,32.14,24.38,32Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-3'),
									$elm$svg$Svg$Attributes$d('M8.67,43.42l13-7.51c.14-.08.27-.24.48-.18L9,43.32C8.92,43.38,8.83,43.54,8.67,43.42Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-3'),
									$elm$svg$Svg$Attributes$d('M23.51,34.86c.92-.53,1.83-1.07,2.75-1.59.14-.08.26-.22.44-.16l-3.53,2C23.2,35,23.39,35,23.51,34.86Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-4'),
									$elm$svg$Svg$Attributes$d('M31,30.42c-.21,0-.45.28-.62-.05s.14-.42.31-.56a.32.32,0,0,1,.5,0C31.36,30.12,31.13,30.25,31,30.42Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-3'),
									$elm$svg$Svg$Attributes$d('M8.67,33.65c.12.21.16.36.26.44.45.36.23.7-.06,1s-.52.79-.92,1.07c-.18.13,0,.27,0,.39a1.24,1.24,0,0,1-.29,1.7l-.12.13a.89.89,0,0,1-1.49,0,.58.58,0,0,1,.18-.83,2.62,2.62,0,0,0,.93-.85c.17-.23.28-.45,0-.69S7,35.26,7,34.91a4.08,4.08,0,0,0-.18-2,.18.18,0,0,1,0-.16c.59-.5.09-.9-.16-1.25-.38-.55-.42-.6,0-1.06l1.73-1.7c.37-.37.37-.47,0-.79-.06-.05-.13-.08-.18-.13S8,27.7,8,27.52s.16-.16.31-.16.25-.19.21-.34-.12-.37,0-.47c.5-.53.43-1.37,1-1.87a1.09,1.09,0,0,0,.55-1,.48.48,0,0,1,.2-.42A9.27,9.27,0,0,0,11.32,22c.25-.3.14-.7.14-1.06a3.66,3.66,0,0,1,.22-1.7.25.25,0,0,1,.36-.15,2.33,2.33,0,0,0,.83.08c.28,0,.58,0,.73.32a.83.83,0,0,1,0,.95.7.7,0,0,0,0,.94c.63.82.37,1.75.32,2.66a6.34,6.34,0,0,1-.28,1.48c-.06.23-.06.36-.37.35-.61,0-.76.25-.42.76a.56.56,0,0,1-.14.86,4,4,0,0,1-1.18.83c-.31.12-.54.47-.8.74a.65.65,0,0,1-.68.28c-.29-.07-.42.15-.48.36a1,1,0,0,1-.77.71c-.24.06-.31.2-.25.39a1,1,0,0,1-.19.83.65.65,0,0,0,0,.78c.08.11.19.23.14.36A.86.86,0,0,0,8.67,33.65Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-3'),
									$elm$svg$Svg$Attributes$d('M19.69,12.16c.36-.19.54-.11.58.24a1.16,1.16,0,0,1-.23.92c-.15.16-.25.39-.09.56a.52.52,0,0,0,.62,0c.09-.05.18-.11.27-.15.34-.15.63,0,.68.31a1.27,1.27,0,0,1-.27,1.15,2.58,2.58,0,0,1-1,.72c-.2.06-.3.23-.42.38s-.27.28-.45.16-.37-.2-.29-.48a.55.55,0,0,0-.17-.63c-.2-.17-.14-.4,0-.61s.4-.54,0-.88c-.14-.14,0-.38.1-.53a1,1,0,0,0,.3-.72C19.39,12.38,19.61,12.3,19.69,12.16Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-5'),
									$elm$svg$Svg$Attributes$d('M18.13,14.91c.06.15.13.34-.08.44a1,1,0,0,0-.47.56c0,.08-.06.19-.16.2-.48.06-.37.41-.34.7.07.6.07.61-.5.57-.29,0-.46.08-.46.39,0,.1,0,.22-.11.26s-.2-.05-.25-.15a.43.43,0,0,0-.45-.28.22.22,0,0,1-.26-.13c0-.11,0-.18.12-.25.28-.23.35-.46,0-.72a.26.26,0,0,1,0-.42c.4-.4.67-.95,1.3-1.07a.94.94,0,0,0,.44-.29C17.4,14.28,17.8,14.34,18.13,14.91Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-3'),
									$elm$svg$Svg$Attributes$d('M21.2,11.28c-.31.2-.5,0-.66-.21s-.13-.5.16-.61c.44-.19.94-.19,1.39-.38.14-.05.19.12.25.21s.07.2,0,.23C21.82,10.62,21.57,11,21.2,11.28Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-3'),
									$elm$svg$Svg$Attributes$d('M23.52,10.74c-.09-.15-.18-.28-.06-.43a.33.33,0,0,1,.45-.05c.25.15.44.19.61-.12s.27-.12.42,0a.57.57,0,0,1,.21.66c-.07.22-.26.08-.41,0s-.47-.21-.71,0S23.62,11,23.52,10.74Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-3'),
									$elm$svg$Svg$Attributes$d('M22.3,15.35c-.21.12-.34,0-.46-.11s-.22-.25-.05-.41c.31-.31.63-.61.95-.91a.17.17,0,0,1,.24,0,.2.2,0,0,1,.09.23C22.87,14.6,22.46,14.91,22.3,15.35Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-3'),
									$elm$svg$Svg$Attributes$d('M13,35c-.31.18-.52.16-.67-.09s0-.35.18-.45.45-.19.61.07A.33.33,0,0,1,13,35Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-4'),
									$elm$svg$Svg$Attributes$d('M5.83,18.32c-.35.11-.71.28-1.08.44a1.63,1.63,0,0,1-1.16-.2.59.59,0,0,0-.65,0c-.2.12-.41.12-.51-.14s-.1-.51.2-.58a3,3,0,0,0,1.16-.57c.21-.17.4,0,.41.25s.14.36.44.28a6.12,6.12,0,0,1,1.05-.1c.16,0,.39-.1.46.12S6,18.17,5.83,18.32Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-4'),
									$elm$svg$Svg$Attributes$d('M4.7,19.69c0-.11-.24-.22,0-.35s.81-.1.88.07A.46.46,0,0,1,5.4,20C5.21,20.12,4.88,20,4.7,19.69Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-4'),
									$elm$svg$Svg$Attributes$d('M5,17.14a.29.29,0,0,1-.18.27.09.09,0,0,1-.14,0,.22.22,0,0,1,.13-.3C4.91,17,5,17.05,5,17.14Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-5'),
									$elm$svg$Svg$Attributes$d('M5.25,21.7c.16.28,0,.36-.21.39a2.35,2.35,0,0,0-1.89,1,.52.52,0,0,1-.37.22c-.28.05-.41-.12-.32-.39,0-.1.12-.21.1-.29-.21-.62.34-.83.63-1.18a.54.54,0,0,1,.55-.18l1.18.19A.41.41,0,0,1,5.25,21.7Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-3'),
									$elm$svg$Svg$Attributes$d('M-4.64,13a2.44,2.44,0,0,1,.76-.34c.1,0,.21-.07.29,0a.24.24,0,0,1,0,.29,5.85,5.85,0,0,1-.94,1c-.33.25-.55-.14-.73-.36s0-.29.19-.38Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$class('cls-4'),
									$elm$svg$Svg$Attributes$d('M24.38,32c-.22.14-.43.17-.57,0s0-.28.15-.34.46-.16.61,0S24.47,31.92,24.38,32Z'),
									$elm$svg$Svg$Attributes$transform('translate(10.62 8.57)')
								]),
							_List_Nil)
						]))
				]));
	});
var $author$project$GameViewTiles$renderTile = F2(
	function (model, t) {
		var theme = model.theme;
		var ind = t.indice;
		var t1 = ind.a;
		var t2 = ind.b;
		var j = t1 + (3 * t2);
		var i = (2 * t1) - t2;
		var cs = $author$project$ColorScheme$colorScheme(theme);
		var constructionCaption = (t.hos && (t.qua && t.wareHouse)) ? 'H&Q&W' : ((t.qua && t.wareHouse) ? 'Q&W' : ((t.hos && t.wareHouse) ? 'H&W' : ((t.hos && t.qua) ? 'H&Q' : (t.hos ? 'H' : (t.wareHouse ? 'W' : (t.qua ? 'Q' : 'N'))))));
		var borderStrokeColor = function () {
			switch (theme.$) {
				case 'Polar':
					return 'cyan';
				case 'Urban':
					return 'gray';
				case 'Minimum':
					return '#2e85ca';
				default:
					return 'orange ';
			}
		}();
		var a = $author$project$Parameters$para.a;
		var h = a / $elm$core$Basics$sqrt(3);
		var _v0 = $author$project$GameViewTiles$origin(model);
		var x0 = _v0.a;
		var y0 = _v0.b;
		var _v1 = A2(
			$author$project$Geometry$posAdd,
			$author$project$Geometry$rc(
				_Utils_Tuple2(i, j + 1)),
			_Utils_Tuple2(x0, y0));
		var x1 = _v1.a;
		var y1 = _v1.b;
		var _v2 = A2(
			$author$project$Geometry$posAdd,
			$author$project$Geometry$rc(
				_Utils_Tuple2(i - 1, j + 1)),
			_Utils_Tuple2(x0, y0));
		var x2 = _v2.a;
		var y2 = _v2.b;
		var _v3 = A2(
			$author$project$Geometry$posAdd,
			$author$project$Geometry$rc(
				_Utils_Tuple2(i - 1, j)),
			_Utils_Tuple2(x0, y0));
		var x3 = _v3.a;
		var y3 = _v3.b;
		var _v4 = A2(
			$author$project$Geometry$posAdd,
			$author$project$Geometry$rc(
				_Utils_Tuple2(i, j - 1)),
			_Utils_Tuple2(x0, y0));
		var x4 = _v4.a;
		var y4 = _v4.b;
		var _v5 = A2(
			$author$project$Geometry$posAdd,
			$author$project$Geometry$rc(
				_Utils_Tuple2(i + 1, j - 1)),
			_Utils_Tuple2(x0, y0));
		var x5 = _v5.a;
		var y5 = _v5.b;
		var _v6 = A2(
			$author$project$Geometry$posAdd,
			$author$project$Geometry$rc(
				_Utils_Tuple2(i + 1, j)),
			_Utils_Tuple2(x0, y0));
		var x6 = _v6.a;
		var y6 = _v6.b;
		var borderX = _Utils_ap(
			_List_fromArray(
				[x1, x1 + a, x1 + a]),
			_Utils_ap(
				_List_fromArray(
					[x2 + a, x2 + a, x2]),
				_Utils_ap(
					_List_fromArray(
						[x3 + a, x3, x3 - a]),
					_Utils_ap(
						_List_fromArray(
							[x4, x4 - a, x4 - a]),
						_Utils_ap(
							_List_fromArray(
								[x5 - a, x5 - a, x5]),
							_Utils_ap(
								_List_fromArray(
									[x6 - a, x6, x6 + a]),
								_List_fromArray(
									[x1, x1 + a, x1 + a])))))));
		var borderY = _Utils_ap(
			_List_fromArray(
				[y1 - (2 * h), y1 - h, y1 + h]),
			_Utils_ap(
				_List_fromArray(
					[y2 - h, y2 + h, y2 + (2 * h)]),
				_Utils_ap(
					_List_fromArray(
						[y3 + h, y3 + (2 * h), y3 + h]),
					_Utils_ap(
						_List_fromArray(
							[y4 + (2 * h), y4 + h, y4 - h]),
						_Utils_ap(
							_List_fromArray(
								[y5 + h, y5 - h, y5 - (2 * h)]),
							_Utils_ap(
								_List_fromArray(
									[y6 - h, y6 - (2 * h), y6 - h]),
								_List_fromArray(
									[y1 - (2 * h), y1 - h, y1 + h])))))));
		var border = A2(
			$elm$svg$Svg$svg,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$polyline,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$points(
							A2($author$project$Geometry$polyPoint, borderX, borderY)),
							$elm$svg$Svg$Attributes$strokeWidth('.5'),
							$elm$svg$Svg$Attributes$stroke(cs.tileStroke),
							$elm$svg$Svg$Attributes$fillOpacity('0.0')
						]),
					_List_Nil)
				]));
		var _v7 = A2(
			$author$project$Geometry$posAdd,
			$author$project$Geometry$rc(
				_Utils_Tuple2(i, j)),
			_Utils_Tuple2(x0, y0));
		var x = _v7.a;
		var y = _v7.b;
		var cons = A2(
			$elm$svg$Svg$svg,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$text_,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fontSize('10'),
							$elm$svg$Svg$Attributes$fontFamily('sans-serif'),
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x - 5.0)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y + 5.0)),
							$elm$svg$Svg$Attributes$fill(cs.constructionCaption)
						]),
					_List_fromArray(
						[
							$elm$svg$Svg$text(constructionCaption)
						]))
				]));
		var hexCoordinates = _List_fromArray(
			[
				_Utils_Tuple2(x, y),
				_Utils_Tuple2(x1, y1),
				_Utils_Tuple2(x2, y2),
				_Utils_Tuple2(x3, y3),
				_Utils_Tuple2(x4, y4),
				_Utils_Tuple2(x5, y5),
				_Utils_Tuple2(x6, y6)
			]);
		var tiles = function () {
			switch (theme.$) {
				case 'Minimum':
					return A2(
						$elm$core$List$map,
						A3($author$project$GameViewTiles$renderHex, model, cs.tile, 1.0),
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(i, j),
							$author$project$Geometry$generateZone(
								_Utils_Tuple2(i, j))));
				case 'Plain':
					return A2(
						$elm$core$List$map,
						A3($author$project$GameViewTiles$renderHex, model, cs.tile, 1.0),
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(i, j),
							$author$project$Geometry$generateZone(
								_Utils_Tuple2(i, j))));
				case 'Polar':
					return A2(
						$elm$core$List$map,
						function (_v9) {
							var u = _v9.a;
							var v = _v9.b;
							return A2($author$project$SvgSrc$st1, u, v);
						},
						hexCoordinates);
				default:
					return A2(
						$elm$core$List$map,
						A3($author$project$GameViewTiles$renderHex, model, cs.tile, 1.0),
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(i, j),
							$author$project$Geometry$generateZone(
								_Utils_Tuple2(i, j))));
			}
		}();
		var populationInfo = A2(
			$elm$svg$Svg$svg,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$text_,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fontSize('15'),
							$elm$svg$Svg$Attributes$fontFamily('sans-serif'),
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x - 15.0)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y - 10.0)),
							$elm$svg$Svg$Attributes$fill('#4ddd81')
						]),
					_List_fromArray(
						[
							$elm$svg$Svg$text(
							$elm$core$String$fromInt(t.population - t.sick))
						])),
					A2(
					$elm$svg$Svg$text_,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fontSize('15'),
							$elm$svg$Svg$Attributes$fontFamily('sans-serif'),
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x + 3.0)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y - 10.0)),
							$elm$svg$Svg$Attributes$fill('orange')
						]),
					_List_fromArray(
						[
							$elm$svg$Svg$text(
							$elm$core$String$fromInt(t.sick))
						])),
					A2(
					$elm$svg$Svg$text_,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fontSize('15'),
							$elm$svg$Svg$Attributes$fontFamily('sans-serif'),
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x - 5.0)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y + 23.0)),
							$elm$svg$Svg$Attributes$fill('red')
						]),
					_List_fromArray(
						[
							$elm$svg$Svg$text(
							$elm$core$String$fromInt(t.dead))
						]))
				]));
		return _Utils_ap(
			tiles,
			_Utils_ap(
				_List_fromArray(
					[border]),
				_Utils_ap(
					_List_fromArray(
						[populationInfo]),
					_List_fromArray(
						[cons]))));
	});
var $author$project$Message$MouseOver = F2(
	function (a, b) {
		return {$: 'MouseOver', a: a, b: b};
	});
var $author$project$Message$SelectHex = F2(
	function (a, b) {
		return {$: 'SelectHex', a: a, b: b};
	});
var $author$project$Tile$hospitalTiles = function (tlst) {
	return A2(
		$elm$core$List$map,
		function (x) {
			return x.indice;
		},
		A2(
			$elm$core$List$filter,
			function (x) {
				return x.hos;
			},
			tlst));
};
var $author$project$Tile$warehouseTiles = function (tlst) {
	return A2(
		$elm$core$List$map,
		function (x) {
			return x.indice;
		},
		A2(
			$elm$core$List$filter,
			function (x) {
				return x.wareHouse;
			},
			tlst));
};
var $author$project$Model$judgeBuild = F2(
	function (model, _v0) {
		var i = _v0.a;
		var j = _v0.b;
		var waretilelst = $author$project$Tile$warehouseTiles(model.city.tilesIndex);
		var quatilelst = $author$project$Tile$quarantineTiles(model.city.tilesIndex);
		var hostilelst = $author$project$Tile$hospitalTiles(model.city.tilesIndex);
		return (_Utils_eq(
			model.cardSelected,
			$author$project$Model$SelectCard($author$project$Card$hospital)) && A2(
			$elm$core$List$member,
			$author$project$Geometry$converHextoTile(
				_Utils_Tuple2(i, j)),
			hostilelst)) || ((_Utils_eq(
			model.cardSelected,
			$author$project$Model$SelectCard($author$project$Card$quarantine)) && A2(
			$elm$core$List$member,
			$author$project$Geometry$converHextoTile(
				_Utils_Tuple2(i, j)),
			quatilelst)) || (_Utils_eq(
			model.cardSelected,
			$author$project$Model$SelectCard($author$project$Card$warehouse)) && A2(
			$elm$core$List$member,
			$author$project$Geometry$converHextoTile(
				_Utils_Tuple2(i, j)),
			waretilelst)));
	});
var $author$project$GameViewTiles$renderFilm = F2(
	function (model, _v0) {
		var i = _v0.a;
		var j = _v0.b;
		var a = $author$project$Parameters$para.a;
		var h = a / $elm$core$Basics$sqrt(3);
		var _v1 = $author$project$GameViewTiles$origin(model);
		var x0 = _v1.a;
		var y0 = _v1.b;
		var _v2 = A2(
			$author$project$Geometry$posAdd,
			$author$project$Geometry$rc(
				_Utils_Tuple2(i, j)),
			_Utils_Tuple2(x0, y0));
		var x = _v2.a;
		var y = _v2.b;
		var tint = _Utils_eq(
			_Utils_Tuple2(i, j),
			model.mouseOver) ? A2(
			$elm$svg$Svg$polygon,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$points(
					A2(
						$author$project$Geometry$polyPoint,
						_List_fromArray(
							[x + a, x, x - a, x - a, x, x + a]),
						_List_fromArray(
							[y + h, y + (2 * h), y + h, y - h, y - (2 * h), y - h]))),
					$elm$svg$Svg$Attributes$fillOpacity(
					$elm$core$String$fromFloat(0.3)),
					$elm$svg$Svg$Attributes$fill('yellow')
				]),
			_List_Nil) : A2($elm$svg$Svg$polygon, _List_Nil, _List_Nil);
		return A2(
			$elm$svg$Svg$svg,
			_Utils_ap(
				_List_fromArray(
					[
						$author$project$GameViewBasic$onOver(
						A2($author$project$Message$MouseOver, i, j))
					]),
				A2(
					$author$project$Model$judgeBuild,
					model,
					_Utils_Tuple2(i, j)) ? _List_Nil : _List_fromArray(
					[
						$author$project$GameViewBasic$onClick(
						A2($author$project$Message$SelectHex, i, j))
					])),
			A2(
				$author$project$Model$judgeBuild,
				model,
				_Utils_Tuple2(i, j)) ? _List_Nil : _Utils_ap(
				_List_fromArray(
					[tint]),
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$polygon,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$points(
								A2(
									$author$project$Geometry$polyPoint,
									_List_fromArray(
										[x + a, x, x - a, x - a, x, x + a]),
									_List_fromArray(
										[y + h, y + (2 * h), y + h, y - h, y - (2 * h), y - h]))),
								$elm$svg$Svg$Attributes$fillOpacity(
								$elm$core$String$fromFloat(0.0)),
								$elm$svg$Svg$Attributes$fill('white')
							]),
						_List_Nil)
					])));
	});
var $author$project$GameViewTiles$renderTileFilm = F2(
	function (model, t) {
		var ind = t.indice;
		var t1 = ind.a;
		var t2 = ind.b;
		var j = t1 + (3 * t2);
		var i = (2 * t1) - t2;
		var a = $author$project$Parameters$para.a;
		var h = a / $elm$core$Basics$sqrt(3);
		return A2(
			$elm$core$List$map,
			$author$project$GameViewTiles$renderFilm(model),
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(i, j),
				$author$project$Geometry$generateZone(
					_Utils_Tuple2(i, j))));
	});
var $author$project$GameView$renderVirus = F2(
	function (model, v) {
		var pos = v.pos;
		return A2(
			$elm$core$List$map,
			A3($author$project$GameViewTiles$renderHex, model, 'purple', 0.5),
			pos);
	});
var $author$project$GameView$renderVirusInf = function (model) {
	var w = 200.0;
	var vir = model.virus;
	var vbArg = '0 0 ' + ($elm$core$String$fromFloat($author$project$Parameters$para.infw) + (' ' + $elm$core$String$fromFloat($author$project$Parameters$para.infh)));
	var unfold = '===========================================\nClick ℹ again to fold.';
	var t = model.theme;
	var rule = A2(
		$elm$core$String$join,
		' or ',
		A2(
			$elm$core$List$map,
			function (x) {
				return $elm$core$Debug$toString(x);
			},
			vir.rules));
	var infect = $elm$core$String$fromInt(vir.infect);
	var inf_ = ((!_Utils_eq(vir.rules, _List_Nil)) && (model.currentLevel !== 6)) ? _Utils_ap(
		_List_fromArray(
			[
				'\uD83E\uDE78 Infect rate:\nEach virus cell would infect ' + (infect + (' local citizens per turn.\n' + ('Theoretical death rate: ' + ($elm$core$String$fromInt(
				$elm$core$Basics$round(vir.kill * 100)) + ('%.\n' + ('\uD83E\uDDEC Virus spread pattern:\nIf a hex is surrounded by ' + (rule + ' virus units,\nthe virus would spread to this hex next round.')))))))
			]),
		_List_fromArray(
			['☣ Mutate: \nActivated at round 10, change the virus spread pattern.\n' + '☣ TakeOver: \nActivated at round 16, for tiles where\nlocal dead >= 3 x local healthy population\nvirus would occupy all their hexes.\n'])) : ((model.currentLevel === 6) ? _List_fromArray(
		[
			'\uD83E\uDE78 Infect rate:\nEach virus cell would infect ' + (infect + (' local citizens per turn.\n' + ('Theoretical death rate: ' + ($elm$core$String$fromInt(
			$elm$core$Basics$round(vir.kill * 100)) + ('%.\n' + ('\uD83E\uDDEC Virus spread pattern:\nIf a hex is surrounded by ' + (rule + (' virus units,\nthe virus would spread to this hex next round.\n' + ('☣ Mutate: \nif virus exists and length of\nexisting rules < 4, change the\nvirusspread pattern every 10 turns.\n' + ('☣ TakeOver: \nif virus exists, every 16 rounds\nvirus would occupy tiles where\nlocal dead >= 3 x local healthy population.\n' + ('☣ Horrify : \npopulation flow rate x2, if\ntotal dead + total sick > total healthy.\n' + '☣ Unblockable: \nA quarantine would fall if patients nearby > 3 x quarantine\npopulation.')))))))))))
		]) : _List_fromArray(
		['No virus in Tutorial 1.']));
	var inf = (model.currentLevel === 3) ? A3(
		$elm$core$List$foldl,
		function (x) {
			return function (y) {
				return _Utils_ap(x, y);
			};
		},
		_List_Nil,
		A2(
			$elm$core$List$map,
			$elm$core$String$lines,
			_Utils_ap(
				inf_,
				_Utils_ap(
					_List_fromArray(
						['☣ Revenge: \nincrease infect and death rate when size of virus \nkeeps shrinking for 3 rounds.']),
					_List_fromArray(
						[unfold]))))) : ((model.currentLevel === 4) ? A3(
		$elm$core$List$foldl,
		function (x) {
			return function (y) {
				return _Utils_ap(x, y);
			};
		},
		_List_Nil,
		A2(
			$elm$core$List$map,
			$elm$core$String$lines,
			_Utils_ap(
				inf_,
				_Utils_ap(
					_List_fromArray(
						['☣  Horrify: \npopulation flow rate x2, if\ntotal dead + total sick > total healthy.']),
					_List_fromArray(
						[unfold]))))) : ((model.currentLevel === 5) ? A3(
		$elm$core$List$foldl,
		function (x) {
			return function (y) {
				return _Utils_ap(x, y);
			};
		},
		_List_Nil,
		A2(
			$elm$core$List$map,
			$elm$core$String$lines,
			_Utils_ap(
				inf_,
				_Utils_ap(
					_List_fromArray(
						['☣ Unblockable: \nA quarantine would fall if patients nearby > 3 x quarantine\npopulation.']),
					_List_fromArray(
						[unfold]))))) : ((model.currentLevel === 6) ? A3(
		$elm$core$List$foldl,
		function (x) {
			return function (y) {
				return _Utils_ap(x, y);
			};
		},
		_List_Nil,
		A2(
			$elm$core$List$map,
			$elm$core$String$lines,
			_Utils_ap(
				inf_,
				_List_fromArray(
					[unfold])))) : ((model.currentLevel === 2) ? A3(
		$elm$core$List$foldl,
		function (x) {
			return function (y) {
				return _Utils_ap(x, y);
			};
		},
		_List_Nil,
		A2(
			$elm$core$List$map,
			$elm$core$String$lines,
			_Utils_ap(
				_List_fromArray(
					[
						'\uD83E\uDE78 Infect rate:\neach virus cell would infect ' + (infect + (' local citizens per turn.\n' + ('Theoretical death rate: ' + ($elm$core$Debug$toString(
						$elm$core$Basics$round(vir.kill * 100)) + (' percent.' + ('\n\uD83E\uDDEC Virus spread pattern:\nIf a hex is surrounded by ' + (rule + ' virus units,\nthe virus would spread to this hex next round.')))))))
					]),
				_List_fromArray(
					[unfold])))) : A3(
		$elm$core$List$foldl,
		function (x) {
			return function (y) {
				return _Utils_ap(x, y);
			};
		},
		_List_Nil,
		A2(
			$elm$core$List$map,
			$elm$core$String$lines,
			_Utils_ap(
				inf_,
				_List_fromArray(
					[unfold]))))))));
	var indexed = A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, inf);
	var h = (model.currentLevel === 6) ? ($author$project$Parameters$para.infh + 80.0) : $author$project$Parameters$para.infh;
	var cs = $author$project$ColorScheme$colorScheme(t);
	var txt = A2(
		$elm$core$List$map,
		function (_v1) {
			var x = _v1.a;
			var y = _v1.b;
			var str = _v1.c;
			return A5($author$project$GameViewBasic$caption, x, y, cs.infText, str, 12);
		},
		A2(
			$elm$core$List$map,
			function (_v0) {
				var n = _v0.a;
				var str = _v0.b;
				return _Utils_Tuple3($author$project$Parameters$para.inflm, $author$project$Parameters$para.inftm + ($author$project$Parameters$para.clh * n), str);
			},
			indexed));
	var bkg = A2(
		$elm$svg$Svg$rect,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromFloat($author$project$Parameters$para.infw)),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromFloat(h)),
				$elm$svg$Svg$Attributes$stroke(cs.infStroke),
				$elm$svg$Svg$Attributes$strokeWidth('2'),
				$elm$svg$Svg$Attributes$fill(cs.infBkg),
				$elm$svg$Svg$Attributes$fillOpacity(
				$elm$core$String$fromFloat(cs.infOpacity))
			]),
		_List_Nil);
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$x(
				$elm$core$String$fromFloat($author$project$Parameters$para.infx)),
				$elm$svg$Svg$Attributes$y(
				$elm$core$String$fromFloat($author$project$Parameters$para.infy)),
				$elm$svg$Svg$Attributes$viewBox(vbArg),
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromFloat($author$project$Parameters$para.infw)),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromFloat(h))
			]),
		A2($elm$core$List$cons, bkg, txt));
};
var $author$project$GameViewButtons$virusSkillIcon = F4(
	function (skill, x, y, w) {
		switch (skill) {
			case 'mutate':
				return A2(
					$elm$svg$Svg$image,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$xlinkHref('./assets/icons/dna1.png'),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(w))
						]),
					_List_Nil);
			case 'revenge':
				return A2(
					$elm$svg$Svg$image,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$xlinkHref('./assets/icons/scythe.png'),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(w))
						]),
					_List_Nil);
			case 'horrify':
				return A2(
					$elm$svg$Svg$image,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$xlinkHref('./assets/icons/terror.png'),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(w))
						]),
					_List_Nil);
			case 'unblockable':
				return A2(
					$elm$svg$Svg$image,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$xlinkHref('./assets/icons/demolish.png'),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(w))
						]),
					_List_Nil);
			case 'takeover':
				return A2(
					$elm$svg$Svg$image,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$xlinkHref('./assets/icons/evil-hand.png'),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(w))
						]),
					_List_Nil);
			default:
				return A2($elm$svg$Svg$svg, _List_Nil, _List_Nil);
		}
	});
var $author$project$GameViewButtons$renderVirusSkills = function (model) {
	var y = $author$project$Parameters$para.houseButtonY - 70.0;
	var takeover = A4($author$project$GameViewButtons$virusSkillIcon, 'takeover', 930.0, y, 50.0);
	var str = function () {
		var _v0 = model.currentLevel;
		switch (_v0) {
			case 3:
				return 'revenge';
			case 4:
				return 'horrify';
			case 5:
				return 'unblockable';
			default:
				return '';
		}
	}();
	var special = A4($author$project$GameViewButtons$virusSkillIcon, str, 810.0, y, 50.0);
	var mutate = A4($author$project$GameViewButtons$virusSkillIcon, 'mutate', 870.0, y, 50.0);
	return A2(
		$elm$core$List$member,
		model.currentLevel,
		_List_fromArray(
			[3, 4, 5])) ? A2(
		$elm$svg$Svg$svg,
		_List_Nil,
		_List_fromArray(
			[mutate, takeover, special])) : A2(
		$elm$svg$Svg$svg,
		_List_Nil,
		_List_fromArray(
			[
				mutate,
				takeover,
				A4($author$project$GameViewButtons$virusSkillIcon, 'unblockable', 810, y, 50.0),
				A4($author$project$GameViewButtons$virusSkillIcon, 'horrify', 750, y, 50.0)
			]));
};
var $author$project$GameViewButtons$deadHead = F3(
	function (x, y, w) {
		return A2(
			$elm$svg$Svg$image,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(x)),
					$elm$svg$Svg$Attributes$xlinkHref('./assets/icons/dead-head.png'),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(y)),
					$elm$svg$Svg$Attributes$width(
					$elm$core$String$fromFloat(w))
				]),
			_List_Nil);
	});
var $author$project$GameViewButtons$deadHead_ = A3($author$project$GameViewButtons$deadHead, $author$project$Parameters$para.dhx, $author$project$Parameters$para.dhy, $author$project$Parameters$para.dhw);
var $author$project$GameViewButtons$retryButton = F4(
	function (m, x, y, w) {
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$author$project$GameViewBasic$onClick(m)
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$image,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$xlinkHref('./assets/icons/retry.png'),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(w))
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(w)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat(w)),
							$elm$svg$Svg$Attributes$fill('transparent')
						]),
					_List_Nil)
				]));
	});
var $author$project$GameViewButtons$retryButton_ = function (m) {
	return A4($author$project$GameViewButtons$retryButton, m, $author$project$Parameters$para.fgX, $author$project$Parameters$para.fgY, $author$project$Parameters$para.fgW);
};
var $author$project$GameView$renderWasted = function (model) {
	var retry = $author$project$GameViewButtons$retryButton_(
		$author$project$Message$LevelBegin(model.currentLevel));
	var home = $author$project$GameViewButtons$houseButtonCentral;
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$svg,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$viewBox('0 0 1000 600'),
						$elm$svg$Svg$Attributes$height('600'),
						$elm$svg$Svg$Attributes$width('1000'),
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(model.screenSize.a)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(model.screenSize.b))
					]),
				_List_fromArray(
					[$author$project$GameViewButtons$deadHead_, home, retry]))
			]));
};
var $author$project$GameView$renderantiVirus = F2(
	function (model, av) {
		var pos = av.pos;
		return A2(
			$elm$core$List$map,
			A3($author$project$GameViewTiles$renderHex, model, 'blue', 0.5),
			pos);
	});
var $author$project$Message$ViewVirusInfo = {$: 'ViewVirusInfo'};
var $author$project$GameViewButtons$virusInfoButton = F3(
	function (x, y, w) {
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$author$project$GameViewBasic$onClick($author$project$Message$ViewVirusInfo)
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$image,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$xlinkHref('./assets/icons/virus-info.png'),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(w))
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromFloat(y)),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromFloat(w)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat(w)),
							$elm$svg$Svg$Attributes$fill('transparent')
						]),
					_List_Nil)
				]));
	});
var $author$project$GameViewButtons$virusInfoButtonEndless = A3($author$project$GameViewButtons$virusInfoButton, 870, $author$project$Parameters$para.houseButtonY, 50.0);
var $author$project$GameViewButtons$virusInfoButtonTutorial = A3($author$project$GameViewButtons$virusInfoButton, 930, $author$project$Parameters$para.houseButtonY - 70.0, 50.0);
var $author$project$GameViewButtons$virusInfoButton_ = A3($author$project$GameViewButtons$virusInfoButton, 750, $author$project$Parameters$para.houseButtonY - 70.0, 50.0);
var $author$project$GameView$viewGame = function (model) {
	var film = function () {
		var _v1 = model.selHex;
		if (_v1.$ === 'SelHexOn') {
			return A3(
				$elm$core$List$foldl,
				function (x) {
					return function (y) {
						return _Utils_ap(x, y);
					};
				},
				_List_Nil,
				A2(
					$elm$core$List$map,
					$author$project$GameViewTiles$renderTileFilm(model),
					model.city.tilesIndex));
		} else {
			return _List_Nil;
		}
	}();
	var _v0 = model.state;
	switch (_v0.$) {
		case 'Playing':
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$svg,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$viewBox('0 0 1000 600'),
								$elm$svg$Svg$Attributes$height('600'),
								$elm$svg$Svg$Attributes$width('1000'),
								$elm$svg$Svg$Attributes$width(
								$elm$core$String$fromFloat(model.screenSize.a)),
								$elm$svg$Svg$Attributes$height(
								$elm$core$String$fromFloat(model.screenSize.b))
							]),
						_Utils_ap(
							_List_fromArray(
								[
									$author$project$GameView$background(model.theme)
								]),
							_Utils_ap(
								A3(
									$elm$core$List$foldl,
									function (x) {
										return function (y) {
											return _Utils_ap(x, y);
										};
									},
									_List_Nil,
									A2(
										$elm$core$List$map,
										$author$project$GameViewTiles$renderTile(model),
										model.city.tilesIndex)),
								_Utils_ap(
									A2($author$project$GameView$renderVirus, model, model.virus),
									_Utils_ap(
										A2($author$project$GameView$renderantiVirus, model, model.av),
										_Utils_ap(
											A2(
												$elm$core$List$member,
												model.currentLevel,
												_List_fromArray(
													[3, 4, 5])) ? _List_fromArray(
												[
													$author$project$GameView$renderLevelProgress(model)
												]) : _List_Nil,
											_Utils_ap(
												_List_fromArray(
													[
														$author$project$GameView$renderConsole(model)
													]),
												_Utils_ap(
													_List_fromArray(
														[$author$project$GameViewButtons$nextButton_]),
													_Utils_ap(
														_List_fromArray(
															[
																$author$project$GameViewButtons$drawButton_(model)
															]),
														_Utils_ap(
															_List_fromArray(
																[
																	$author$project$GameView$powerInfo(model)
																]),
															_Utils_ap(
																_List_fromArray(
																	[
																		$author$project$GameView$powerIncInfo(model)
																	]),
																_Utils_ap(
																	_List_fromArray(
																		[$author$project$GameViewButtons$houseButton_]),
																	_Utils_ap(
																		(model.currentLevel <= 3) ? $author$project$GameView$renderGuide(model) : _List_Nil,
																		_Utils_ap(
																			$author$project$GameView$renderPopulationGuide(model),
																			_Utils_ap(
																				(model.currentLevel === 6) ? _List_fromArray(
																					[
																						$author$project$GameView$endlessLevelProgress(model)
																					]) : _List_Nil,
																				_Utils_ap(
																					A2(
																						$elm$core$List$member,
																						model.currentLevel,
																						_List_fromArray(
																							[1, 2])) ? _List_fromArray(
																						[$author$project$GameViewButtons$virusInfoButtonTutorial]) : (A2(
																						$elm$core$List$member,
																						model.currentLevel,
																						_List_fromArray(
																							[3, 4, 5])) ? _List_fromArray(
																						[
																							$author$project$GameViewButtons$renderVirusSkills(model),
																							$author$project$GameViewButtons$virusInfoButton_
																						]) : _List_fromArray(
																						[
																							$author$project$GameViewButtons$renderVirusSkills(model),
																							$author$project$GameViewButtons$virusInfoButtonEndless
																						])),
																					_Utils_ap(
																						A2(
																							$elm$core$List$member,
																							model.currentLevel,
																							_List_fromArray(
																								[3, 4, 5, 6])) ? _List_fromArray(
																							[
																								$author$project$GameView$livingPopulationInfo(model)
																							]) : _List_Nil,
																						_Utils_ap(
																							$author$project$GameViewCards$renderHands(model),
																							_Utils_ap(
																								$author$project$GameView$renderHand(model),
																								_Utils_ap(
																									film,
																									model.virusInfo ? _List_fromArray(
																										[
																											$author$project$GameView$renderVirusInf(model)
																										]) : _List_Nil)))))))))))))))))))),
						$elm$html$Html$text(
						'round ' + ($elm$core$String$fromInt(model.currentRound) + '. ')),
						$elm$html$Html$text(
						'sumPopulation: ' + ($elm$core$Debug$toString(
							$author$project$Tile$sumPopulation(model.city)) + '. ')),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick(
								$author$project$Message$Alert('Yo bro!'))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('hello')
							])),
						$elm$html$Html$text(
						$elm$core$Debug$toString(model.todo)),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick(
								$author$project$Message$LevelBegin(3))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('begin level0')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Message$DrawACard)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Draw card')
							]))
					]));
		case 'Drawing':
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$svg,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$viewBox('0 0 1000 600'),
								$elm$svg$Svg$Attributes$height('600'),
								$elm$svg$Svg$Attributes$width('1000'),
								$elm$svg$Svg$Attributes$width(
								$elm$core$String$fromFloat(model.screenSize.a)),
								$elm$svg$Svg$Attributes$height(
								$elm$core$String$fromFloat(model.screenSize.b))
							]),
						_Utils_ap(
							_List_fromArray(
								[
									$author$project$GameView$background(model.theme)
								]),
							_Utils_ap(
								$author$project$GameViewCards$renderInitCards(model),
								_Utils_ap(
									_List_fromArray(
										[
											A5(
											$author$project$GameViewBasic$caption,
											20,
											500,
											'white',
											(model.replaceChance > 0) ? ('Start the level directly or click on card to replace, ' + ('you still have ' + ($elm$core$String$fromInt(model.replaceChance) + ' chances.'))) : '',
											20)
										]),
									_Utils_ap(
										(!model.replaceChance) ? _List_fromArray(
											[$author$project$SvgSrc$hand2IcStart]) : _List_Nil,
										_Utils_ap(
											_List_fromArray(
												[
													$author$project$GameViewButtons$icGameStart(model)
												]),
											_Utils_ap(
												_List_fromArray(
													[$author$project$GameViewButtons$houseButton_]),
												_List_fromArray(
													[
														$author$project$GameView$renderCityInfo(model)
													]))))))))
					]));
		case 'Finished':
			var n = _v0.a;
			return A2($author$project$GameView$renderFinished, n, model);
		case 'Wasted':
			return $author$project$GameView$renderWasted(model);
		default:
			return A2($elm$html$Html$div, _List_Nil, _List_Nil);
	}
};
var $author$project$View$viewAll = function (model) {
	var _v0 = model.state;
	switch (_v0.$) {
		case 'Playing':
			return A2(
				$author$project$View$Document,
				'Game',
				_List_fromArray(
					[
						$author$project$GameView$viewGame(model)
					]));
		case 'HomePage':
			return A2(
				$author$project$View$Document,
				'Age of Plague',
				_List_fromArray(
					[$author$project$ViewMP$viewAll]));
		case 'CardPage':
			return A2($author$project$View$Document, 'Card Gallery', $author$project$ViewCards$viewCard);
		default:
			return A2(
				$author$project$View$Document,
				'Game',
				_List_fromArray(
					[
						$author$project$GameView$viewGame(model)
					]));
	}
};
var $author$project$Main$main = $elm$browser$Browser$document(
	{init: $author$project$Model$initModel, subscriptions: $author$project$Main$subscriptions, update: $author$project$Update$update, view: $author$project$View$viewAll});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));