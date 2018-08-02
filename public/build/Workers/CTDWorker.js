/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var Vector3 = __webpack_require__(2);
	var color = __webpack_require__(10);
	var interpolate = __webpack_require__(15);

	// const interpolate = GeoVis["interpolate"];
	var colormap = [];
	colormap["potemp"] = interpolate(['#0000ff', '#0045ff', '#0085ff', '#00cbff', '#00fff7', '#00ffb5', '#00ff73', '#10ff00', '#b5ff00', '#deff00', '#ffe700', '#ffa200', '#ff6100', '#ff2c00', '#ff0000']);
	colormap["prdm"] = interpolate(['#5440B6', '#4349C9', '#4D66D2', '#5775D5', '#4F97E1', '#84B9FB', '#73E1E7', '#ABF7EB', '#CBFBDA', '#EEFDCA', '#F9FAD5', '#FCF2AC', '#FDE37D', '#FCC865', '#FA9200']);
	colormap["sbeox"] = interpolate(['rgba(82, 71, 141, 1.0)', 'rgba(80, 87, 184, 1.0)', 'rgba(57, 136, 199, 1.0)', 'rgba(75, 182, 152, 1.0)', 'rgba(69, 206, 66, 1.0)', 'rgba(149, 219, 70, 1.0)', 'rgba(220, 234, 55, 1.0)', 'rgba(235, 206, 53, 1.0)', 'rgba(234, 164, 62, 1.0)', 'rgba(233, 123, 72, 1.0)', 'rgba(217, 66, 114, 1.0)', 'rgba(175, 46, 90, 1.0)', 'rgba(147, 23, 78, 1.0)', 'rgba(99, 20, 22, 1.0)', 'rgba(43, 0, 1, 1.0)']);
	colormap["sal00"] = interpolate(['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']);
	colormap["sigma0"] = colormap["sal00"];
	colormap["sigmat00"] = colormap["sal00"];
	function getColor(value, type) {
	    var rgba = colormap[type](value);
	    var opacity = 0.8; //value < 0.5 ? 0.0 : value;
	    var color = [rgba[0] / 255, rgba[1] / 255, rgba[2] / 255, opacity];
	    // const color = new GeoVis.Color(rgba[0] / 255, rgba[1] / 255, rgba[2] / 255, 1.0)
	    return color;
	}
	//w.terminate(); 终止worker

	function generateData(data, type, depth) {
	    var results = [];
	    var min = data[0][type];
	    var max = min;
	    data.map(function (item) {
	        min = min < item[type] ? min : item[type];
	        max = max < item[type] ? item[type] : max;
	    });
	    var delta = max - min;
	    data.map(function (item, index) {

	        var value = (item[type] - min) / delta;
	        var color = getColor(value, type);
	        var pointSize = value < 0.5 ? 5 : value * 25;
	        // if(value<0.7) return
	        var lonlat = [parseFloat(item.longitude), parseFloat(item.latitude), 5000 * 11 - 5000 * depth];
	        var car3 = Vector3.fromDegrees(lonlat[0], lonlat[1], lonlat[2]);

			var data = [car3.x, car3.y, car3.z, color, lonlat];
			data.value = value;
	        results.push(data);
	    });
	    postMessage([results, type, depth,min, max, delta]);
	}
	onmessage = function onmessage(event) {
	    var _event$data = _slicedToArray(event.data, 2),
	        type = _event$data[0],
	        maxdepth = _event$data[1];

	    var depth = maxdepth - 1;

	    var _loop = function _loop() {
	        var url = "/data/seaLayer/cut/depth" + depth + ".json";
	        var d = depth;
	        // setTimeout(function () {
	            fetch(url) // 返回一个Promise对象
	            .then(function (res) {
	                return res.json();
	            }).then(function (json) {
	                generateData(json, type, d);
	            });
	        // }, depth * 500);

	        depth--;
	    };

	    while (depth > -1) {
	        _loop();
	    }
	};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(3), __webpack_require__(6), __webpack_require__(4), __webpack_require__(5), __webpack_require__(7), __webpack_require__(8)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Check, defaultValue, defined, DeveloperError, freezeObject, EngineMath) {
	    'use strict';

	    /**
	     * A 3D Cartesian point.
	     * @alias Cartesian3
	     * @constructor
	     *
	     * @param {Number} [x=0.0] The X component.
	     * @param {Number} [y=0.0] The Y component.
	     * @param {Number} [z=0.0] The Z component.
	     *
	     * @see Cartesian2
	     * @see Cartesian4
	     * @see Packable
	     */

	    function Cartesian3(x, y, z) {
	        /**
	         * The X component.
	         * @type {Number}
	         * @default 0.0
	         */
	        this.x = defaultValue(x, 0.0);

	        /**
	         * The Y component.
	         * @type {Number}
	         * @default 0.0
	         */
	        this.y = defaultValue(y, 0.0);

	        /**
	         * The Z component.
	         * @type {Number}
	         * @default 0.0
	         */
	        this.z = defaultValue(z, 0.0);
	    }

	    /**
	     * Converts the provided Spherical into Cartesian3 coordinates.
	     *
	     * @param {Spherical} spherical The Spherical to be converted to Cartesian3.
	     * @param {Cartesian3} [result] The object onto which to store the result.
	     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
	     */
	    Cartesian3.fromSpherical = function (spherical, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('spherical', spherical);
	        //>>includeEnd('debug');

	        if (!defined(result)) {
	            result = new Cartesian3();
	        }

	        var clock = spherical.clock;
	        var cone = spherical.cone;
	        var magnitude = defaultValue(spherical.magnitude, 1.0);
	        var radial = magnitude * Math.sin(cone);
	        result.x = radial * Math.cos(clock);
	        result.y = radial * Math.sin(clock);
	        result.z = magnitude * Math.cos(cone);
	        return result;
	    };

	    /**
	     * Creates a Cartesian3 instance from x, y and z coordinates.
	     *
	     * @param {Number} x The x coordinate.
	     * @param {Number} y The y coordinate.
	     * @param {Number} z The z coordinate.
	     * @param {Cartesian3} [result] The object onto which to store the result.
	     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
	     */
	    Cartesian3.fromElements = function (x, y, z, result) {
	        if (!defined(result)) {
	            return new Cartesian3(x, y, z);
	        }

	        result.x = x;
	        result.y = y;
	        result.z = z;
	        return result;
	    };

	    /**
	     * Duplicates a Cartesian3 instance.
	     *
	     * @param {Cartesian3} cartesian The Cartesian to duplicate.
	     * @param {Cartesian3} [result] The object onto which to store the result.
	     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided. (Returns undefined if cartesian is undefined)
	     */
	    Cartesian3.clone = function (cartesian, result) {
	        if (!defined(cartesian)) {
	            return undefined;
	        }
	        if (!defined(result)) {
	            return new Cartesian3(cartesian.x, cartesian.y, cartesian.z);
	        }

	        result.x = cartesian.x;
	        result.y = cartesian.y;
	        result.z = cartesian.z;
	        return result;
	    };

	    /**
	     * Creates a Cartesian3 instance from an existing Cartesian4.  This simply takes the
	     * x, y, and z properties of the Cartesian4 and drops w.
	     * @function
	     *
	     * @param {Cartesian4} cartesian The Cartesian4 instance to create a Cartesian3 instance from.
	     * @param {Cartesian3} [result] The object onto which to store the result.
	     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
	     */
	    Cartesian3.fromCartesian4 = Cartesian3.clone;

	    /**
	     * The number of elements used to pack the object into an array.
	     * @type {Number}
	     */
	    Cartesian3.packedLength = 3;

	    /**
	     * Stores the provided instance into the provided array.
	     *
	     * @param {Cartesian3} value The value to pack.
	     * @param {Number[]} array The array to pack into.
	     * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
	     *
	     * @returns {Number[]} The array that was packed into
	     */
	    Cartesian3.pack = function (value, array, startingIndex) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('value', value);
	        Check.defined('array', array);
	        //>>includeEnd('debug');

	        startingIndex = defaultValue(startingIndex, 0);

	        array[startingIndex++] = value.x;
	        array[startingIndex++] = value.y;
	        array[startingIndex] = value.z;

	        return array;
	    };

	    /**
	     * Retrieves an instance from a packed array.
	     *
	     * @param {Number[]} array The packed array.
	     * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
	     * @param {Cartesian3} [result] The object into which to store the result.
	     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
	     */
	    Cartesian3.unpack = function (array, startingIndex, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.defined('array', array);
	        //>>includeEnd('debug');

	        startingIndex = defaultValue(startingIndex, 0);

	        if (!defined(result)) {
	            result = new Cartesian3();
	        }
	        result.x = array[startingIndex++];
	        result.y = array[startingIndex++];
	        result.z = array[startingIndex];
	        return result;
	    };

	    /**
	     * Flattens an array of Cartesian3s into an array of components.
	     *
	     * @param {Cartesian3[]} array The array of cartesians to pack.
	     * @param {Number[]} result The array onto which to store the result.
	     * @returns {Number[]} The packed array.
	     */
	    Cartesian3.packArray = function (array, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.defined('array', array);
	        //>>includeEnd('debug');

	        var length = array.length;
	        if (!defined(result)) {
	            result = new Array(length * 3);
	        } else {
	            result.length = length * 3;
	        }

	        for (var i = 0; i < length; ++i) {
	            Cartesian3.pack(array[i], result, i * 3);
	        }
	        return result;
	    };

	    /**
	     * Unpacks an array of cartesian components into an array of Cartesian3s.
	     *
	     * @param {Number[]} array The array of components to unpack.
	     * @param {Cartesian3[]} result The array onto which to store the result.
	     * @returns {Cartesian3[]} The unpacked array.
	     */
	    Cartesian3.unpackArray = function (array, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.defined('array', array);
	        Check.typeOf.number.greaterThanOrEquals('array.length', array.length, 3);
	        if (array.length % 3 !== 0) {
	            throw new DeveloperError('array length must be a multiple of 3.');
	        }
	        //>>includeEnd('debug');

	        var length = array.length;
	        if (!defined(result)) {
	            result = new Array(length / 3);
	        } else {
	            result.length = length / 3;
	        }

	        for (var i = 0; i < length; i += 3) {
	            var index = i / 3;
	            result[index] = Cartesian3.unpack(array, i, result[index]);
	        }
	        return result;
	    };

	    /**
	     * Creates a Cartesian3 from three consecutive elements in an array.
	     * @function
	     *
	     * @param {Number[]} array The array whose three consecutive elements correspond to the x, y, and z components, respectively.
	     * @param {Number} [startingIndex=0] The offset into the array of the first element, which corresponds to the x component.
	     * @param {Cartesian3} [result] The object onto which to store the result.
	     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
	     *
	     * @example
	     * // Create a Cartesian3 with (1.0, 2.0, 3.0)
	     * var v = [1.0, 2.0, 3.0];
	     * var p = Engine.Cartesian3.fromArray(v);
	     *
	     * // Create a Cartesian3 with (1.0, 2.0, 3.0) using an offset into an array
	     * var v2 = [0.0, 0.0, 1.0, 2.0, 3.0];
	     * var p2 = Engine.Cartesian3.fromArray(v2, 2);
	     */
	    Cartesian3.fromArray = Cartesian3.unpack;

	    /**
	     * Computes the value of the maximum component for the supplied Cartesian.
	     *
	     * @param {Cartesian3} cartesian The cartesian to use.
	     * @returns {Number} The value of the maximum component.
	     */
	    Cartesian3.maximumComponent = function (cartesian) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('cartesian', cartesian);
	        //>>includeEnd('debug');

	        return Math.max(cartesian.x, cartesian.y, cartesian.z);
	    };

	    /**
	     * Computes the value of the minimum component for the supplied Cartesian.
	     *
	     * @param {Cartesian3} cartesian The cartesian to use.
	     * @returns {Number} The value of the minimum component.
	     */
	    Cartesian3.minimumComponent = function (cartesian) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('cartesian', cartesian);
	        //>>includeEnd('debug');

	        return Math.min(cartesian.x, cartesian.y, cartesian.z);
	    };

	    /**
	     * Compares two Cartesians and computes a Cartesian which contains the minimum components of the supplied Cartesians.
	     *
	     * @param {Cartesian3} first A cartesian to compare.
	     * @param {Cartesian3} second A cartesian to compare.
	     * @param {Cartesian3} result The object into which to store the result.
	     * @returns {Cartesian3} A cartesian with the minimum components.
	     */
	    Cartesian3.minimumByComponent = function (first, second, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('first', first);
	        Check.typeOf.object('second', second);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        result.x = Math.min(first.x, second.x);
	        result.y = Math.min(first.y, second.y);
	        result.z = Math.min(first.z, second.z);

	        return result;
	    };

	    /**
	     * Compares two Cartesians and computes a Cartesian which contains the maximum components of the supplied Cartesians.
	     *
	     * @param {Cartesian3} first A cartesian to compare.
	     * @param {Cartesian3} second A cartesian to compare.
	     * @param {Cartesian3} result The object into which to store the result.
	     * @returns {Cartesian3} A cartesian with the maximum components.
	     */
	    Cartesian3.maximumByComponent = function (first, second, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('first', first);
	        Check.typeOf.object('second', second);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        result.x = Math.max(first.x, second.x);
	        result.y = Math.max(first.y, second.y);
	        result.z = Math.max(first.z, second.z);
	        return result;
	    };

	    /**
	     * Computes the provided Cartesian's squared magnitude.
	     *
	     * @param {Cartesian3} cartesian The Cartesian instance whose squared magnitude is to be computed.
	     * @returns {Number} The squared magnitude.
	     */
	    Cartesian3.magnitudeSquared = function (cartesian) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('cartesian', cartesian);
	        //>>includeEnd('debug');

	        return cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z;
	    };

	    /**
	     * Computes the Cartesian's magnitude (length).
	     *
	     * @param {Cartesian3} cartesian The Cartesian instance whose magnitude is to be computed.
	     * @returns {Number} The magnitude.
	     */
	    Cartesian3.magnitude = function (cartesian) {
	        return Math.sqrt(Cartesian3.magnitudeSquared(cartesian));
	    };

	    var distanceScratch = new Cartesian3();

	    /**
	     * Computes the distance between two points.
	     *
	     * @param {Cartesian3} left The first point to compute the distance from.
	     * @param {Cartesian3} right The second point to compute the distance to.
	     * @returns {Number} The distance between two points.
	     *
	     * @example
	     * // Returns 1.0
	     * var d = Engine.Cartesian3.distance(new Engine.Cartesian3(1.0, 0.0, 0.0), new Engine.Cartesian3(2.0, 0.0, 0.0));
	     */
	    Cartesian3.distance = function (left, right) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('left', left);
	        Check.typeOf.object('right', right);
	        //>>includeEnd('debug');

	        Cartesian3.subtract(left, right, distanceScratch);
	        return Cartesian3.magnitude(distanceScratch);
	    };

	    /**
	     * Computes the squared distance between two points.  Comparing squared distances
	     * using this function is more efficient than comparing distances using {@link Cartesian3#distance}.
	     *
	     * @param {Cartesian3} left The first point to compute the distance from.
	     * @param {Cartesian3} right The second point to compute the distance to.
	     * @returns {Number} The distance between two points.
	     *
	     * @example
	     * // Returns 4.0, not 2.0
	     * var d = Engine.Cartesian3.distanceSquared(new Engine.Cartesian3(1.0, 0.0, 0.0), new Engine.Cartesian3(3.0, 0.0, 0.0));
	     */
	    Cartesian3.distanceSquared = function (left, right) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('left', left);
	        Check.typeOf.object('right', right);
	        //>>includeEnd('debug');

	        Cartesian3.subtract(left, right, distanceScratch);
	        return Cartesian3.magnitudeSquared(distanceScratch);
	    };

	    /**
	     * Computes the normalized form of the supplied Cartesian.
	     *
	     * @param {Cartesian3} cartesian The Cartesian to be normalized.
	     * @param {Cartesian3} result The object onto which to store the result.
	     * @returns {Cartesian3} The modified result parameter.
	     */
	    Cartesian3.normalize = function (cartesian, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('cartesian', cartesian);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        var magnitude = Cartesian3.magnitude(cartesian);

	        result.x = cartesian.x / magnitude;
	        result.y = cartesian.y / magnitude;
	        result.z = cartesian.z / magnitude;

	        //>>includeStart('debug', pragmas.debug);
	        if (isNaN(result.x) || isNaN(result.y) || isNaN(result.z)) {
	            throw new DeveloperError('normalized result is not a number');
	        }
	        //>>includeEnd('debug');

	        return result;
	    };

	    /**
	     * Computes the dot (scalar) product of two Cartesians.
	     *
	     * @param {Cartesian3} left The first Cartesian.
	     * @param {Cartesian3} right The second Cartesian.
	     * @returns {Number} The dot product.
	     */
	    Cartesian3.dot = function (left, right) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('left', left);
	        Check.typeOf.object('right', right);
	        //>>includeEnd('debug');

	        return left.x * right.x + left.y * right.y + left.z * right.z;
	    };

	    /**
	     * Computes the componentwise product of two Cartesians.
	     *
	     * @param {Cartesian3} left The first Cartesian.
	     * @param {Cartesian3} right The second Cartesian.
	     * @param {Cartesian3} result The object onto which to store the result.
	     * @returns {Cartesian3} The modified result parameter.
	     */
	    Cartesian3.multiplyComponents = function (left, right, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('left', left);
	        Check.typeOf.object('right', right);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        result.x = left.x * right.x;
	        result.y = left.y * right.y;
	        result.z = left.z * right.z;
	        return result;
	    };

	    /**
	     * Computes the componentwise quotient of two Cartesians.
	     *
	     * @param {Cartesian3} left The first Cartesian.
	     * @param {Cartesian3} right The second Cartesian.
	     * @param {Cartesian3} result The object onto which to store the result.
	     * @returns {Cartesian3} The modified result parameter.
	     */
	    Cartesian3.divideComponents = function (left, right, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('left', left);
	        Check.typeOf.object('right', right);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        result.x = left.x / right.x;
	        result.y = left.y / right.y;
	        result.z = left.z / right.z;
	        return result;
	    };

	    /**
	     * Computes the componentwise sum of two Cartesians.
	     *
	     * @param {Cartesian3} left The first Cartesian.
	     * @param {Cartesian3} right The second Cartesian.
	     * @param {Cartesian3} result The object onto which to store the result.
	     * @returns {Cartesian3} The modified result parameter.
	     */
	    Cartesian3.add = function (left, right, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('left', left);
	        Check.typeOf.object('right', right);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        result.x = left.x + right.x;
	        result.y = left.y + right.y;
	        result.z = left.z + right.z;
	        return result;
	    };

	    /**
	     * Computes the componentwise difference of two Cartesians.
	     *
	     * @param {Cartesian3} left The first Cartesian.
	     * @param {Cartesian3} right The second Cartesian.
	     * @param {Cartesian3} result The object onto which to store the result.
	     * @returns {Cartesian3} The modified result parameter.
	     */
	    Cartesian3.subtract = function (left, right, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('left', left);
	        Check.typeOf.object('right', right);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        result.x = left.x - right.x;
	        result.y = left.y - right.y;
	        result.z = left.z - right.z;
	        return result;
	    };

	    /**
	     * Multiplies the provided Cartesian componentwise by the provided scalar.
	     *
	     * @param {Cartesian3} cartesian The Cartesian to be scaled.
	     * @param {Number} scalar The scalar to multiply with.
	     * @param {Cartesian3} result The object onto which to store the result.
	     * @returns {Cartesian3} The modified result parameter.
	     */
	    Cartesian3.multiplyByScalar = function (cartesian, scalar, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('cartesian', cartesian);
	        Check.typeOf.number('scalar', scalar);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        result.x = cartesian.x * scalar;
	        result.y = cartesian.y * scalar;
	        result.z = cartesian.z * scalar;
	        return result;
	    };

	    /**
	     * Divides the provided Cartesian componentwise by the provided scalar.
	     *
	     * @param {Cartesian3} cartesian The Cartesian to be divided.
	     * @param {Number} scalar The scalar to divide by.
	     * @param {Cartesian3} result The object onto which to store the result.
	     * @returns {Cartesian3} The modified result parameter.
	     */
	    Cartesian3.divideByScalar = function (cartesian, scalar, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('cartesian', cartesian);
	        Check.typeOf.number('scalar', scalar);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        result.x = cartesian.x / scalar;
	        result.y = cartesian.y / scalar;
	        result.z = cartesian.z / scalar;
	        return result;
	    };

	    /**
	     * Negates the provided Cartesian.
	     *
	     * @param {Cartesian3} cartesian The Cartesian to be negated.
	     * @param {Cartesian3} result The object onto which to store the result.
	     * @returns {Cartesian3} The modified result parameter.
	     */
	    Cartesian3.negate = function (cartesian, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('cartesian', cartesian);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        result.x = -cartesian.x;
	        result.y = -cartesian.y;
	        result.z = -cartesian.z;
	        return result;
	    };

	    /**
	     * Computes the absolute value of the provided Cartesian.
	     *
	     * @param {Cartesian3} cartesian The Cartesian whose absolute value is to be computed.
	     * @param {Cartesian3} result The object onto which to store the result.
	     * @returns {Cartesian3} The modified result parameter.
	     */
	    Cartesian3.abs = function (cartesian, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('cartesian', cartesian);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        result.x = Math.abs(cartesian.x);
	        result.y = Math.abs(cartesian.y);
	        result.z = Math.abs(cartesian.z);
	        return result;
	    };

	    var lerpScratch = new Cartesian3();
	    /**
	     * Computes the linear interpolation or extrapolation at t using the provided cartesians.
	     *
	     * @param {Cartesian3} start The value corresponding to t at 0.0.
	     * @param {Cartesian3} end The value corresponding to t at 1.0.
	     * @param {Number} t The point along t at which to interpolate.
	     * @param {Cartesian3} result The object onto which to store the result.
	     * @returns {Cartesian3} The modified result parameter.
	     */
	    Cartesian3.lerp = function (start, end, t, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('start', start);
	        Check.typeOf.object('end', end);
	        Check.typeOf.number('t', t);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        Cartesian3.multiplyByScalar(end, t, lerpScratch);
	        result = Cartesian3.multiplyByScalar(start, 1.0 - t, result);
	        return Cartesian3.add(lerpScratch, result, result);
	    };

	    var angleBetweenScratch = new Cartesian3();
	    var angleBetweenScratch2 = new Cartesian3();
	    /**
	     * Returns the angle, in radians, between the provided Cartesians.
	     *
	     * @param {Cartesian3} left The first Cartesian.
	     * @param {Cartesian3} right The second Cartesian.
	     * @returns {Number} The angle between the Cartesians.
	     */
	    Cartesian3.angleBetween = function (left, right) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('left', left);
	        Check.typeOf.object('right', right);
	        //>>includeEnd('debug');

	        Cartesian3.normalize(left, angleBetweenScratch);
	        Cartesian3.normalize(right, angleBetweenScratch2);
	        var cosine = Cartesian3.dot(angleBetweenScratch, angleBetweenScratch2);
	        var sine = Cartesian3.magnitude(Cartesian3.cross(angleBetweenScratch, angleBetweenScratch2, angleBetweenScratch));
	        return Math.atan2(sine, cosine);
	    };

	    var mostOrthogonalAxisScratch = new Cartesian3();
	    /**
	     * Returns the axis that is most orthogonal to the provided Cartesian.
	     *
	     * @param {Cartesian3} cartesian The Cartesian on which to find the most orthogonal axis.
	     * @param {Cartesian3} result The object onto which to store the result.
	     * @returns {Cartesian3} The most orthogonal axis.
	     */
	    Cartesian3.mostOrthogonalAxis = function (cartesian, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('cartesian', cartesian);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        var f = Cartesian3.normalize(cartesian, mostOrthogonalAxisScratch);
	        Cartesian3.abs(f, f);

	        if (f.x <= f.y) {
	            if (f.x <= f.z) {
	                result = Cartesian3.clone(Cartesian3.UNIT_X, result);
	            } else {
	                result = Cartesian3.clone(Cartesian3.UNIT_Z, result);
	            }
	        } else if (f.y <= f.z) {
	            result = Cartesian3.clone(Cartesian3.UNIT_Y, result);
	        } else {
	            result = Cartesian3.clone(Cartesian3.UNIT_Z, result);
	        }

	        return result;
	    };

	    /**
	     * Projects vector a onto vector b
	     * @param {Cartesian3} a The vector that needs projecting
	     * @param {Cartesian3} b The vector to project onto
	     * @param {Cartesian3} result The result cartesian
	     * @returns {Cartesian3} The modified result parameter
	     */
	    Cartesian3.projectVector = function (a, b, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.defined('a', a);
	        Check.defined('b', b);
	        Check.defined('result', result);
	        //>>includeEnd('debug');

	        var scalar = Cartesian3.dot(a, b) / Cartesian3.dot(b, b);
	        return Cartesian3.multiplyByScalar(b, scalar, result);
	    };

	    /**
	     * Compares the provided Cartesians componentwise and returns
	     * <code>true</code> if they are equal, <code>false</code> otherwise.
	     *
	     * @param {Cartesian3} [left] The first Cartesian.
	     * @param {Cartesian3} [right] The second Cartesian.
	     * @returns {Boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
	     */
	    Cartesian3.equals = function (left, right) {
	        return left === right || defined(left) && defined(right) && left.x === right.x && left.y === right.y && left.z === right.z;
	    };

	    /**
	     * @private
	     */
	    Cartesian3.equalsArray = function (cartesian, array, offset) {
	        return cartesian.x === array[offset] && cartesian.y === array[offset + 1] && cartesian.z === array[offset + 2];
	    };

	    /**
	     * Compares the provided Cartesians componentwise and returns
	     * <code>true</code> if they pass an absolute or relative tolerance test,
	     * <code>false</code> otherwise.
	     *
	     * @param {Cartesian3} [left] The first Cartesian.
	     * @param {Cartesian3} [right] The second Cartesian.
	     * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
	     * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
	     * @returns {Boolean} <code>true</code> if left and right are within the provided epsilon, <code>false</code> otherwise.
	     */
	    Cartesian3.equalsEpsilon = function (left, right, relativeEpsilon, absoluteEpsilon) {
	        return left === right || defined(left) && defined(right) && EngineMath.equalsEpsilon(left.x, right.x, relativeEpsilon, absoluteEpsilon) && EngineMath.equalsEpsilon(left.y, right.y, relativeEpsilon, absoluteEpsilon) && EngineMath.equalsEpsilon(left.z, right.z, relativeEpsilon, absoluteEpsilon);
	    };

	    /**
	     * Computes the cross (outer) product of two Cartesians.
	     *
	     * @param {Cartesian3} left The first Cartesian.
	     * @param {Cartesian3} right The second Cartesian.
	     * @param {Cartesian3} result The object onto which to store the result.
	     * @returns {Cartesian3} The cross product.
	     */
	    Cartesian3.cross = function (left, right, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('left', left);
	        Check.typeOf.object('right', right);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        var leftX = left.x;
	        var leftY = left.y;
	        var leftZ = left.z;
	        var rightX = right.x;
	        var rightY = right.y;
	        var rightZ = right.z;

	        var x = leftY * rightZ - leftZ * rightY;
	        var y = leftZ * rightX - leftX * rightZ;
	        var z = leftX * rightY - leftY * rightX;

	        result.x = x;
	        result.y = y;
	        result.z = z;
	        return result;
	    };

	    /**
	     * Returns a Cartesian3 position from longitude and latitude values given in degrees.
	     *
	     * @param {Number} longitude The longitude, in degrees
	     * @param {Number} latitude The latitude, in degrees
	     * @param {Number} [height=0.0] The height, in meters, above the ellipsoid.
	     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the position lies.
	     * @param {Cartesian3} [result] The object onto which to store the result.
	     * @returns {Cartesian3} The position
	     *
	     * @example
	     * var position = Engine.Cartesian3.fromDegrees(-115.0, 37.0);
	     */
	    Cartesian3.fromDegrees = function (longitude, latitude, height, ellipsoid, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.number('longitude', longitude);
	        Check.typeOf.number('latitude', latitude);
	        //>>includeEnd('debug');

	        longitude = EngineMath.toRadians(longitude);
	        latitude = EngineMath.toRadians(latitude);
	        return Cartesian3.fromRadians(longitude, latitude, height, ellipsoid, result);
	    };

	    var scratchN = new Cartesian3();
	    var scratchK = new Cartesian3();
	    var wgs84RadiiSquared = new Cartesian3(6378137.0 * 6378137.0, 6378137.0 * 6378137.0, 6356752.3142451793 * 6356752.3142451793);

	    /**
	     * Returns a Cartesian3 position from longitude and latitude values given in radians.
	     *
	     * @param {Number} longitude The longitude, in radians
	     * @param {Number} latitude The latitude, in radians
	     * @param {Number} [height=0.0] The height, in meters, above the ellipsoid.
	     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the position lies.
	     * @param {Cartesian3} [result] The object onto which to store the result.
	     * @returns {Cartesian3} The position
	     *
	     * @example
	     * var position = Engine.Cartesian3.fromRadians(-2.007, 0.645);
	     */
	    Cartesian3.fromRadians = function (longitude, latitude, height, ellipsoid, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.number('longitude', longitude);
	        Check.typeOf.number('latitude', latitude);
	        //>>includeEnd('debug');

	        height = defaultValue(height, 0.0);
	        var radiiSquared = defined(ellipsoid) ? ellipsoid.radiiSquared : wgs84RadiiSquared;

	        var cosLatitude = Math.cos(latitude);
	        scratchN.x = cosLatitude * Math.cos(longitude);
	        scratchN.y = cosLatitude * Math.sin(longitude);
	        scratchN.z = Math.sin(latitude);
	        scratchN = Cartesian3.normalize(scratchN, scratchN);

	        Cartesian3.multiplyComponents(radiiSquared, scratchN, scratchK);
	        var gamma = Math.sqrt(Cartesian3.dot(scratchN, scratchK));
	        scratchK = Cartesian3.divideByScalar(scratchK, gamma, scratchK);
	        scratchN = Cartesian3.multiplyByScalar(scratchN, height, scratchN);

	        if (!defined(result)) {
	            result = new Cartesian3();
	        }
	        return Cartesian3.add(scratchK, scratchN, result);
	    };

	    /**
	     * Returns an array of Cartesian3 positions given an array of longitude and latitude values given in degrees.
	     *
	     * @param {Number[]} coordinates A list of longitude and latitude values. Values alternate [longitude, latitude, longitude, latitude...].
	     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the coordinates lie.
	     * @param {Cartesian3[]} [result] An array of Cartesian3 objects to store the result.
	     * @returns {Cartesian3[]} The array of positions.
	     *
	     * @example
	     * var positions = Engine.Cartesian3.fromDegreesArray([-115.0, 37.0, -107.0, 33.0]);
	     */
	    Cartesian3.fromDegreesArray = function (coordinates, ellipsoid, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.defined('coordinates', coordinates);
	        if (coordinates.length < 2 || coordinates.length % 2 !== 0) {
	            throw new DeveloperError('the number of coordinates must be a multiple of 2 and at least 2');
	        }
	        //>>includeEnd('debug');

	        var length = coordinates.length;
	        if (!defined(result)) {
	            result = new Array(length / 2);
	        } else {
	            result.length = length / 2;
	        }

	        for (var i = 0; i < length; i += 2) {
	            var longitude = coordinates[i];
	            var latitude = coordinates[i + 1];
	            var index = i / 2;
	            result[index] = Cartesian3.fromDegrees(longitude, latitude, 0, ellipsoid, result[index]);
	        }

	        return result;
	    };

	    /**
	     * Returns an array of Cartesian3 positions given an array of longitude and latitude values given in radians.
	     *
	     * @param {Number[]} coordinates A list of longitude and latitude values. Values alternate [longitude, latitude, longitude, latitude...].
	     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the coordinates lie.
	     * @param {Cartesian3[]} [result] An array of Cartesian3 objects to store the result.
	     * @returns {Cartesian3[]} The array of positions.
	     *
	     * @example
	     * var positions = Engine.Cartesian3.fromRadiansArray([-2.007, 0.645, -1.867, .575]);
	     */
	    Cartesian3.fromRadiansArray = function (coordinates, ellipsoid, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.defined('coordinates', coordinates);
	        if (coordinates.length < 2 || coordinates.length % 2 !== 0) {
	            throw new DeveloperError('the number of coordinates must be a multiple of 2 and at least 2');
	        }
	        //>>includeEnd('debug');

	        var length = coordinates.length;
	        if (!defined(result)) {
	            result = new Array(length / 2);
	        } else {
	            result.length = length / 2;
	        }

	        for (var i = 0; i < length; i += 2) {
	            var longitude = coordinates[i];
	            var latitude = coordinates[i + 1];
	            var index = i / 2;
	            result[index] = Cartesian3.fromRadians(longitude, latitude, 0, ellipsoid, result[index]);
	        }

	        return result;
	    };

	    /**
	     * Returns an array of Cartesian3 positions given an array of longitude, latitude and height values where longitude and latitude are given in degrees.
	     *
	     * @param {Number[]} coordinates A list of longitude, latitude and height values. Values alternate [longitude, latitude, height, longitude, latitude, height...].
	     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the position lies.
	     * @param {Cartesian3[]} [result] An array of Cartesian3 objects to store the result.
	     * @returns {Cartesian3[]} The array of positions.
	     *
	     * @example
	     * var positions = Engine.Cartesian3.fromDegreesArrayHeights([-115.0, 37.0, 100000.0, -107.0, 33.0, 150000.0]);
	     */
	    Cartesian3.fromDegreesArrayHeights = function (coordinates, ellipsoid, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.defined('coordinates', coordinates);
	        if (coordinates.length < 3 || coordinates.length % 3 !== 0) {
	            throw new DeveloperError('the number of coordinates must be a multiple of 3 and at least 3');
	        }
	        //>>includeEnd('debug');

	        var length = coordinates.length;
	        if (!defined(result)) {
	            result = new Array(length / 3);
	        } else {
	            result.length = length / 3;
	        }

	        for (var i = 0; i < length; i += 3) {
	            var longitude = coordinates[i];
	            var latitude = coordinates[i + 1];
	            var height = coordinates[i + 2];
	            var index = i / 3;
	            result[index] = Cartesian3.fromDegrees(longitude, latitude, height, ellipsoid, result[index]);
	        }

	        return result;
	    };

	    /**
	     * Returns an array of Cartesian3 positions given an array of longitude, latitude and height values where longitude and latitude are given in radians.
	     *
	     * @param {Number[]} coordinates A list of longitude, latitude and height values. Values alternate [longitude, latitude, height, longitude, latitude, height...].
	     * @param {Ellipsoid} [ellipsoid=Ellipsoid.WGS84] The ellipsoid on which the position lies.
	     * @param {Cartesian3[]} [result] An array of Cartesian3 objects to store the result.
	     * @returns {Cartesian3[]} The array of positions.
	     *
	     * @example
	     * var positions = Engine.Cartesian3.fromRadiansArrayHeights([-2.007, 0.645, 100000.0, -1.867, .575, 150000.0]);
	     */
	    Cartesian3.fromRadiansArrayHeights = function (coordinates, ellipsoid, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.defined('coordinates', coordinates);
	        if (coordinates.length < 3 || coordinates.length % 3 !== 0) {
	            throw new DeveloperError('the number of coordinates must be a multiple of 3 and at least 3');
	        }
	        //>>includeEnd('debug');

	        var length = coordinates.length;
	        if (!defined(result)) {
	            result = new Array(length / 3);
	        } else {
	            result.length = length / 3;
	        }

	        for (var i = 0; i < length; i += 3) {
	            var longitude = coordinates[i];
	            var latitude = coordinates[i + 1];
	            var height = coordinates[i + 2];
	            var index = i / 3;
	            result[index] = Cartesian3.fromRadians(longitude, latitude, height, ellipsoid, result[index]);
	        }

	        return result;
	    };

	    /**
	     * An immutable Cartesian3 instance initialized to (0.0, 0.0, 0.0).
	     *
	     * @type {Cartesian3}
	     * @constant
	     */
	    Cartesian3.ZERO = freezeObject(new Cartesian3(0.0, 0.0, 0.0));

	    /**
	     * An immutable Cartesian3 instance initialized to (1.0, 0.0, 0.0).
	     *
	     * @type {Cartesian3}
	     * @constant
	     */
	    Cartesian3.UNIT_X = freezeObject(new Cartesian3(1.0, 0.0, 0.0));

	    /**
	     * An immutable Cartesian3 instance initialized to (0.0, 1.0, 0.0).
	     *
	     * @type {Cartesian3}
	     * @constant
	     */
	    Cartesian3.UNIT_Y = freezeObject(new Cartesian3(0.0, 1.0, 0.0));

	    /**
	     * An immutable Cartesian3 instance initialized to (0.0, 0.0, 1.0).
	     *
	     * @type {Cartesian3}
	     * @constant
	     */
	    Cartesian3.UNIT_Z = freezeObject(new Cartesian3(0.0, 0.0, 1.0));

	    /**
	     * Duplicates this Cartesian3 instance.
	     *
	     * @param {Cartesian3} [result] The object onto which to store the result.
	     * @returns {Cartesian3} The modified result parameter or a new Cartesian3 instance if one was not provided.
	     */
	    Cartesian3.prototype.clone = function (result) {
	        return Cartesian3.clone(this, result);
	    };

	    /**
	     * Compares this Cartesian against the provided Cartesian componentwise and returns
	     * <code>true</code> if they are equal, <code>false</code> otherwise.
	     *
	     * @param {Cartesian3} [right] The right hand side Cartesian.
	     * @returns {Boolean} <code>true</code> if they are equal, <code>false</code> otherwise.
	     */
	    Cartesian3.prototype.equals = function (right) {
	        return Cartesian3.equals(this, right);
	    };

	    /**
	     * Compares this Cartesian against the provided Cartesian componentwise and returns
	     * <code>true</code> if they pass an absolute or relative tolerance test,
	     * <code>false</code> otherwise.
	     *
	     * @param {Cartesian3} [right] The right hand side Cartesian.
	     * @param {Number} relativeEpsilon The relative epsilon tolerance to use for equality testing.
	     * @param {Number} [absoluteEpsilon=relativeEpsilon] The absolute epsilon tolerance to use for equality testing.
	     * @returns {Boolean} <code>true</code> if they are within the provided epsilon, <code>false</code> otherwise.
	     */
	    Cartesian3.prototype.equalsEpsilon = function (right, relativeEpsilon, absoluteEpsilon) {
	        return Cartesian3.equalsEpsilon(this, right, relativeEpsilon, absoluteEpsilon);
	    };

	    /**
	     * Creates a string representing this Cartesian in the format '(x, y, z)'.
	     *
	     * @returns {String} A string representing this Cartesian in the format '(x, y, z)'.
	     */
	    Cartesian3.prototype.toString = function () {
	        return '(' + this.x + ', ' + this.y + ', ' + this.z + ')';
	    };

	    return Cartesian3;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = function (defined, DeveloperError) {
	    'use strict';

	    /**
	     * Contains functions for checking that supplied arguments are of a specified type
	     * or meet specified conditions
	     * @private
	     */

	    var Check = {};

	    /**
	     * Contains type checking functions, all using the typeof operator
	     */
	    Check.typeOf = {};

	    function getUndefinedErrorMessage(name) {
	        return name + ' is required, actual value was undefined';
	    }

	    function getFailedTypeErrorMessage(actual, expected, name) {
	        return 'Expected ' + name + ' to be typeof ' + expected + ', actual typeof was ' + actual;
	    }

	    /**
	     * Throws if test is not defined
	     *
	     * @param {String} name The name of the variable being tested
	     * @param {*} test The value that is to be checked
	     * @exception {DeveloperError} test must be defined
	     */
	    Check.defined = function (name, test) {
	        if (!defined(test)) {
	            throw new DeveloperError(getUndefinedErrorMessage(name));
	        }
	    };

	    /**
	     * Throws if test is not typeof 'function'
	     *
	     * @param {String} name The name of the variable being tested
	     * @param {*} test The value to test
	     * @exception {DeveloperError} test must be typeof 'function'
	     */
	    Check.typeOf.func = function (name, test) {
	        if (typeof test !== 'function') {
	            throw new DeveloperError(getFailedTypeErrorMessage(typeof test === 'undefined' ? 'undefined' : _typeof(test), 'function', name));
	        }
	    };

	    /**
	     * Throws if test is not typeof 'string'
	     *
	     * @param {String} name The name of the variable being tested
	     * @param {*} test The value to test
	     * @exception {DeveloperError} test must be typeof 'string'
	     */
	    Check.typeOf.string = function (name, test) {
	        if (typeof test !== 'string') {
	            throw new DeveloperError(getFailedTypeErrorMessage(typeof test === 'undefined' ? 'undefined' : _typeof(test), 'string', name));
	        }
	    };

	    /**
	     * Throws if test is not typeof 'number'
	     *
	     * @param {String} name The name of the variable being tested
	     * @param {*} test The value to test
	     * @exception {DeveloperError} test must be typeof 'number'
	     */
	    Check.typeOf.number = function (name, test) {
	        if (typeof test !== 'number') {
	            throw new DeveloperError(getFailedTypeErrorMessage(typeof test === 'undefined' ? 'undefined' : _typeof(test), 'number', name));
	        }
	    };

	    /**
	     * Throws if test is not typeof 'number' and less than limit
	     *
	     * @param {String} name The name of the variable being tested
	     * @param {*} test The value to test
	     * @param {Number} limit The limit value to compare against
	     * @exception {DeveloperError} test must be typeof 'number' and less than limit
	     */
	    Check.typeOf.number.lessThan = function (name, test, limit) {
	        Check.typeOf.number(name, test);
	        if (test >= limit) {
	            throw new DeveloperError('Expected ' + name + ' to be less than ' + limit + ', actual value was ' + test);
	        }
	    };

	    /**
	     * Throws if test is not typeof 'number' and less than or equal to limit
	     *
	     * @param {String} name The name of the variable being tested
	     * @param {*} test The value to test
	     * @param {Number} limit The limit value to compare against
	     * @exception {DeveloperError} test must be typeof 'number' and less than or equal to limit
	     */
	    Check.typeOf.number.lessThanOrEquals = function (name, test, limit) {
	        Check.typeOf.number(name, test);
	        if (test > limit) {
	            throw new DeveloperError('Expected ' + name + ' to be less than or equal to ' + limit + ', actual value was ' + test);
	        }
	    };

	    /**
	     * Throws if test is not typeof 'number' and greater than limit
	     *
	     * @param {String} name The name of the variable being tested
	     * @param {*} test The value to test
	     * @param {Number} limit The limit value to compare against
	     * @exception {DeveloperError} test must be typeof 'number' and greater than limit
	     */
	    Check.typeOf.number.greaterThan = function (name, test, limit) {
	        Check.typeOf.number(name, test);
	        if (test <= limit) {
	            throw new DeveloperError('Expected ' + name + ' to be greater than ' + limit + ', actual value was ' + test);
	        }
	    };

	    /**
	     * Throws if test is not typeof 'number' and greater than or equal to limit
	     *
	     * @param {String} name The name of the variable being tested
	     * @param {*} test The value to test
	     * @param {Number} limit The limit value to compare against
	     * @exception {DeveloperError} test must be typeof 'number' and greater than or equal to limit
	     */
	    Check.typeOf.number.greaterThanOrEquals = function (name, test, limit) {
	        Check.typeOf.number(name, test);
	        if (test < limit) {
	            throw new DeveloperError('Expected ' + name + ' to be greater than or equal to' + limit + ', actual value was ' + test);
	        }
	    };

	    /**
	     * Throws if test is not typeof 'object'
	     *
	     * @param {String} name The name of the variable being tested
	     * @param {*} test The value to test
	     * @exception {DeveloperError} test must be typeof 'object'
	     */
	    Check.typeOf.object = function (name, test) {
	        if ((typeof test === 'undefined' ? 'undefined' : _typeof(test)) !== 'object') {
	            throw new DeveloperError(getFailedTypeErrorMessage(typeof test === 'undefined' ? 'undefined' : _typeof(test), 'object', name));
	        }
	    };

	    /**
	     * Throws if test is not typeof 'boolean'
	     *
	     * @param {String} name The name of the variable being tested
	     * @param {*} test The value to test
	     * @exception {DeveloperError} test must be typeof 'boolean'
	     */
	    Check.typeOf.bool = function (name, test) {
	        if (typeof test !== 'boolean') {
	            throw new DeveloperError(getFailedTypeErrorMessage(typeof test === 'undefined' ? 'undefined' : _typeof(test), 'boolean', name));
	        }
	    };

	    /**
	     * Throws if test1 and test2 is not typeof 'number' and not equal in value
	     *
	     * @param {String} name1 The name of the first variable being tested
	     * @param {String} name2 The name of the second variable being tested against
	     * @param {*} test1 The value to test
	     * @param {*} test2 The value to test against
	     * @exception {DeveloperError} test1 and test2 should be type of 'number' and be equal in value
	     */
	    Check.typeOf.number.equals = function (name1, name2, test1, test2) {
	        Check.typeOf.number(name1, test1);
	        Check.typeOf.number(name2, test2);
	        if (test1 !== test2) {
	            throw new DeveloperError(name1 + ' must be equal to ' + name2 + ', the actual values are ' + test1 + ' and ' + test2);
	        }
	    };

	    return Check;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    'use strict';

	    /**
	     * @exports defined
	     *
	     * @param {Object} value The object.
	     * @returns {Boolean} Returns true if the object is defined, returns false otherwise.
	     *
	     * @example
	     * if (Engine.defined(positions)) {
	     *      doSomething();
	     * } else {
	     *      doSomethingElse();
	     * }
	     */

	    function defined(value) {
	        return value !== undefined && value !== null;
	    }

	    return defined;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (defined) {
	    'use strict';

	    /**
	     * Constructs an exception object that is thrown due to a developer error, e.g., invalid argument,
	     * argument out of range, etc.  This exception should only be thrown during development;
	     * it usually indicates a bug in the calling code.  This exception should never be
	     * caught; instead the calling code should strive not to generate it.
	     * <br /><br />
	     * On the other hand, a {@link RuntimeError} indicates an exception that may
	     * be thrown at runtime, e.g., out of memory, that the calling code should be prepared
	     * to catch.
	     *
	     * @alias DeveloperError
	     * @constructor
	     * @extends Error
	     *
	     * @param {String} [message] The error message for this exception.
	     *
	     * @see RuntimeError
	     */

	    function DeveloperError(message) {
	        /**
	         * 'DeveloperError' indicating that this exception was thrown due to a developer error.
	         * @type {String}
	         * @readonly
	         */
	        this.name = 'DeveloperError';

	        /**
	         * The explanation for why this exception was thrown.
	         * @type {String}
	         * @readonly
	         */
	        this.message = message;

	        //Browsers such as IE don't have a stack property until you actually throw the error.
	        var stack;
	        try {
	            throw new Error();
	        } catch (e) {
	            stack = e.stack;
	        }

	        /**
	         * The stack trace of this exception, if available.
	         * @type {String}
	         * @readonly
	         */
	        this.stack = stack;
	    }

	    if (defined(Object.create)) {
	        DeveloperError.prototype = Object.create(Error.prototype);
	        DeveloperError.prototype.constructor = DeveloperError;
	    }

	    DeveloperError.prototype.toString = function () {
	        var str = this.name + ': ' + this.message;

	        if (defined(this.stack)) {
	            str += '\n' + this.stack.toString();
	        }

	        return str;
	    };

	    /**
	     * @private
	     */
	    DeveloperError.throwInstantiationError = function () {
	        throw new DeveloperError('This function defines an interface and should not be called directly.');
	    };

	    return DeveloperError;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(7)], __WEBPACK_AMD_DEFINE_RESULT__ = function (freezeObject) {
	    'use strict';

	    /**
	     * Returns the first parameter if not undefined, otherwise the second parameter.
	     * Useful for setting a default value for a parameter.
	     *
	     * @exports defaultValue
	     *
	     * @param {*} a
	     * @param {*} b
	     * @returns {*} Returns the first parameter if not undefined, otherwise the second parameter.
	     *
	     * @example
	     * param = Engine.defaultValue(param, 'default');
	     */

	    function defaultValue(a, b) {
	        if (a !== undefined && a !== null) {
	            return a;
	        }
	        return b;
	    }

	    /**
	     * A frozen empty object that can be used as the default value for options passed as
	     * an object literal.
	     */
	    defaultValue.EMPTY_OBJECT = freezeObject({});

	    return defaultValue;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (defined) {
	    'use strict';

	    /**
	     * Freezes an object, using Object.freeze if available, otherwise returns
	     * the object unchanged.  This function should be used in setup code to prevent
	     * errors from completely halting JavaScript execution in legacy browsers.
	     *
	     * @private
	     *
	     * @exports freezeObject
	     */

	    var freezeObject = Object.freeze;
	    if (!defined(freezeObject)) {
	        freezeObject = function freezeObject(o) {
	            return o;
	        };
	    }

	    return freezeObject;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(9), __webpack_require__(6), __webpack_require__(4), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = function (MersenneTwister, defaultValue, defined, DeveloperError) {
	    'use strict';

	    /**
	     * Math functions.
	     *
	     * @exports EngineMath
	     * @alias Math
	     */

	    var EngineMath = {};

	    /**
	     * 0.1
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON1 = 0.1;

	    /**
	     * 0.01
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON2 = 0.01;

	    /**
	     * 0.001
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON3 = 0.001;

	    /**
	     * 0.0001
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON4 = 0.0001;

	    /**
	     * 0.00001
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON5 = 0.00001;

	    /**
	     * 0.000001
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON6 = 0.000001;

	    /**
	     * 0.0000001
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON7 = 0.0000001;

	    /**
	     * 0.00000001
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON8 = 0.00000001;

	    /**
	     * 0.000000001
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON9 = 0.000000001;

	    /**
	     * 0.0000000001
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON10 = 0.0000000001;

	    /**
	     * 0.00000000001
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON11 = 0.00000000001;

	    /**
	     * 0.000000000001
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON12 = 0.000000000001;

	    /**
	     * 0.0000000000001
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON13 = 0.0000000000001;

	    /**
	     * 0.00000000000001
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON14 = 0.00000000000001;

	    /**
	     * 0.000000000000001
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON15 = 0.000000000000001;

	    /**
	     * 0.0000000000000001
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON16 = 0.0000000000000001;

	    /**
	     * 0.00000000000000001
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON17 = 0.00000000000000001;

	    /**
	     * 0.000000000000000001
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON18 = 0.000000000000000001;

	    /**
	     * 0.0000000000000000001
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON19 = 0.0000000000000000001;

	    /**
	     * 0.00000000000000000001
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.EPSILON20 = 0.00000000000000000001;

	    /**
	     * 3.986004418e14
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.GRAVITATIONALPARAMETER = 3.986004418e14;

	    /**
	     * Radius of the sun in meters: 6.955e8
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.SOLAR_RADIUS = 6.955e8;

	    /**
	     * The mean radius of the moon, according to the "Report of the IAU/IAG Working Group on
	     * Cartographic Coordinates and Rotational Elements of the Planets and satellites: 2000",
	     * Celestial Mechanics 82: 83-110, 2002.
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.LUNAR_RADIUS = 1737400.0;

	    /**
	     * 64 * 1024
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.SIXTY_FOUR_KILOBYTES = 64 * 1024;

	    /**
	     * Returns the sign of the value; 1 if the value is positive, -1 if the value is
	     * negative, or 0 if the value is 0.
	     *
	     * @param {Number} value The value to return the sign of.
	     * @returns {Number} The sign of value.
	     */
	    EngineMath.sign = defaultValue(Math.sign, function sign(value) {
	        value = +value; // coerce to number
	        if (value === 0 || value !== value) {
	            // zero or NaN
	            return value;
	        }
	        return value > 0 ? 1 : -1;
	    });

	    /**
	     * Returns 1.0 if the given value is positive or zero, and -1.0 if it is negative.
	     * This is similar to {@link EngineMath#sign} except that returns 1.0 instead of
	     * 0.0 when the input value is 0.0.
	     * @param {Number} value The value to return the sign of.
	     * @returns {Number} The sign of value.
	     */
	    EngineMath.signNotZero = function (value) {
	        return value < 0.0 ? -1.0 : 1.0;
	    };

	    /**
	     * Converts a scalar value in the range [-1.0, 1.0] to a SNORM in the range [0, rangeMax]
	     * @param {Number} value The scalar value in the range [-1.0, 1.0]
	     * @param {Number} [rangeMax=255] The maximum value in the mapped range, 255 by default.
	     * @returns {Number} A SNORM value, where 0 maps to -1.0 and rangeMax maps to 1.0.
	     *
	     * @see EngineMath.fromSNorm
	     */
	    EngineMath.toSNorm = function (value, rangeMax) {
	        rangeMax = defaultValue(rangeMax, 255);
	        return Math.round((EngineMath.clamp(value, -1.0, 1.0) * 0.5 + 0.5) * rangeMax);
	    };

	    /**
	     * Converts a SNORM value in the range [0, rangeMax] to a scalar in the range [-1.0, 1.0].
	     * @param {Number} value SNORM value in the range [0, 255]
	     * @param {Number} [rangeMax=255] The maximum value in the SNORM range, 255 by default.
	     * @returns {Number} Scalar in the range [-1.0, 1.0].
	     *
	     * @see EngineMath.toSNorm
	     */
	    EngineMath.fromSNorm = function (value, rangeMax) {
	        rangeMax = defaultValue(rangeMax, 255);
	        return EngineMath.clamp(value, 0.0, rangeMax) / rangeMax * 2.0 - 1.0;
	    };

	    /**
	     * Returns the hyperbolic sine of a number.
	     * The hyperbolic sine of <em>value</em> is defined to be
	     * (<em>e<sup>x</sup>&nbsp;-&nbsp;e<sup>-x</sup></em>)/2.0
	     * where <i>e</i> is Euler's number, approximately 2.71828183.
	     *
	     * <p>Special cases:
	     *   <ul>
	     *     <li>If the argument is NaN, then the result is NaN.</li>
	     *
	     *     <li>If the argument is infinite, then the result is an infinity
	     *     with the same sign as the argument.</li>
	     *
	     *     <li>If the argument is zero, then the result is a zero with the
	     *     same sign as the argument.</li>
	     *   </ul>
	     *</p>
	     *
	     * @param {Number} value The number whose hyperbolic sine is to be returned.
	     * @returns {Number} The hyperbolic sine of <code>value</code>.
	     */
	    EngineMath.sinh = defaultValue(Math.sinh, function sinh(value) {
	        return (Math.exp(value) - Math.exp(-value)) / 2.0;
	    });

	    /**
	     * Returns the hyperbolic cosine of a number.
	     * The hyperbolic cosine of <strong>value</strong> is defined to be
	     * (<em>e<sup>x</sup>&nbsp;+&nbsp;e<sup>-x</sup></em>)/2.0
	     * where <i>e</i> is Euler's number, approximately 2.71828183.
	     *
	     * <p>Special cases:
	     *   <ul>
	     *     <li>If the argument is NaN, then the result is NaN.</li>
	     *
	     *     <li>If the argument is infinite, then the result is positive infinity.</li>
	     *
	     *     <li>If the argument is zero, then the result is 1.0.</li>
	     *   </ul>
	     *</p>
	     *
	     * @param {Number} value The number whose hyperbolic cosine is to be returned.
	     * @returns {Number} The hyperbolic cosine of <code>value</code>.
	     */
	    EngineMath.cosh = defaultValue(Math.cosh, function cosh(value) {
	        return (Math.exp(value) + Math.exp(-value)) / 2.0;
	    });

	    /**
	     * Computes the linear interpolation of two values.
	     *
	     * @param {Number} p The start value to interpolate.
	     * @param {Number} q The end value to interpolate.
	     * @param {Number} time The time of interpolation generally in the range <code>[0.0, 1.0]</code>.
	     * @returns {Number} The linearly interpolated value.
	     *
	     * @example
	     * var n = Engine.Math.lerp(0.0, 2.0, 0.5); // returns 1.0
	     */
	    EngineMath.lerp = function (p, q, time) {
	        return (1.0 - time) * p + time * q;
	    };

	    /**
	     * pi
	     *
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.PI = Math.PI;

	    /**
	     * 1/pi
	     *
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.ONE_OVER_PI = 1.0 / Math.PI;

	    /**
	     * pi/2
	     *
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.PI_OVER_TWO = Math.PI / 2.0;

	    /**
	     * pi/3
	     *
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.PI_OVER_THREE = Math.PI / 3.0;

	    /**
	     * pi/4
	     *
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.PI_OVER_FOUR = Math.PI / 4.0;

	    /**
	     * pi/6
	     *
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.PI_OVER_SIX = Math.PI / 6.0;

	    /**
	     * 3pi/2
	     *
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.THREE_PI_OVER_TWO = 3.0 * Math.PI / 2.0;

	    /**
	     * 2pi
	     *
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.TWO_PI = 2.0 * Math.PI;

	    /**
	     * 1/2pi
	     *
	     * @type {Number}
	     * @constant
	     */
	    EngineMath.ONE_OVER_TWO_PI = 1.0 / (2.0 * Math.PI);

	    /**
	     * The number of radians in a degree.
	     *
	     * @type {Number}
	     * @constant
	     * @default Math.PI / 180.0
	     */
	    EngineMath.RADIANS_PER_DEGREE = Math.PI / 180.0;

	    /**
	     * The number of degrees in a radian.
	     *
	     * @type {Number}
	     * @constant
	     * @default 180.0 / Math.PI
	     */
	    EngineMath.DEGREES_PER_RADIAN = 180.0 / Math.PI;

	    /**
	     * The number of radians in an arc second.
	     *
	     * @type {Number}
	     * @constant
	     * @default {@link EngineMath.RADIANS_PER_DEGREE} / 3600.0
	     */
	    EngineMath.RADIANS_PER_ARCSECOND = EngineMath.RADIANS_PER_DEGREE / 3600.0;

	    /**
	     * Converts degrees to radians.
	     * @param {Number} degrees The angle to convert in degrees.
	     * @returns {Number} The corresponding angle in radians.
	     */
	    EngineMath.toRadians = function (degrees) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!defined(degrees)) {
	            throw new DeveloperError('degrees is required.');
	        }
	        //>>includeEnd('debug');
	        return degrees * EngineMath.RADIANS_PER_DEGREE;
	    };

	    /**
	     * Converts radians to degrees.
	     * @param {Number} radians The angle to convert in radians.
	     * @returns {Number} The corresponding angle in degrees.
	     */
	    EngineMath.toDegrees = function (radians) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!defined(radians)) {
	            throw new DeveloperError('radians is required.');
	        }
	        //>>includeEnd('debug');
	        return radians * EngineMath.DEGREES_PER_RADIAN;
	    };

	    /**
	     * Converts a longitude value, in radians, to the range [<code>-Math.PI</code>, <code>Math.PI</code>).
	     *
	     * @param {Number} angle The longitude value, in radians, to convert to the range [<code>-Math.PI</code>, <code>Math.PI</code>).
	     * @returns {Number} The equivalent longitude value in the range [<code>-Math.PI</code>, <code>Math.PI</code>).
	     *
	     * @example
	     * // Convert 270 degrees to -90 degrees longitude
	     * var longitude = Engine.Math.convertLongitudeRange(Engine.Math.toRadians(270.0));
	     */
	    EngineMath.convertLongitudeRange = function (angle) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!defined(angle)) {
	            throw new DeveloperError('angle is required.');
	        }
	        //>>includeEnd('debug');
	        var twoPi = EngineMath.TWO_PI;

	        var simplified = angle - Math.floor(angle / twoPi) * twoPi;

	        if (simplified < -Math.PI) {
	            return simplified + twoPi;
	        }
	        if (simplified >= Math.PI) {
	            return simplified - twoPi;
	        }

	        return simplified;
	    };

	    /**
	     * Convenience function that clamps a latitude value, in radians, to the range [<code>-Math.PI/2</code>, <code>Math.PI/2</code>).
	     * Useful for sanitizing data before use in objects requiring correct range.
	     *
	     * @param {Number} angle The latitude value, in radians, to clamp to the range [<code>-Math.PI/2</code>, <code>Math.PI/2</code>).
	     * @returns {Number} The latitude value clamped to the range [<code>-Math.PI/2</code>, <code>Math.PI/2</code>).
	     *
	     * @example
	     * // Clamp 108 degrees latitude to 90 degrees latitude
	     * var latitude = Engine.Math.clampToLatitudeRange(Engine.Math.toRadians(108.0));
	     */
	    EngineMath.clampToLatitudeRange = function (angle) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!defined(angle)) {
	            throw new DeveloperError('angle is required.');
	        }
	        //>>includeEnd('debug');

	        return EngineMath.clamp(angle, -1 * EngineMath.PI_OVER_TWO, EngineMath.PI_OVER_TWO);
	    };

	    /**
	     * Produces an angle in the range -Pi <= angle <= Pi which is equivalent to the provided angle.
	     *
	     * @param {Number} angle in radians
	     * @returns {Number} The angle in the range [<code>-EngineMath.PI</code>, <code>EngineMath.PI</code>].
	     */
	    EngineMath.negativePiToPi = function (angle) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!defined(angle)) {
	            throw new DeveloperError('angle is required.');
	        }
	        //>>includeEnd('debug');
	        return EngineMath.zeroToTwoPi(angle + EngineMath.PI) - EngineMath.PI;
	    };

	    /**
	     * Produces an angle in the range 0 <= angle <= 2Pi which is equivalent to the provided angle.
	     *
	     * @param {Number} angle in radians
	     * @returns {Number} The angle in the range [0, <code>EngineMath.TWO_PI</code>].
	     */
	    EngineMath.zeroToTwoPi = function (angle) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!defined(angle)) {
	            throw new DeveloperError('angle is required.');
	        }
	        //>>includeEnd('debug');
	        var mod = EngineMath.mod(angle, EngineMath.TWO_PI);
	        if (Math.abs(mod) < EngineMath.EPSILON14 && Math.abs(angle) > EngineMath.EPSILON14) {
	            return EngineMath.TWO_PI;
	        }
	        return mod;
	    };

	    /**
	     * The modulo operation that also works for negative dividends.
	     *
	     * @param {Number} m The dividend.
	     * @param {Number} n The divisor.
	     * @returns {Number} The remainder.
	     */
	    EngineMath.mod = function (m, n) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!defined(m)) {
	            throw new DeveloperError('m is required.');
	        }
	        if (!defined(n)) {
	            throw new DeveloperError('n is required.');
	        }
	        //>>includeEnd('debug');
	        return (m % n + n) % n;
	    };

	    /**
	     * Determines if two values are equal using an absolute or relative tolerance test. This is useful
	     * to avoid problems due to roundoff error when comparing floating-point values directly. The values are
	     * first compared using an absolute tolerance test. If that fails, a relative tolerance test is performed.
	     * Use this test if you are unsure of the magnitudes of left and right.
	     *
	     * @param {Number} left The first value to compare.
	     * @param {Number} right The other value to compare.
	     * @param {Number} relativeEpsilon The maximum inclusive delta between <code>left</code> and <code>right</code> for the relative tolerance test.
	     * @param {Number} [absoluteEpsilon=relativeEpsilon] The maximum inclusive delta between <code>left</code> and <code>right</code> for the absolute tolerance test.
	     * @returns {Boolean} <code>true</code> if the values are equal within the epsilon; otherwise, <code>false</code>.
	     *
	     * @example
	     * var a = Engine.Math.equalsEpsilon(0.0, 0.01, Engine.Math.EPSILON2); // true
	     * var b = Engine.Math.equalsEpsilon(0.0, 0.1, Engine.Math.EPSILON2);  // false
	     * var c = Engine.Math.equalsEpsilon(3699175.1634344, 3699175.2, Engine.Math.EPSILON7); // true
	     * var d = Engine.Math.equalsEpsilon(3699175.1634344, 3699175.2, Engine.Math.EPSILON9); // false
	     */
	    EngineMath.equalsEpsilon = function (left, right, relativeEpsilon, absoluteEpsilon) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!defined(left)) {
	            throw new DeveloperError('left is required.');
	        }
	        if (!defined(right)) {
	            throw new DeveloperError('right is required.');
	        }
	        if (!defined(relativeEpsilon)) {
	            throw new DeveloperError('relativeEpsilon is required.');
	        }
	        //>>includeEnd('debug');
	        absoluteEpsilon = defaultValue(absoluteEpsilon, relativeEpsilon);
	        var absDiff = Math.abs(left - right);
	        return absDiff <= absoluteEpsilon || absDiff <= relativeEpsilon * Math.max(Math.abs(left), Math.abs(right));
	    };

	    var factorials = [1];

	    /**
	     * Computes the factorial of the provided number.
	     *
	     * @param {Number} n The number whose factorial is to be computed.
	     * @returns {Number} The factorial of the provided number or undefined if the number is less than 0.
	     *
	     * @exception {DeveloperError} A number greater than or equal to 0 is required.
	     *
	     *
	     * @example
	     * //Compute 7!, which is equal to 5040
	     * var computedFactorial = Engine.Math.factorial(7);
	     *
	     * @see {@link http://en.wikipedia.org/wiki/Factorial|Factorial on Wikipedia}
	     */
	    EngineMath.factorial = function (n) {
	        //>>includeStart('debug', pragmas.debug);
	        if (typeof n !== 'number' || n < 0) {
	            throw new DeveloperError('A number greater than or equal to 0 is required.');
	        }
	        //>>includeEnd('debug');

	        var length = factorials.length;
	        if (n >= length) {
	            var sum = factorials[length - 1];
	            for (var i = length; i <= n; i++) {
	                factorials.push(sum * i);
	            }
	        }
	        return factorials[n];
	    };

	    /**
	     * Increments a number with a wrapping to a minimum value if the number exceeds the maximum value.
	     *
	     * @param {Number} [n] The number to be incremented.
	     * @param {Number} [maximumValue] The maximum incremented value before rolling over to the minimum value.
	     * @param {Number} [minimumValue=0.0] The number reset to after the maximum value has been exceeded.
	     * @returns {Number} The incremented number.
	     *
	     * @exception {DeveloperError} Maximum value must be greater than minimum value.
	     *
	     * @example
	     * var n = Engine.Math.incrementWrap(5, 10, 0); // returns 6
	     * var n = Engine.Math.incrementWrap(10, 10, 0); // returns 0
	     */
	    EngineMath.incrementWrap = function (n, maximumValue, minimumValue) {
	        minimumValue = defaultValue(minimumValue, 0.0);

	        //>>includeStart('debug', pragmas.debug);
	        if (!defined(n)) {
	            throw new DeveloperError('n is required.');
	        }
	        if (maximumValue <= minimumValue) {
	            throw new DeveloperError('maximumValue must be greater than minimumValue.');
	        }
	        //>>includeEnd('debug');

	        ++n;
	        if (n > maximumValue) {
	            n = minimumValue;
	        }
	        return n;
	    };

	    /**
	     * Determines if a positive integer is a power of two.
	     *
	     * @param {Number} n The positive integer to test.
	     * @returns {Boolean} <code>true</code> if the number if a power of two; otherwise, <code>false</code>.
	     *
	     * @exception {DeveloperError} A number greater than or equal to 0 is required.
	     *
	     * @example
	     * var t = Engine.Math.isPowerOfTwo(16); // true
	     * var f = Engine.Math.isPowerOfTwo(20); // false
	     */
	    EngineMath.isPowerOfTwo = function (n) {
	        //>>includeStart('debug', pragmas.debug);
	        if (typeof n !== 'number' || n < 0) {
	            throw new DeveloperError('A number greater than or equal to 0 is required.');
	        }
	        //>>includeEnd('debug');

	        return n !== 0 && (n & n - 1) === 0;
	    };

	    /**
	     * Computes the next power-of-two integer greater than or equal to the provided positive integer.
	     *
	     * @param {Number} n The positive integer to test.
	     * @returns {Number} The next power-of-two integer.
	     *
	     * @exception {DeveloperError} A number greater than or equal to 0 is required.
	     *
	     * @example
	     * var n = Engine.Math.nextPowerOfTwo(29); // 32
	     * var m = Engine.Math.nextPowerOfTwo(32); // 32
	     */
	    EngineMath.nextPowerOfTwo = function (n) {
	        //>>includeStart('debug', pragmas.debug);
	        if (typeof n !== 'number' || n < 0) {
	            throw new DeveloperError('A number greater than or equal to 0 is required.');
	        }
	        //>>includeEnd('debug');

	        // From http://graphics.stanford.edu/~seander/bithacks.html#RoundUpPowerOf2
	        --n;
	        n |= n >> 1;
	        n |= n >> 2;
	        n |= n >> 4;
	        n |= n >> 8;
	        n |= n >> 16;
	        ++n;

	        return n;
	    };

	    /**
	     * Constraint a value to lie between two values.
	     *
	     * @param {Number} value The value to constrain.
	     * @param {Number} min The minimum value.
	     * @param {Number} max The maximum value.
	     * @returns {Number} The value clamped so that min <= value <= max.
	     */
	    EngineMath.clamp = function (value, min, max) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!defined(value)) {
	            throw new DeveloperError('value is required');
	        }
	        if (!defined(min)) {
	            throw new DeveloperError('min is required.');
	        }
	        if (!defined(max)) {
	            throw new DeveloperError('max is required.');
	        }
	        //>>includeEnd('debug');
	        return value < min ? min : value > max ? max : value;
	    };

	    var randomNumberGenerator = new MersenneTwister();

	    /**
	     * Sets the seed used by the random number generator
	     * in {@link EngineMath#nextRandomNumber}.
	     *
	     * @param {Number} seed An integer used as the seed.
	     */
	    EngineMath.setRandomNumberSeed = function (seed) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!defined(seed)) {
	            throw new DeveloperError('seed is required.');
	        }
	        //>>includeEnd('debug');

	        randomNumberGenerator = new MersenneTwister(seed);
	    };

	    /**
	     * Generates a random floating point number in the range of [0.0, 1.0)
	     * using a Mersenne twister.
	     *
	     * @returns {Number} A random number in the range of [0.0, 1.0).
	     *
	     * @see EngineMath.setRandomNumberSeed
	     * @see {@link http://en.wikipedia.org/wiki/Mersenne_twister|Mersenne twister on Wikipedia}
	     */
	    EngineMath.nextRandomNumber = function () {
	        return randomNumberGenerator.random();
	    };

	    /**
	     * Generates a random number between two numbers.
	     *
	     * @param {Number} min The minimum value.
	     * @param {Number} max The maximum value.
	     * @returns {Number} A random number between the min and max.
	     */
	    EngineMath.randomBetween = function (min, max) {
	        return EngineMath.nextRandomNumber() * (max - min) + min;
	    };

	    /**
	     * Computes <code>Math.acos(value)</code>, but first clamps <code>value</code> to the range [-1.0, 1.0]
	     * so that the function will never return NaN.
	     *
	     * @param {Number} value The value for which to compute acos.
	     * @returns {Number} The acos of the value if the value is in the range [-1.0, 1.0], or the acos of -1.0 or 1.0,
	     *          whichever is closer, if the value is outside the range.
	     */
	    EngineMath.acosClamped = function (value) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!defined(value)) {
	            throw new DeveloperError('value is required.');
	        }
	        //>>includeEnd('debug');
	        return Math.acos(EngineMath.clamp(value, -1.0, 1.0));
	    };

	    /**
	     * Computes <code>Math.asin(value)</code>, but first clamps <code>value</code> to the range [-1.0, 1.0]
	     * so that the function will never return NaN.
	     *
	     * @param {Number} value The value for which to compute asin.
	     * @returns {Number} The asin of the value if the value is in the range [-1.0, 1.0], or the asin of -1.0 or 1.0,
	     *          whichever is closer, if the value is outside the range.
	     */
	    EngineMath.asinClamped = function (value) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!defined(value)) {
	            throw new DeveloperError('value is required.');
	        }
	        //>>includeEnd('debug');
	        return Math.asin(EngineMath.clamp(value, -1.0, 1.0));
	    };

	    /**
	     * Finds the chord length between two points given the circle's radius and the angle between the points.
	     *
	     * @param {Number} angle The angle between the two points.
	     * @param {Number} radius The radius of the circle.
	     * @returns {Number} The chord length.
	     */
	    EngineMath.chordLength = function (angle, radius) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!defined(angle)) {
	            throw new DeveloperError('angle is required.');
	        }
	        if (!defined(radius)) {
	            throw new DeveloperError('radius is required.');
	        }
	        //>>includeEnd('debug');
	        return 2.0 * radius * Math.sin(angle * 0.5);
	    };

	    /**
	     * Finds the logarithm of a number to a base.
	     *
	     * @param {Number} number The number.
	     * @param {Number} base The base.
	     * @returns {Number} The result.
	     */
	    EngineMath.logBase = function (number, base) {
	        //>>includeStart('debug', pragmas.debug);
	        if (!defined(number)) {
	            throw new DeveloperError('number is required.');
	        }
	        if (!defined(base)) {
	            throw new DeveloperError('base is required.');
	        }
	        //>>includeEnd('debug');
	        return Math.log(number) / Math.log(base);
	    };

	    /**
	     * Finds the cube root of a number.
	     * Returns NaN if <code>number</code> is not provided.
	     *
	     * @param {Number} [number] The number.
	     * @returns {Number} The result.
	     */
	    EngineMath.cbrt = defaultValue(Math.cbrt, function cbrt(number) {
	        var result = Math.pow(Math.abs(number), 1.0 / 3.0);
	        return number < 0.0 ? -result : result;
	    });

	    /**
	     * Finds the base 2 logarithm of a number.
	     *
	     * @param {Number} number The number.
	     * @returns {Number} The result.
	     */
	    EngineMath.log2 = defaultValue(Math.log2, function log2(number) {
	        return Math.log(number) * Math.LOG2E;
	    });

	    /**
	     * @private
	     */
	    EngineMath.fog = function (distanceToCamera, density) {
	        var scalar = distanceToCamera * density;
	        return 1.0 - Math.exp(-(scalar * scalar));
	    };

	    return EngineMath;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	/*
	  I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
	  so it's better encapsulated. Now you can have multiple random number generators
	  and they won't stomp all over eachother's state.

	  If you want to use this as a substitute for Math.random(), use the random()
	  method like so:

	  var m = new MersenneTwister();
	  var randomNumber = m.random();

	  You can also call the other genrand_{foo}() methods on the instance.

	  If you want to use a specific seed in order to get a repeatable random
	  sequence, pass an integer into the constructor:

	  var m = new MersenneTwister(123);

	  and that will always produce the same random sequence.

	  Sean McCullough (banksean@gmail.com)
	*/

	/*
	   A C-program for MT19937, with initialization improved 2002/1/26.
	   Coded by Takuji Nishimura and Makoto Matsumoto.

	   Before using, initialize the state by using init_genrand(seed)
	   or init_by_array(init_key, key_length).
	*/
	/**
	@license
	mersenne-twister.js - https://gist.github.com/banksean/300494

	   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
	   All rights reserved.

	   Redistribution and use in source and binary forms, with or without
	   modification, are permitted provided that the following conditions
	   are met:

	     1. Redistributions of source code must retain the above copyright
	        notice, this list of conditions and the following disclaimer.

	     2. Redistributions in binary form must reproduce the above copyright
	        notice, this list of conditions and the following disclaimer in the
	        documentation and/or other materials provided with the distribution.

	     3. The names of its contributors may not be used to endorse or promote
	        products derived from this software without specific prior written
	        permission.

	   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
	   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
	   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
	   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/
	/*
	   Any feedback is very welcome.
	   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
	   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
	*/
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	  var MersenneTwister = function MersenneTwister(seed) {
	    if (seed == undefined) {
	      seed = new Date().getTime();
	    }
	    /* Period parameters */
	    this.N = 624;
	    this.M = 397;
	    this.MATRIX_A = 0x9908b0df; /* constant vector a */
	    this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
	    this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

	    this.mt = new Array(this.N); /* the array for the state vector */
	    this.mti = this.N + 1; /* mti==N+1 means mt[N] is not initialized */

	    this.init_genrand(seed);
	  };

	  /* initializes mt[N] with a seed */
	  MersenneTwister.prototype.init_genrand = function (s) {
	    this.mt[0] = s >>> 0;
	    for (this.mti = 1; this.mti < this.N; this.mti++) {
	      var s = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30;
	      this.mt[this.mti] = (((s & 0xffff0000) >>> 16) * 1812433253 << 16) + (s & 0x0000ffff) * 1812433253 + this.mti;
	      /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
	      /* In the previous versions, MSBs of the seed affect   */
	      /* only MSBs of the array mt[].                        */
	      /* 2002/01/09 modified by Makoto Matsumoto             */
	      this.mt[this.mti] >>>= 0;
	      /* for >32 bit machines */
	    }
	  };

	  /* initialize by an array with array-length */
	  /* init_key is the array for initializing keys */
	  /* key_length is its length */
	  /* slight change for C++, 2004/2/26 */
	  //MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
	  //  var i, j, k;
	  //  this.init_genrand(19650218);
	  //  i=1; j=0;
	  //  k = (this.N>key_length ? this.N : key_length);
	  //  for (; k; k--) {
	  //    var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30)
	  //    this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
	  //      + init_key[j] + j; /* non linear */
	  //    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
	  //    i++; j++;
	  //    if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
	  //    if (j>=key_length) j=0;
	  //  }
	  //  for (k=this.N-1; k; k--) {
	  //    var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
	  //    this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
	  //      - i; /* non linear */
	  //    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
	  //    i++;
	  //    if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
	  //  }
	  //
	  //  this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
	  //}

	  /* generates a random number on [0,0xffffffff]-interval */
	  MersenneTwister.prototype.genrand_int32 = function () {
	    var y;
	    var mag01 = new Array(0x0, this.MATRIX_A);
	    /* mag01[x] = x * MATRIX_A  for x=0,1 */

	    if (this.mti >= this.N) {
	      /* generate N words at one time */
	      var kk;

	      if (this.mti == this.N + 1) /* if init_genrand() has not been called, */
	        this.init_genrand(5489); /* a default initial seed is used */

	      for (kk = 0; kk < this.N - this.M; kk++) {
	        y = this.mt[kk] & this.UPPER_MASK | this.mt[kk + 1] & this.LOWER_MASK;
	        this.mt[kk] = this.mt[kk + this.M] ^ y >>> 1 ^ mag01[y & 0x1];
	      }
	      for (; kk < this.N - 1; kk++) {
	        y = this.mt[kk] & this.UPPER_MASK | this.mt[kk + 1] & this.LOWER_MASK;
	        this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ y >>> 1 ^ mag01[y & 0x1];
	      }
	      y = this.mt[this.N - 1] & this.UPPER_MASK | this.mt[0] & this.LOWER_MASK;
	      this.mt[this.N - 1] = this.mt[this.M - 1] ^ y >>> 1 ^ mag01[y & 0x1];

	      this.mti = 0;
	    }

	    y = this.mt[this.mti++];

	    /* Tempering */
	    y ^= y >>> 11;
	    y ^= y << 7 & 0x9d2c5680;
	    y ^= y << 15 & 0xefc60000;
	    y ^= y >>> 18;

	    return y >>> 0;
	  };

	  /* generates a random number on [0,0x7fffffff]-interval */
	  //MersenneTwister.prototype.genrand_int31 = function() {
	  //  return (this.genrand_int32()>>>1);
	  //}

	  /* generates a random number on [0,1]-real-interval */
	  //MersenneTwister.prototype.genrand_real1 = function() {
	  //  return this.genrand_int32()*(1.0/4294967295.0);
	  //  /* divided by 2^32-1 */
	  //}

	  /* generates a random number on [0,1)-real-interval */
	  MersenneTwister.prototype.random = function () {
	    return this.genrand_int32() * (1.0 / 4294967296.0);
	    /* divided by 2^32 */
	  };

	  /* generates a random number on (0,1)-real-interval */
	  //MersenneTwister.prototype.genrand_real3 = function() {
	  //  return (this.genrand_int32() + 0.5)*(1.0/4294967296.0);
	  //  /* divided by 2^32 */
	  //}

	  /* generates a random number on [0,1) with 53-bit resolution*/
	  //MersenneTwister.prototype.genrand_res53 = function() {
	  //  var a=this.genrand_int32()>>>5, b=this.genrand_int32()>>>6;
	  //  return(a*67108864.0+b)*(1.0/9007199254740992.0);
	  //}

	  /* These real versions are due to Isaku Wada, 2002/01/09 added */

	  return MersenneTwister;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(3), __webpack_require__(6), __webpack_require__(4), __webpack_require__(11), __webpack_require__(7), __webpack_require__(8)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Check, defaultValue, defined, FeatureDetection, freezeObject, EngineMath) {
	    'use strict';

	    function hue2rgb(m1, m2, h) {
	        if (h < 0) {
	            h += 1;
	        }
	        if (h > 1) {
	            h -= 1;
	        }
	        if (h * 6 < 1) {
	            return m1 + (m2 - m1) * 6 * h;
	        }
	        if (h * 2 < 1) {
	            return m2;
	        }
	        if (h * 3 < 2) {
	            return m1 + (m2 - m1) * (2 / 3 - h) * 6;
	        }
	        return m1;
	    }

	    /**
	     * A color, specified using red, green, blue, and alpha values,
	     * which range from <code>0</code> (no intensity) to <code>1.0</code> (full intensity).
	     * @param {Number} [red=1.0] The red component.
	     * @param {Number} [green=1.0] The green component.
	     * @param {Number} [blue=1.0] The blue component.
	     * @param {Number} [alpha=1.0] The alpha component.
	     *
	     * @constructor
	     * @alias Color
	     *
	     * @see Packable
	     */
	    function Color(red, green, blue, alpha) {
	        /**
	         * The red component.
	         * @type {Number}
	         * @default 1.0
	         */
	        this.red = defaultValue(red, 1.0);
	        /**
	         * The green component.
	         * @type {Number}
	         * @default 1.0
	         */
	        this.green = defaultValue(green, 1.0);
	        /**
	         * The blue component.
	         * @type {Number}
	         * @default 1.0
	         */
	        this.blue = defaultValue(blue, 1.0);
	        /**
	         * The alpha component.
	         * @type {Number}
	         * @default 1.0
	         */
	        this.alpha = defaultValue(alpha, 1.0);
	    }

	    /**
	     * Creates a Color instance from a {@link Cartesian4}. <code>x</code>, <code>y</code>, <code>z</code>,
	     * and <code>w</code> map to <code>red</code>, <code>green</code>, <code>blue</code>, and <code>alpha</code>, respectively.
	     *
	     * @param {Cartesian4} cartesian The source cartesian.
	     * @param {Color} [result] The object onto which to store the result.
	     * @returns {Color} The modified result parameter or a new Color instance if one was not provided.
	     */
	    Color.fromCartesian4 = function (cartesian, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('cartesian', cartesian);
	        //>>includeEnd('debug');

	        if (!defined(result)) {
	            return new Color(cartesian.x, cartesian.y, cartesian.z, cartesian.w);
	        }

	        result.red = cartesian.x;
	        result.green = cartesian.y;
	        result.blue = cartesian.z;
	        result.alpha = cartesian.w;
	        return result;
	    };

	    /**
	     * Creates a new Color specified using red, green, blue, and alpha values
	     * that are in the range of 0 to 255, converting them internally to a range of 0.0 to 1.0.
	     *
	     * @param {Number} [red=255] The red component.
	     * @param {Number} [green=255] The green component.
	     * @param {Number} [blue=255] The blue component.
	     * @param {Number} [alpha=255] The alpha component.
	     * @param {Color} [result] The object onto which to store the result.
	     * @returns {Color} The modified result parameter or a new Color instance if one was not provided.
	     */
	    Color.fromBytes = function (red, green, blue, alpha, result) {
	        red = Color.byteToFloat(defaultValue(red, 255.0));
	        green = Color.byteToFloat(defaultValue(green, 255.0));
	        blue = Color.byteToFloat(defaultValue(blue, 255.0));
	        alpha = Color.byteToFloat(defaultValue(alpha, 255.0));

	        if (!defined(result)) {
	            return new Color(red, green, blue, alpha);
	        }

	        result.red = red;
	        result.green = green;
	        result.blue = blue;
	        result.alpha = alpha;
	        return result;
	    };

	    /**
	     * Creates a new Color that has the same red, green, and blue components
	     * of the specified color, but with the specified alpha value.
	     *
	     * @param {Color} color The base color
	     * @param {Number} alpha The new alpha component.
	     * @param {Color} [result] The object onto which to store the result.
	     * @returns {Color} The modified result parameter or a new Color instance if one was not provided.
	     *
	     * @example var translucentRed = Engine.Color.fromAlpha(Engine.Color.RED, 0.9);
	     */
	    Color.fromAlpha = function (color, alpha, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('color', color);
	        Check.typeOf.number('alpha', alpha);
	        //>>includeEnd('debug');

	        if (!defined(result)) {
	            return new Color(color.red, color.green, color.blue, alpha);
	        }

	        result.red = color.red;
	        result.green = color.green;
	        result.blue = color.blue;
	        result.alpha = alpha;
	        return result;
	    };

	    var scratchArrayBuffer;
	    var scratchUint32Array;
	    var scratchUint8Array;
	    if (FeatureDetection.supportsTypedArrays()) {
	        scratchArrayBuffer = new ArrayBuffer(4);
	        scratchUint32Array = new Uint32Array(scratchArrayBuffer);
	        scratchUint8Array = new Uint8Array(scratchArrayBuffer);
	    }

	    /**
	     * Creates a new Color from a single numeric unsigned 32-bit RGBA value, using the endianness
	     * of the system.
	     *
	     * @param {Number} rgba A single numeric unsigned 32-bit RGBA value.
	     * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
	     * @returns {Color} The color object.
	     *
	     * @example
	     * var color = Engine.Color.fromRgba(0x67ADDFFF);
	     *
	     * @see Color#toRgba
	     */
	    Color.fromRgba = function (rgba, result) {
	        // scratchUint32Array and scratchUint8Array share an underlying array buffer
	        scratchUint32Array[0] = rgba;
	        return Color.fromBytes(scratchUint8Array[0], scratchUint8Array[1], scratchUint8Array[2], scratchUint8Array[3], result);
	    };

	    /**
	     * Creates a Color instance from hue, saturation, and lightness.
	     *
	     * @param {Number} [hue=0] The hue angle 0...1
	     * @param {Number} [saturation=0] The saturation value 0...1
	     * @param {Number} [lightness=0] The lightness value 0...1
	     * @param {Number} [alpha=1.0] The alpha component 0...1
	     * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
	     * @returns {Color} The color object.
	     *
	     * @see {@link http://www.w3.org/TR/css3-color/#hsl-color|CSS color values}
	     */
	    Color.fromHsl = function (hue, saturation, lightness, alpha, result) {
	        hue = defaultValue(hue, 0.0) % 1.0;
	        saturation = defaultValue(saturation, 0.0);
	        lightness = defaultValue(lightness, 0.0);
	        alpha = defaultValue(alpha, 1.0);

	        var red = lightness;
	        var green = lightness;
	        var blue = lightness;

	        if (saturation !== 0) {
	            var m2;
	            if (lightness < 0.5) {
	                m2 = lightness * (1 + saturation);
	            } else {
	                m2 = lightness + saturation - lightness * saturation;
	            }

	            var m1 = 2.0 * lightness - m2;
	            red = hue2rgb(m1, m2, hue + 1 / 3);
	            green = hue2rgb(m1, m2, hue);
	            blue = hue2rgb(m1, m2, hue - 1 / 3);
	        }

	        if (!defined(result)) {
	            return new Color(red, green, blue, alpha);
	        }

	        result.red = red;
	        result.green = green;
	        result.blue = blue;
	        result.alpha = alpha;
	        return result;
	    };

	    /**
	     * Creates a random color using the provided options. For reproducible random colors, you should
	     * call {@link EngineMath#setRandomNumberSeed} once at the beginning of your application.
	     *
	     * @param {Object} [options] Object with the following properties:
	     * @param {Number} [options.red] If specified, the red component to use instead of a randomized value.
	     * @param {Number} [options.minimumRed=0.0] The maximum red value to generate if none was specified.
	     * @param {Number} [options.maximumRed=1.0] The minimum red value to generate if none was specified.
	     * @param {Number} [options.green] If specified, the green component to use instead of a randomized value.
	     * @param {Number} [options.minimumGreen=0.0] The maximum green value to generate if none was specified.
	     * @param {Number} [options.maximumGreen=1.0] The minimum green value to generate if none was specified.
	     * @param {Number} [options.blue] If specified, the blue component to use instead of a randomized value.
	     * @param {Number} [options.minimumBlue=0.0] The maximum blue value to generate if none was specified.
	     * @param {Number} [options.maximumBlue=1.0] The minimum blue value to generate if none was specified.
	     * @param {Number} [options.alpha] If specified, the alpha component to use instead of a randomized value.
	     * @param {Number} [options.minimumAlpha=0.0] The maximum alpha value to generate if none was specified.
	     * @param {Number} [options.maximumAlpha=1.0] The minimum alpha value to generate if none was specified.
	     * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
	     * @returns {Color} The modified result parameter or a new instance if result was undefined.
	     *
	     * @exception {DeveloperError} minimumRed must be less than or equal to maximumRed.
	     * @exception {DeveloperError} minimumGreen must be less than or equal to maximumGreen.
	     * @exception {DeveloperError} minimumBlue must be less than or equal to maximumBlue.
	     * @exception {DeveloperError} minimumAlpha must be less than or equal to maximumAlpha.
	     *
	     * @example
	     * //Create a completely random color
	     * var color = Engine.Color.fromRandom();
	     *
	     * //Create a random shade of yellow.
	     * var color = Engine.Color.fromRandom({
	     *     red : 1.0,
	     *     green : 1.0,
	     *     alpha : 1.0
	     * });
	     *
	     * //Create a random bright color.
	     * var color = Engine.Color.fromRandom({
	     *     minimumRed : 0.75,
	     *     minimumGreen : 0.75,
	     *     minimumBlue : 0.75,
	     *     alpha : 1.0
	     * });
	     */
	    Color.fromRandom = function (options, result) {
	        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

	        var red = options.red;
	        if (!defined(red)) {
	            var minimumRed = defaultValue(options.minimumRed, 0);
	            var maximumRed = defaultValue(options.maximumRed, 1.0);

	            //>>includeStart('debug', pragmas.debug);
	            Check.typeOf.number.lessThanOrEquals('minimumRed', minimumRed, maximumRed);
	            //>>includeEnd('debug');

	            red = minimumRed + EngineMath.nextRandomNumber() * (maximumRed - minimumRed);
	        }

	        var green = options.green;
	        if (!defined(green)) {
	            var minimumGreen = defaultValue(options.minimumGreen, 0);
	            var maximumGreen = defaultValue(options.maximumGreen, 1.0);

	            //>>includeStart('debug', pragmas.debug);
	            Check.typeOf.number.lessThanOrEquals('minimumGreen', minimumGreen, maximumGreen);
	            //>>includeEnd('debug');
	            green = minimumGreen + EngineMath.nextRandomNumber() * (maximumGreen - minimumGreen);
	        }

	        var blue = options.blue;
	        if (!defined(blue)) {
	            var minimumBlue = defaultValue(options.minimumBlue, 0);
	            var maximumBlue = defaultValue(options.maximumBlue, 1.0);

	            //>>includeStart('debug', pragmas.debug);
	            Check.typeOf.number.lessThanOrEquals('minimumBlue', minimumBlue, maximumBlue);
	            //>>includeEnd('debug');

	            blue = minimumBlue + EngineMath.nextRandomNumber() * (maximumBlue - minimumBlue);
	        }

	        var alpha = options.alpha;
	        if (!defined(alpha)) {
	            var minimumAlpha = defaultValue(options.minimumAlpha, 0);
	            var maximumAlpha = defaultValue(options.maximumAlpha, 1.0);

	            //>>includeStart('debug', pragmas.debug);
	            Check.typeOf.number.lessThanOrEquals('minumumAlpha', minimumAlpha, maximumAlpha);
	            //>>includeEnd('debug');

	            alpha = minimumAlpha + EngineMath.nextRandomNumber() * (maximumAlpha - minimumAlpha);
	        }

	        if (!defined(result)) {
	            return new Color(red, green, blue, alpha);
	        }

	        result.red = red;
	        result.green = green;
	        result.blue = blue;
	        result.alpha = alpha;
	        return result;
	    };

	    //#rgb
	    var rgbMatcher = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i;
	    //#rrggbb
	    var rrggbbMatcher = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
	    //rgb(), rgba(), or rgb%()
	    var rgbParenthesesMatcher = /^rgba?\(\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)(?:\s*,\s*([0-9.]+))?\s*\)$/i;
	    //hsl(), hsla(), or hsl%()
	    var hslParenthesesMatcher = /^hsla?\(\s*([0-9.]+)\s*,\s*([0-9.]+%)\s*,\s*([0-9.]+%)(?:\s*,\s*([0-9.]+))?\s*\)$/i;

	    /**
	     * Creates a Color instance from a CSS color value.
	     *
	     * @param {String} color The CSS color value in #rgb, #rrggbb, rgb(), rgba(), hsl(), or hsla() format.
	     * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
	     * @returns {Color} The color object, or undefined if the string was not a valid CSS color.
	     *
	     *
	     * @example
	     * var engineBlue = Engine.Color.fromCssColorString('#67ADDF');
	     * var green = Engine.Color.fromCssColorString('green');
	     *
	     * @see {@link http://www.w3.org/TR/css3-color|CSS color values}
	     */
	    Color.fromCssColorString = function (color, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.string('color', color);
	        //>>includeEnd('debug');

	        if (!defined(result)) {
	            result = new Color();
	        }

	        var namedColor = Color[color.toUpperCase()];
	        if (defined(namedColor)) {
	            Color.clone(namedColor, result);
	            return result;
	        }

	        var matches = rgbMatcher.exec(color);
	        if (matches !== null) {
	            result.red = parseInt(matches[1], 16) / 15;
	            result.green = parseInt(matches[2], 16) / 15.0;
	            result.blue = parseInt(matches[3], 16) / 15.0;
	            result.alpha = 1.0;
	            return result;
	        }

	        matches = rrggbbMatcher.exec(color);
	        if (matches !== null) {
	            result.red = parseInt(matches[1], 16) / 255.0;
	            result.green = parseInt(matches[2], 16) / 255.0;
	            result.blue = parseInt(matches[3], 16) / 255.0;
	            result.alpha = 1.0;
	            return result;
	        }

	        matches = rgbParenthesesMatcher.exec(color);
	        if (matches !== null) {
	            result.red = parseFloat(matches[1]) / ('%' === matches[1].substr(-1) ? 100.0 : 255.0);
	            result.green = parseFloat(matches[2]) / ('%' === matches[2].substr(-1) ? 100.0 : 255.0);
	            result.blue = parseFloat(matches[3]) / ('%' === matches[3].substr(-1) ? 100.0 : 255.0);
	            result.alpha = parseFloat(defaultValue(matches[4], '1.0'));
	            return result;
	        }

	        matches = hslParenthesesMatcher.exec(color);
	        if (matches !== null) {
	            return Color.fromHsl(parseFloat(matches[1]) / 360.0, parseFloat(matches[2]) / 100.0, parseFloat(matches[3]) / 100.0, parseFloat(defaultValue(matches[4], '1.0')), result);
	        }

	        result = undefined;
	        return result;
	    };

	    /**
	     * The number of elements used to pack the object into an array.
	     * @type {Number}
	     */
	    Color.packedLength = 4;

	    /**
	     * Stores the provided instance into the provided array.
	     *
	     * @param {Color} value The value to pack.
	     * @param {Number[]} array The array to pack into.
	     * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
	     *
	     * @returns {Number[]} The array that was packed into
	     */
	    Color.pack = function (value, array, startingIndex) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('value', value);
	        Check.defined('array', array);
	        //>>includeEnd('debug');

	        startingIndex = defaultValue(startingIndex, 0);
	        array[startingIndex++] = value.red;
	        array[startingIndex++] = value.green;
	        array[startingIndex++] = value.blue;
	        array[startingIndex] = value.alpha;

	        return array;
	    };

	    /**
	     * Retrieves an instance from a packed array.
	     *
	     * @param {Number[]} array The packed array.
	     * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
	     * @param {Color} [result] The object into which to store the result.
	     * @returns {Color} The modified result parameter or a new Color instance if one was not provided.
	     */
	    Color.unpack = function (array, startingIndex, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.defined('array', array);
	        //>>includeEnd('debug');

	        startingIndex = defaultValue(startingIndex, 0);
	        if (!defined(result)) {
	            result = new Color();
	        }
	        result.red = array[startingIndex++];
	        result.green = array[startingIndex++];
	        result.blue = array[startingIndex++];
	        result.alpha = array[startingIndex];
	        return result;
	    };

	    /**
	     * Converts a 'byte' color component in the range of 0 to 255 into
	     * a 'float' color component in the range of 0 to 1.0.
	     *
	     * @param {Number} number The number to be converted.
	     * @returns {Number} The converted number.
	     */
	    Color.byteToFloat = function (number) {
	        return number / 255.0;
	    };

	    /**
	     * Converts a 'float' color component in the range of 0 to 1.0 into
	     * a 'byte' color component in the range of 0 to 255.
	     *
	     * @param {Number} number The number to be converted.
	     * @returns {Number} The converted number.
	     */
	    Color.floatToByte = function (number) {
	        return number === 1.0 ? 255.0 : number * 256.0 | 0;
	    };

	    /**
	     * Duplicates a Color.
	     *
	     * @param {Color} color The Color to duplicate.
	     * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
	     * @returns {Color} The modified result parameter or a new instance if result was undefined. (Returns undefined if color is undefined)
	     */
	    Color.clone = function (color, result) {
	        if (!defined(color)) {
	            return undefined;
	        }
	        if (!defined(result)) {
	            return new Color(color.red, color.green, color.blue, color.alpha);
	        }
	        result.red = color.red;
	        result.green = color.green;
	        result.blue = color.blue;
	        result.alpha = color.alpha;
	        return result;
	    };

	    /**
	     * Returns true if the first Color equals the second color.
	     *
	     * @param {Color} left The first Color to compare for equality.
	     * @param {Color} right The second Color to compare for equality.
	     * @returns {Boolean} <code>true</code> if the Colors are equal; otherwise, <code>false</code>.
	     */
	    Color.equals = function (left, right) {
	        return left === right || //
	        defined(left) && //
	        defined(right) && //
	        left.red === right.red && //
	        left.green === right.green && //
	        left.blue === right.blue && //
	        left.alpha === right.alpha;
	    };

	    /**
	     * @private
	     */
	    Color.equalsArray = function (color, array, offset) {
	        return color.red === array[offset] && color.green === array[offset + 1] && color.blue === array[offset + 2] && color.alpha === array[offset + 3];
	    };

	    /**
	     * Returns a duplicate of a Color instance.
	     *
	     * @param {Color} [result] The object to store the result in, if undefined a new instance will be created.
	     * @returns {Color} The modified result parameter or a new instance if result was undefined.
	     */
	    Color.prototype.clone = function (result) {
	        return Color.clone(this, result);
	    };

	    /**
	     * Returns true if this Color equals other.
	     *
	     * @param {Color} other The Color to compare for equality.
	     * @returns {Boolean} <code>true</code> if the Colors are equal; otherwise, <code>false</code>.
	     */
	    Color.prototype.equals = function (other) {
	        return Color.equals(this, other);
	    };

	    /**
	     * Returns <code>true</code> if this Color equals other componentwise within the specified epsilon.
	     *
	     * @param {Color} other The Color to compare for equality.
	     * @param {Number} [epsilon=0.0] The epsilon to use for equality testing.
	     * @returns {Boolean} <code>true</code> if the Colors are equal within the specified epsilon; otherwise, <code>false</code>.
	     */
	    Color.prototype.equalsEpsilon = function (other, epsilon) {
	        return this === other || //
	        defined(other) && //
	        Math.abs(this.red - other.red) <= epsilon && //
	        Math.abs(this.green - other.green) <= epsilon && //
	        Math.abs(this.blue - other.blue) <= epsilon && //
	        Math.abs(this.alpha - other.alpha) <= epsilon;
	    };

	    /**
	     * Creates a string representing this Color in the format '(red, green, blue, alpha)'.
	     *
	     * @returns {String} A string representing this Color in the format '(red, green, blue, alpha)'.
	     */
	    Color.prototype.toString = function () {
	        return '(' + this.red + ', ' + this.green + ', ' + this.blue + ', ' + this.alpha + ')';
	    };

	    /**
	     * Creates a string containing the CSS color value for this color.
	     *
	     * @returns {String} The CSS equivalent of this color.
	     *
	     * @see {@link http://www.w3.org/TR/css3-color/#rgba-color|CSS RGB or RGBA color values}
	     */
	    Color.prototype.toCssColorString = function () {
	        var red = Color.floatToByte(this.red);
	        var green = Color.floatToByte(this.green);
	        var blue = Color.floatToByte(this.blue);
	        if (this.alpha === 1) {
	            return 'rgb(' + red + ',' + green + ',' + blue + ')';
	        }
	        return 'rgba(' + red + ',' + green + ',' + blue + ',' + this.alpha + ')';
	    };

	    /**
	     * Converts this color to an array of red, green, blue, and alpha values
	     * that are in the range of 0 to 255.
	     *
	     * @param {Number[]} [result] The array to store the result in, if undefined a new instance will be created.
	     * @returns {Number[]} The modified result parameter or a new instance if result was undefined.
	     */
	    Color.prototype.toBytes = function (result) {
	        var red = Color.floatToByte(this.red);
	        var green = Color.floatToByte(this.green);
	        var blue = Color.floatToByte(this.blue);
	        var alpha = Color.floatToByte(this.alpha);

	        if (!defined(result)) {
	            return [red, green, blue, alpha];
	        }
	        result[0] = red;
	        result[1] = green;
	        result[2] = blue;
	        result[3] = alpha;
	        return result;
	    };

	    /**
	     * Converts this color to a single numeric unsigned 32-bit RGBA value, using the endianness
	     * of the system.
	     *
	     * @returns {Number} A single numeric unsigned 32-bit RGBA value.
	     *
	     *
	     * @example
	     * var rgba = Engine.Color.BLUE.toRgba();
	     *
	     * @see Color.fromRgba
	     */
	    Color.prototype.toRgba = function () {
	        // scratchUint32Array and scratchUint8Array share an underlying array buffer
	        scratchUint8Array[0] = Color.floatToByte(this.red);
	        scratchUint8Array[1] = Color.floatToByte(this.green);
	        scratchUint8Array[2] = Color.floatToByte(this.blue);
	        scratchUint8Array[3] = Color.floatToByte(this.alpha);
	        return scratchUint32Array[0];
	    };

	    /**
	     * Brightens this color by the provided magnitude.
	     *
	     * @param {Number} magnitude A positive number indicating the amount to brighten.
	     * @param {Color} result The object onto which to store the result.
	     * @returns {Color} The modified result parameter.
	     *
	     * @example
	     * var brightBlue = Engine.Color.BLUE.brighten(0.5, new Engine.Color());
	     */
	    Color.prototype.brighten = function (magnitude, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.number('magnitude', magnitude);
	        Check.typeOf.number.greaterThanOrEquals('magnitude', magnitude, 0.0);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        magnitude = 1.0 - magnitude;
	        result.red = 1.0 - (1.0 - this.red) * magnitude;
	        result.green = 1.0 - (1.0 - this.green) * magnitude;
	        result.blue = 1.0 - (1.0 - this.blue) * magnitude;
	        result.alpha = this.alpha;
	        return result;
	    };

	    /**
	     * Darkens this color by the provided magnitude.
	     *
	     * @param {Number} magnitude A positive number indicating the amount to darken.
	     * @param {Color} result The object onto which to store the result.
	     * @returns {Color} The modified result parameter.
	     *
	     * @example
	     * var darkBlue = Engine.Color.BLUE.darken(0.5, new Engine.Color());
	     */
	    Color.prototype.darken = function (magnitude, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.number('magnitude', magnitude);
	        Check.typeOf.number.greaterThanOrEquals('magnitude', magnitude, 0.0);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        magnitude = 1.0 - magnitude;
	        result.red = this.red * magnitude;
	        result.green = this.green * magnitude;
	        result.blue = this.blue * magnitude;
	        result.alpha = this.alpha;
	        return result;
	    };

	    /**
	     * Creates a new Color that has the same red, green, and blue components
	     * as this Color, but with the specified alpha value.
	     *
	     * @param {Number} alpha The new alpha component.
	     * @param {Color} [result] The object onto which to store the result.
	     * @returns {Color} The modified result parameter or a new Color instance if one was not provided.
	     *
	     * @example var translucentRed = Engine.Color.RED.withAlpha(0.9);
	     */
	    Color.prototype.withAlpha = function (alpha, result) {
	        return Color.fromAlpha(this, alpha, result);
	    };

	    /**
	     * Computes the componentwise sum of two Colors.
	     *
	     * @param {Color} left The first Color.
	     * @param {Color} right The second Color.
	     * @param {Color} result The object onto which to store the result.
	     * @returns {Color} The modified result parameter.
	     */
	    Color.add = function (left, right, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('left', left);
	        Check.typeOf.object('right', right);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        result.red = left.red + right.red;
	        result.green = left.green + right.green;
	        result.blue = left.blue + right.blue;
	        result.alpha = left.alpha + right.alpha;
	        return result;
	    };

	    /**
	     * Computes the componentwise difference of two Colors.
	     *
	     * @param {Color} left The first Color.
	     * @param {Color} right The second Color.
	     * @param {Color} result The object onto which to store the result.
	     * @returns {Color} The modified result parameter.
	     */
	    Color.subtract = function (left, right, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('left', left);
	        Check.typeOf.object('right', right);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        result.red = left.red - right.red;
	        result.green = left.green - right.green;
	        result.blue = left.blue - right.blue;
	        result.alpha = left.alpha - right.alpha;
	        return result;
	    };

	    /**
	     * Computes the componentwise product of two Colors.
	     *
	     * @param {Color} left The first Color.
	     * @param {Color} right The second Color.
	     * @param {Color} result The object onto which to store the result.
	     * @returns {Color} The modified result parameter.
	     */
	    Color.multiply = function (left, right, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('left', left);
	        Check.typeOf.object('right', right);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        result.red = left.red * right.red;
	        result.green = left.green * right.green;
	        result.blue = left.blue * right.blue;
	        result.alpha = left.alpha * right.alpha;
	        return result;
	    };

	    /**
	     * Computes the componentwise quotient of two Colors.
	     *
	     * @param {Color} left The first Color.
	     * @param {Color} right The second Color.
	     * @param {Color} result The object onto which to store the result.
	     * @returns {Color} The modified result parameter.
	     */
	    Color.divide = function (left, right, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('left', left);
	        Check.typeOf.object('right', right);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        result.red = left.red / right.red;
	        result.green = left.green / right.green;
	        result.blue = left.blue / right.blue;
	        result.alpha = left.alpha / right.alpha;
	        return result;
	    };

	    /**
	     * Computes the componentwise modulus of two Colors.
	     *
	     * @param {Color} left The first Color.
	     * @param {Color} right The second Color.
	     * @param {Color} result The object onto which to store the result.
	     * @returns {Color} The modified result parameter.
	     */
	    Color.mod = function (left, right, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('left', left);
	        Check.typeOf.object('right', right);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        result.red = left.red % right.red;
	        result.green = left.green % right.green;
	        result.blue = left.blue % right.blue;
	        result.alpha = left.alpha % right.alpha;
	        return result;
	    };

	    /**
	     * Multiplies the provided Color componentwise by the provided scalar.
	     *
	     * @param {Color} color The Color to be scaled.
	     * @param {Number} scalar The scalar to multiply with.
	     * @param {Color} result The object onto which to store the result.
	     * @returns {Color} The modified result parameter.
	     */
	    Color.multiplyByScalar = function (color, scalar, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('color', color);
	        Check.typeOf.number('scalar', scalar);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        result.red = color.red * scalar;
	        result.green = color.green * scalar;
	        result.blue = color.blue * scalar;
	        result.alpha = color.alpha * scalar;
	        return result;
	    };

	    /**
	     * Divides the provided Color componentwise by the provided scalar.
	     *
	     * @param {Color} color The Color to be divided.
	     * @param {Number} scalar The scalar to divide with.
	     * @param {Color} result The object onto which to store the result.
	     * @returns {Color} The modified result parameter.
	     */
	    Color.divideByScalar = function (color, scalar, result) {
	        //>>includeStart('debug', pragmas.debug);
	        Check.typeOf.object('color', color);
	        Check.typeOf.number('scalar', scalar);
	        Check.typeOf.object('result', result);
	        //>>includeEnd('debug');

	        result.red = color.red / scalar;
	        result.green = color.green / scalar;
	        result.blue = color.blue / scalar;
	        result.alpha = color.alpha / scalar;
	        return result;
	    };

	    /**
	     * An immutable Color instance initialized to CSS color #F0F8FF
	     * <span class="colorSwath" style="background: #F0F8FF;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.ALICEBLUE = freezeObject(Color.fromCssColorString('#F0F8FF'));

	    /**
	     * An immutable Color instance initialized to CSS color #FAEBD7
	     * <span class="colorSwath" style="background: #FAEBD7;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.ANTIQUEWHITE = freezeObject(Color.fromCssColorString('#FAEBD7'));

	    /**
	     * An immutable Color instance initialized to CSS color #00FFFF
	     * <span class="colorSwath" style="background: #00FFFF;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.AQUA = freezeObject(Color.fromCssColorString('#00FFFF'));

	    /**
	     * An immutable Color instance initialized to CSS color #7FFFD4
	     * <span class="colorSwath" style="background: #7FFFD4;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.AQUAMARINE = freezeObject(Color.fromCssColorString('#7FFFD4'));

	    /**
	     * An immutable Color instance initialized to CSS color #F0FFFF
	     * <span class="colorSwath" style="background: #F0FFFF;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.AZURE = freezeObject(Color.fromCssColorString('#F0FFFF'));

	    /**
	     * An immutable Color instance initialized to CSS color #F5F5DC
	     * <span class="colorSwath" style="background: #F5F5DC;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.BEIGE = freezeObject(Color.fromCssColorString('#F5F5DC'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFE4C4
	     * <span class="colorSwath" style="background: #FFE4C4;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.BISQUE = freezeObject(Color.fromCssColorString('#FFE4C4'));

	    /**
	     * An immutable Color instance initialized to CSS color #000000
	     * <span class="colorSwath" style="background: #000000;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.BLACK = freezeObject(Color.fromCssColorString('#000000'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFEBCD
	     * <span class="colorSwath" style="background: #FFEBCD;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.BLANCHEDALMOND = freezeObject(Color.fromCssColorString('#FFEBCD'));

	    /**
	     * An immutable Color instance initialized to CSS color #0000FF
	     * <span class="colorSwath" style="background: #0000FF;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.BLUE = freezeObject(Color.fromCssColorString('#0000FF'));

	    /**
	     * An immutable Color instance initialized to CSS color #8A2BE2
	     * <span class="colorSwath" style="background: #8A2BE2;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.BLUEVIOLET = freezeObject(Color.fromCssColorString('#8A2BE2'));

	    /**
	     * An immutable Color instance initialized to CSS color #A52A2A
	     * <span class="colorSwath" style="background: #A52A2A;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.BROWN = freezeObject(Color.fromCssColorString('#A52A2A'));

	    /**
	     * An immutable Color instance initialized to CSS color #DEB887
	     * <span class="colorSwath" style="background: #DEB887;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.BURLYWOOD = freezeObject(Color.fromCssColorString('#DEB887'));

	    /**
	     * An immutable Color instance initialized to CSS color #5F9EA0
	     * <span class="colorSwath" style="background: #5F9EA0;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.CADETBLUE = freezeObject(Color.fromCssColorString('#5F9EA0'));
	    /**
	     * An immutable Color instance initialized to CSS color #7FFF00
	     * <span class="colorSwath" style="background: #7FFF00;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.CHARTREUSE = freezeObject(Color.fromCssColorString('#7FFF00'));

	    /**
	     * An immutable Color instance initialized to CSS color #D2691E
	     * <span class="colorSwath" style="background: #D2691E;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.CHOCOLATE = freezeObject(Color.fromCssColorString('#D2691E'));

	    /**
	     * An immutable Color instance initialized to CSS color #FF7F50
	     * <span class="colorSwath" style="background: #FF7F50;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.CORAL = freezeObject(Color.fromCssColorString('#FF7F50'));

	    /**
	     * An immutable Color instance initialized to CSS color #6495ED
	     * <span class="colorSwath" style="background: #6495ED;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.CORNFLOWERBLUE = freezeObject(Color.fromCssColorString('#6495ED'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFF8DC
	     * <span class="colorSwath" style="background: #FFF8DC;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.CORNSILK = freezeObject(Color.fromCssColorString('#FFF8DC'));

	    /**
	     * An immutable Color instance initialized to CSS color #DC143C
	     * <span class="colorSwath" style="background: #DC143C;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.CRIMSON = freezeObject(Color.fromCssColorString('#DC143C'));

	    /**
	     * An immutable Color instance initialized to CSS color #00FFFF
	     * <span class="colorSwath" style="background: #00FFFF;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.CYAN = freezeObject(Color.fromCssColorString('#00FFFF'));

	    /**
	     * An immutable Color instance initialized to CSS color #00008B
	     * <span class="colorSwath" style="background: #00008B;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKBLUE = freezeObject(Color.fromCssColorString('#00008B'));

	    /**
	     * An immutable Color instance initialized to CSS color #008B8B
	     * <span class="colorSwath" style="background: #008B8B;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKCYAN = freezeObject(Color.fromCssColorString('#008B8B'));

	    /**
	     * An immutable Color instance initialized to CSS color #B8860B
	     * <span class="colorSwath" style="background: #B8860B;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKGOLDENROD = freezeObject(Color.fromCssColorString('#B8860B'));

	    /**
	     * An immutable Color instance initialized to CSS color #A9A9A9
	     * <span class="colorSwath" style="background: #A9A9A9;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKGRAY = freezeObject(Color.fromCssColorString('#A9A9A9'));

	    /**
	     * An immutable Color instance initialized to CSS color #006400
	     * <span class="colorSwath" style="background: #006400;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKGREEN = freezeObject(Color.fromCssColorString('#006400'));

	    /**
	     * An immutable Color instance initialized to CSS color #A9A9A9
	     * <span class="colorSwath" style="background: #A9A9A9;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKGREY = Color.DARKGRAY;

	    /**
	     * An immutable Color instance initialized to CSS color #BDB76B
	     * <span class="colorSwath" style="background: #BDB76B;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKKHAKI = freezeObject(Color.fromCssColorString('#BDB76B'));

	    /**
	     * An immutable Color instance initialized to CSS color #8B008B
	     * <span class="colorSwath" style="background: #8B008B;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKMAGENTA = freezeObject(Color.fromCssColorString('#8B008B'));

	    /**
	     * An immutable Color instance initialized to CSS color #556B2F
	     * <span class="colorSwath" style="background: #556B2F;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKOLIVEGREEN = freezeObject(Color.fromCssColorString('#556B2F'));

	    /**
	     * An immutable Color instance initialized to CSS color #FF8C00
	     * <span class="colorSwath" style="background: #FF8C00;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKORANGE = freezeObject(Color.fromCssColorString('#FF8C00'));

	    /**
	     * An immutable Color instance initialized to CSS color #9932CC
	     * <span class="colorSwath" style="background: #9932CC;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKORCHID = freezeObject(Color.fromCssColorString('#9932CC'));

	    /**
	     * An immutable Color instance initialized to CSS color #8B0000
	     * <span class="colorSwath" style="background: #8B0000;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKRED = freezeObject(Color.fromCssColorString('#8B0000'));

	    /**
	     * An immutable Color instance initialized to CSS color #E9967A
	     * <span class="colorSwath" style="background: #E9967A;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKSALMON = freezeObject(Color.fromCssColorString('#E9967A'));

	    /**
	     * An immutable Color instance initialized to CSS color #8FBC8F
	     * <span class="colorSwath" style="background: #8FBC8F;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKSEAGREEN = freezeObject(Color.fromCssColorString('#8FBC8F'));

	    /**
	     * An immutable Color instance initialized to CSS color #483D8B
	     * <span class="colorSwath" style="background: #483D8B;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKSLATEBLUE = freezeObject(Color.fromCssColorString('#483D8B'));

	    /**
	     * An immutable Color instance initialized to CSS color #2F4F4F
	     * <span class="colorSwath" style="background: #2F4F4F;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKSLATEGRAY = freezeObject(Color.fromCssColorString('#2F4F4F'));

	    /**
	     * An immutable Color instance initialized to CSS color #2F4F4F
	     * <span class="colorSwath" style="background: #2F4F4F;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKSLATEGREY = Color.DARKSLATEGRAY;

	    /**
	     * An immutable Color instance initialized to CSS color #00CED1
	     * <span class="colorSwath" style="background: #00CED1;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKTURQUOISE = freezeObject(Color.fromCssColorString('#00CED1'));

	    /**
	     * An immutable Color instance initialized to CSS color #9400D3
	     * <span class="colorSwath" style="background: #9400D3;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DARKVIOLET = freezeObject(Color.fromCssColorString('#9400D3'));

	    /**
	     * An immutable Color instance initialized to CSS color #FF1493
	     * <span class="colorSwath" style="background: #FF1493;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DEEPPINK = freezeObject(Color.fromCssColorString('#FF1493'));

	    /**
	     * An immutable Color instance initialized to CSS color #00BFFF
	     * <span class="colorSwath" style="background: #00BFFF;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DEEPSKYBLUE = freezeObject(Color.fromCssColorString('#00BFFF'));

	    /**
	     * An immutable Color instance initialized to CSS color #696969
	     * <span class="colorSwath" style="background: #696969;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DIMGRAY = freezeObject(Color.fromCssColorString('#696969'));

	    /**
	     * An immutable Color instance initialized to CSS color #696969
	     * <span class="colorSwath" style="background: #696969;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DIMGREY = Color.DIMGRAY;

	    /**
	     * An immutable Color instance initialized to CSS color #1E90FF
	     * <span class="colorSwath" style="background: #1E90FF;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.DODGERBLUE = freezeObject(Color.fromCssColorString('#1E90FF'));

	    /**
	     * An immutable Color instance initialized to CSS color #B22222
	     * <span class="colorSwath" style="background: #B22222;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.FIREBRICK = freezeObject(Color.fromCssColorString('#B22222'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFFAF0
	     * <span class="colorSwath" style="background: #FFFAF0;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.FLORALWHITE = freezeObject(Color.fromCssColorString('#FFFAF0'));

	    /**
	     * An immutable Color instance initialized to CSS color #228B22
	     * <span class="colorSwath" style="background: #228B22;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.FORESTGREEN = freezeObject(Color.fromCssColorString('#228B22'));

	    /**
	     * An immutable Color instance initialized to CSS color #FF00FF
	     * <span class="colorSwath" style="background: #FF00FF;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.FUCHSIA = freezeObject(Color.fromCssColorString('#FF00FF'));

	    /**
	     * An immutable Color instance initialized to CSS color #DCDCDC
	     * <span class="colorSwath" style="background: #DCDCDC;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.GAINSBORO = freezeObject(Color.fromCssColorString('#DCDCDC'));

	    /**
	     * An immutable Color instance initialized to CSS color #F8F8FF
	     * <span class="colorSwath" style="background: #F8F8FF;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.GHOSTWHITE = freezeObject(Color.fromCssColorString('#F8F8FF'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFD700
	     * <span class="colorSwath" style="background: #FFD700;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.GOLD = freezeObject(Color.fromCssColorString('#FFD700'));

	    /**
	     * An immutable Color instance initialized to CSS color #DAA520
	     * <span class="colorSwath" style="background: #DAA520;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.GOLDENROD = freezeObject(Color.fromCssColorString('#DAA520'));

	    /**
	     * An immutable Color instance initialized to CSS color #808080
	     * <span class="colorSwath" style="background: #808080;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.GRAY = freezeObject(Color.fromCssColorString('#808080'));

	    /**
	     * An immutable Color instance initialized to CSS color #008000
	     * <span class="colorSwath" style="background: #008000;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.GREEN = freezeObject(Color.fromCssColorString('#008000'));

	    /**
	     * An immutable Color instance initialized to CSS color #ADFF2F
	     * <span class="colorSwath" style="background: #ADFF2F;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.GREENYELLOW = freezeObject(Color.fromCssColorString('#ADFF2F'));

	    /**
	     * An immutable Color instance initialized to CSS color #808080
	     * <span class="colorSwath" style="background: #808080;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.GREY = Color.GRAY;

	    /**
	     * An immutable Color instance initialized to CSS color #F0FFF0
	     * <span class="colorSwath" style="background: #F0FFF0;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.HONEYDEW = freezeObject(Color.fromCssColorString('#F0FFF0'));

	    /**
	     * An immutable Color instance initialized to CSS color #FF69B4
	     * <span class="colorSwath" style="background: #FF69B4;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.HOTPINK = freezeObject(Color.fromCssColorString('#FF69B4'));

	    /**
	     * An immutable Color instance initialized to CSS color #CD5C5C
	     * <span class="colorSwath" style="background: #CD5C5C;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.INDIANRED = freezeObject(Color.fromCssColorString('#CD5C5C'));

	    /**
	     * An immutable Color instance initialized to CSS color #4B0082
	     * <span class="colorSwath" style="background: #4B0082;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.INDIGO = freezeObject(Color.fromCssColorString('#4B0082'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFFFF0
	     * <span class="colorSwath" style="background: #FFFFF0;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.IVORY = freezeObject(Color.fromCssColorString('#FFFFF0'));

	    /**
	     * An immutable Color instance initialized to CSS color #F0E68C
	     * <span class="colorSwath" style="background: #F0E68C;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.KHAKI = freezeObject(Color.fromCssColorString('#F0E68C'));

	    /**
	     * An immutable Color instance initialized to CSS color #E6E6FA
	     * <span class="colorSwath" style="background: #E6E6FA;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LAVENDER = freezeObject(Color.fromCssColorString('#E6E6FA'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFF0F5
	     * <span class="colorSwath" style="background: #FFF0F5;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LAVENDAR_BLUSH = freezeObject(Color.fromCssColorString('#FFF0F5'));

	    /**
	     * An immutable Color instance initialized to CSS color #7CFC00
	     * <span class="colorSwath" style="background: #7CFC00;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LAWNGREEN = freezeObject(Color.fromCssColorString('#7CFC00'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFFACD
	     * <span class="colorSwath" style="background: #FFFACD;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LEMONCHIFFON = freezeObject(Color.fromCssColorString('#FFFACD'));

	    /**
	     * An immutable Color instance initialized to CSS color #ADD8E6
	     * <span class="colorSwath" style="background: #ADD8E6;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LIGHTBLUE = freezeObject(Color.fromCssColorString('#ADD8E6'));

	    /**
	     * An immutable Color instance initialized to CSS color #F08080
	     * <span class="colorSwath" style="background: #F08080;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LIGHTCORAL = freezeObject(Color.fromCssColorString('#F08080'));

	    /**
	     * An immutable Color instance initialized to CSS color #E0FFFF
	     * <span class="colorSwath" style="background: #E0FFFF;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LIGHTCYAN = freezeObject(Color.fromCssColorString('#E0FFFF'));

	    /**
	     * An immutable Color instance initialized to CSS color #FAFAD2
	     * <span class="colorSwath" style="background: #FAFAD2;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LIGHTGOLDENRODYELLOW = freezeObject(Color.fromCssColorString('#FAFAD2'));

	    /**
	     * An immutable Color instance initialized to CSS color #D3D3D3
	     * <span class="colorSwath" style="background: #D3D3D3;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LIGHTGRAY = freezeObject(Color.fromCssColorString('#D3D3D3'));

	    /**
	     * An immutable Color instance initialized to CSS color #90EE90
	     * <span class="colorSwath" style="background: #90EE90;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LIGHTGREEN = freezeObject(Color.fromCssColorString('#90EE90'));

	    /**
	     * An immutable Color instance initialized to CSS color #D3D3D3
	     * <span class="colorSwath" style="background: #D3D3D3;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LIGHTGREY = Color.LIGHTGRAY;

	    /**
	     * An immutable Color instance initialized to CSS color #FFB6C1
	     * <span class="colorSwath" style="background: #FFB6C1;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LIGHTPINK = freezeObject(Color.fromCssColorString('#FFB6C1'));

	    /**
	     * An immutable Color instance initialized to CSS color #20B2AA
	     * <span class="colorSwath" style="background: #20B2AA;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LIGHTSEAGREEN = freezeObject(Color.fromCssColorString('#20B2AA'));

	    /**
	     * An immutable Color instance initialized to CSS color #87CEFA
	     * <span class="colorSwath" style="background: #87CEFA;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LIGHTSKYBLUE = freezeObject(Color.fromCssColorString('#87CEFA'));

	    /**
	     * An immutable Color instance initialized to CSS color #778899
	     * <span class="colorSwath" style="background: #778899;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LIGHTSLATEGRAY = freezeObject(Color.fromCssColorString('#778899'));

	    /**
	     * An immutable Color instance initialized to CSS color #778899
	     * <span class="colorSwath" style="background: #778899;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LIGHTSLATEGREY = Color.LIGHTSLATEGRAY;

	    /**
	     * An immutable Color instance initialized to CSS color #B0C4DE
	     * <span class="colorSwath" style="background: #B0C4DE;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LIGHTSTEELBLUE = freezeObject(Color.fromCssColorString('#B0C4DE'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFFFE0
	     * <span class="colorSwath" style="background: #FFFFE0;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LIGHTYELLOW = freezeObject(Color.fromCssColorString('#FFFFE0'));

	    /**
	     * An immutable Color instance initialized to CSS color #00FF00
	     * <span class="colorSwath" style="background: #00FF00;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LIME = freezeObject(Color.fromCssColorString('#00FF00'));

	    /**
	     * An immutable Color instance initialized to CSS color #32CD32
	     * <span class="colorSwath" style="background: #32CD32;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LIMEGREEN = freezeObject(Color.fromCssColorString('#32CD32'));

	    /**
	     * An immutable Color instance initialized to CSS color #FAF0E6
	     * <span class="colorSwath" style="background: #FAF0E6;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.LINEN = freezeObject(Color.fromCssColorString('#FAF0E6'));

	    /**
	     * An immutable Color instance initialized to CSS color #FF00FF
	     * <span class="colorSwath" style="background: #FF00FF;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.MAGENTA = freezeObject(Color.fromCssColorString('#FF00FF'));

	    /**
	     * An immutable Color instance initialized to CSS color #800000
	     * <span class="colorSwath" style="background: #800000;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.MAROON = freezeObject(Color.fromCssColorString('#800000'));

	    /**
	     * An immutable Color instance initialized to CSS color #66CDAA
	     * <span class="colorSwath" style="background: #66CDAA;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.MEDIUMAQUAMARINE = freezeObject(Color.fromCssColorString('#66CDAA'));

	    /**
	     * An immutable Color instance initialized to CSS color #0000CD
	     * <span class="colorSwath" style="background: #0000CD;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.MEDIUMBLUE = freezeObject(Color.fromCssColorString('#0000CD'));

	    /**
	     * An immutable Color instance initialized to CSS color #BA55D3
	     * <span class="colorSwath" style="background: #BA55D3;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.MEDIUMORCHID = freezeObject(Color.fromCssColorString('#BA55D3'));

	    /**
	     * An immutable Color instance initialized to CSS color #9370DB
	     * <span class="colorSwath" style="background: #9370DB;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.MEDIUMPURPLE = freezeObject(Color.fromCssColorString('#9370DB'));

	    /**
	     * An immutable Color instance initialized to CSS color #3CB371
	     * <span class="colorSwath" style="background: #3CB371;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.MEDIUMSEAGREEN = freezeObject(Color.fromCssColorString('#3CB371'));

	    /**
	     * An immutable Color instance initialized to CSS color #7B68EE
	     * <span class="colorSwath" style="background: #7B68EE;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.MEDIUMSLATEBLUE = freezeObject(Color.fromCssColorString('#7B68EE'));

	    /**
	     * An immutable Color instance initialized to CSS color #00FA9A
	     * <span class="colorSwath" style="background: #00FA9A;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.MEDIUMSPRINGGREEN = freezeObject(Color.fromCssColorString('#00FA9A'));

	    /**
	     * An immutable Color instance initialized to CSS color #48D1CC
	     * <span class="colorSwath" style="background: #48D1CC;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.MEDIUMTURQUOISE = freezeObject(Color.fromCssColorString('#48D1CC'));

	    /**
	     * An immutable Color instance initialized to CSS color #C71585
	     * <span class="colorSwath" style="background: #C71585;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.MEDIUMVIOLETRED = freezeObject(Color.fromCssColorString('#C71585'));

	    /**
	     * An immutable Color instance initialized to CSS color #191970
	     * <span class="colorSwath" style="background: #191970;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.MIDNIGHTBLUE = freezeObject(Color.fromCssColorString('#191970'));

	    /**
	     * An immutable Color instance initialized to CSS color #F5FFFA
	     * <span class="colorSwath" style="background: #F5FFFA;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.MINTCREAM = freezeObject(Color.fromCssColorString('#F5FFFA'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFE4E1
	     * <span class="colorSwath" style="background: #FFE4E1;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.MISTYROSE = freezeObject(Color.fromCssColorString('#FFE4E1'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFE4B5
	     * <span class="colorSwath" style="background: #FFE4B5;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.MOCCASIN = freezeObject(Color.fromCssColorString('#FFE4B5'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFDEAD
	     * <span class="colorSwath" style="background: #FFDEAD;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.NAVAJOWHITE = freezeObject(Color.fromCssColorString('#FFDEAD'));

	    /**
	     * An immutable Color instance initialized to CSS color #000080
	     * <span class="colorSwath" style="background: #000080;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.NAVY = freezeObject(Color.fromCssColorString('#000080'));

	    /**
	     * An immutable Color instance initialized to CSS color #FDF5E6
	     * <span class="colorSwath" style="background: #FDF5E6;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.OLDLACE = freezeObject(Color.fromCssColorString('#FDF5E6'));

	    /**
	     * An immutable Color instance initialized to CSS color #808000
	     * <span class="colorSwath" style="background: #808000;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.OLIVE = freezeObject(Color.fromCssColorString('#808000'));

	    /**
	     * An immutable Color instance initialized to CSS color #6B8E23
	     * <span class="colorSwath" style="background: #6B8E23;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.OLIVEDRAB = freezeObject(Color.fromCssColorString('#6B8E23'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFA500
	     * <span class="colorSwath" style="background: #FFA500;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.ORANGE = freezeObject(Color.fromCssColorString('#FFA500'));

	    /**
	     * An immutable Color instance initialized to CSS color #FF4500
	     * <span class="colorSwath" style="background: #FF4500;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.ORANGERED = freezeObject(Color.fromCssColorString('#FF4500'));

	    /**
	     * An immutable Color instance initialized to CSS color #DA70D6
	     * <span class="colorSwath" style="background: #DA70D6;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.ORCHID = freezeObject(Color.fromCssColorString('#DA70D6'));

	    /**
	     * An immutable Color instance initialized to CSS color #EEE8AA
	     * <span class="colorSwath" style="background: #EEE8AA;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.PALEGOLDENROD = freezeObject(Color.fromCssColorString('#EEE8AA'));

	    /**
	     * An immutable Color instance initialized to CSS color #98FB98
	     * <span class="colorSwath" style="background: #98FB98;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.PALEGREEN = freezeObject(Color.fromCssColorString('#98FB98'));

	    /**
	     * An immutable Color instance initialized to CSS color #AFEEEE
	     * <span class="colorSwath" style="background: #AFEEEE;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.PALETURQUOISE = freezeObject(Color.fromCssColorString('#AFEEEE'));

	    /**
	     * An immutable Color instance initialized to CSS color #DB7093
	     * <span class="colorSwath" style="background: #DB7093;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.PALEVIOLETRED = freezeObject(Color.fromCssColorString('#DB7093'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFEFD5
	     * <span class="colorSwath" style="background: #FFEFD5;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.PAPAYAWHIP = freezeObject(Color.fromCssColorString('#FFEFD5'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFDAB9
	     * <span class="colorSwath" style="background: #FFDAB9;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.PEACHPUFF = freezeObject(Color.fromCssColorString('#FFDAB9'));

	    /**
	     * An immutable Color instance initialized to CSS color #CD853F
	     * <span class="colorSwath" style="background: #CD853F;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.PERU = freezeObject(Color.fromCssColorString('#CD853F'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFC0CB
	     * <span class="colorSwath" style="background: #FFC0CB;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.PINK = freezeObject(Color.fromCssColorString('#FFC0CB'));

	    /**
	     * An immutable Color instance initialized to CSS color #DDA0DD
	     * <span class="colorSwath" style="background: #DDA0DD;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.PLUM = freezeObject(Color.fromCssColorString('#DDA0DD'));

	    /**
	     * An immutable Color instance initialized to CSS color #B0E0E6
	     * <span class="colorSwath" style="background: #B0E0E6;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.POWDERBLUE = freezeObject(Color.fromCssColorString('#B0E0E6'));

	    /**
	     * An immutable Color instance initialized to CSS color #800080
	     * <span class="colorSwath" style="background: #800080;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.PURPLE = freezeObject(Color.fromCssColorString('#800080'));

	    /**
	     * An immutable Color instance initialized to CSS color #FF0000
	     * <span class="colorSwath" style="background: #FF0000;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.RED = freezeObject(Color.fromCssColorString('#FF0000'));

	    /**
	     * An immutable Color instance initialized to CSS color #BC8F8F
	     * <span class="colorSwath" style="background: #BC8F8F;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.ROSYBROWN = freezeObject(Color.fromCssColorString('#BC8F8F'));

	    /**
	     * An immutable Color instance initialized to CSS color #4169E1
	     * <span class="colorSwath" style="background: #4169E1;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.ROYALBLUE = freezeObject(Color.fromCssColorString('#4169E1'));

	    /**
	     * An immutable Color instance initialized to CSS color #8B4513
	     * <span class="colorSwath" style="background: #8B4513;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.SADDLEBROWN = freezeObject(Color.fromCssColorString('#8B4513'));

	    /**
	     * An immutable Color instance initialized to CSS color #FA8072
	     * <span class="colorSwath" style="background: #FA8072;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.SALMON = freezeObject(Color.fromCssColorString('#FA8072'));

	    /**
	     * An immutable Color instance initialized to CSS color #F4A460
	     * <span class="colorSwath" style="background: #F4A460;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.SANDYBROWN = freezeObject(Color.fromCssColorString('#F4A460'));

	    /**
	     * An immutable Color instance initialized to CSS color #2E8B57
	     * <span class="colorSwath" style="background: #2E8B57;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.SEAGREEN = freezeObject(Color.fromCssColorString('#2E8B57'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFF5EE
	     * <span class="colorSwath" style="background: #FFF5EE;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.SEASHELL = freezeObject(Color.fromCssColorString('#FFF5EE'));

	    /**
	     * An immutable Color instance initialized to CSS color #A0522D
	     * <span class="colorSwath" style="background: #A0522D;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.SIENNA = freezeObject(Color.fromCssColorString('#A0522D'));

	    /**
	     * An immutable Color instance initialized to CSS color #C0C0C0
	     * <span class="colorSwath" style="background: #C0C0C0;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.SILVER = freezeObject(Color.fromCssColorString('#C0C0C0'));

	    /**
	     * An immutable Color instance initialized to CSS color #87CEEB
	     * <span class="colorSwath" style="background: #87CEEB;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.SKYBLUE = freezeObject(Color.fromCssColorString('#87CEEB'));

	    /**
	     * An immutable Color instance initialized to CSS color #6A5ACD
	     * <span class="colorSwath" style="background: #6A5ACD;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.SLATEBLUE = freezeObject(Color.fromCssColorString('#6A5ACD'));

	    /**
	     * An immutable Color instance initialized to CSS color #708090
	     * <span class="colorSwath" style="background: #708090;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.SLATEGRAY = freezeObject(Color.fromCssColorString('#708090'));

	    /**
	     * An immutable Color instance initialized to CSS color #708090
	     * <span class="colorSwath" style="background: #708090;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.SLATEGREY = Color.SLATEGRAY;

	    /**
	     * An immutable Color instance initialized to CSS color #FFFAFA
	     * <span class="colorSwath" style="background: #FFFAFA;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.SNOW = freezeObject(Color.fromCssColorString('#FFFAFA'));

	    /**
	     * An immutable Color instance initialized to CSS color #00FF7F
	     * <span class="colorSwath" style="background: #00FF7F;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.SPRINGGREEN = freezeObject(Color.fromCssColorString('#00FF7F'));

	    /**
	     * An immutable Color instance initialized to CSS color #4682B4
	     * <span class="colorSwath" style="background: #4682B4;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.STEELBLUE = freezeObject(Color.fromCssColorString('#4682B4'));

	    /**
	     * An immutable Color instance initialized to CSS color #D2B48C
	     * <span class="colorSwath" style="background: #D2B48C;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.TAN = freezeObject(Color.fromCssColorString('#D2B48C'));

	    /**
	     * An immutable Color instance initialized to CSS color #008080
	     * <span class="colorSwath" style="background: #008080;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.TEAL = freezeObject(Color.fromCssColorString('#008080'));

	    /**
	     * An immutable Color instance initialized to CSS color #D8BFD8
	     * <span class="colorSwath" style="background: #D8BFD8;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.THISTLE = freezeObject(Color.fromCssColorString('#D8BFD8'));

	    /**
	     * An immutable Color instance initialized to CSS color #FF6347
	     * <span class="colorSwath" style="background: #FF6347;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.TOMATO = freezeObject(Color.fromCssColorString('#FF6347'));

	    /**
	     * An immutable Color instance initialized to CSS color #40E0D0
	     * <span class="colorSwath" style="background: #40E0D0;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.TURQUOISE = freezeObject(Color.fromCssColorString('#40E0D0'));

	    /**
	     * An immutable Color instance initialized to CSS color #EE82EE
	     * <span class="colorSwath" style="background: #EE82EE;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.VIOLET = freezeObject(Color.fromCssColorString('#EE82EE'));

	    /**
	     * An immutable Color instance initialized to CSS color #F5DEB3
	     * <span class="colorSwath" style="background: #F5DEB3;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.WHEAT = freezeObject(Color.fromCssColorString('#F5DEB3'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFFFFF
	     * <span class="colorSwath" style="background: #FFFFFF;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.WHITE = freezeObject(Color.fromCssColorString('#FFFFFF'));

	    /**
	     * An immutable Color instance initialized to CSS color #F5F5F5
	     * <span class="colorSwath" style="background: #F5F5F5;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.WHITESMOKE = freezeObject(Color.fromCssColorString('#F5F5F5'));

	    /**
	     * An immutable Color instance initialized to CSS color #FFFF00
	     * <span class="colorSwath" style="background: #FFFF00;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.YELLOW = freezeObject(Color.fromCssColorString('#FFFF00'));

	    /**
	     * An immutable Color instance initialized to CSS color #9ACD32
	     * <span class="colorSwath" style="background: #9ACD32;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.YELLOWGREEN = freezeObject(Color.fromCssColorString('#9ACD32'));

	    /**
	     * An immutable Color instance initialized to CSS transparent.
	     * <span class="colorSwath" style="background: transparent;"></span>
	     *
	     * @constant
	     * @type {Color}
	     */
	    Color.TRANSPARENT = freezeObject(new Color(0, 0, 0, 0));

	    return Color;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(6), __webpack_require__(4), __webpack_require__(13)], __WEBPACK_AMD_DEFINE_RESULT__ = function (defaultValue, defined, Fullscreen) {
	    'use strict';
	    /*global CanvasPixelArray*/

	    var theNavigator;
	    if (typeof navigator !== 'undefined') {
	        theNavigator = navigator;
	    } else {
	        theNavigator = {};
	    }

	    function extractVersion(versionString) {
	        var parts = versionString.split('.');
	        for (var i = 0, len = parts.length; i < len; ++i) {
	            parts[i] = parseInt(parts[i], 10);
	        }
	        return parts;
	    }

	    var isChromeResult;
	    var chromeVersionResult;
	    function isChrome() {
	        if (!defined(isChromeResult)) {
	            isChromeResult = false;
	            // Edge contains Chrome in the user agent too
	            if (!isEdge()) {
	                var fields = / Chrome\/([\.0-9]+)/.exec(theNavigator.userAgent);
	                if (fields !== null) {
	                    isChromeResult = true;
	                    chromeVersionResult = extractVersion(fields[1]);
	                }
	            }
	        }

	        return isChromeResult;
	    }

	    function chromeVersion() {
	        return isChrome() && chromeVersionResult;
	    }

	    var isSafariResult;
	    var safariVersionResult;
	    function isSafari() {
	        if (!defined(isSafariResult)) {
	            isSafariResult = false;

	            // Chrome and Edge contain Safari in the user agent too
	            if (!isChrome() && !isEdge() && / Safari\/[\.0-9]+/.test(theNavigator.userAgent)) {
	                var fields = / Version\/([\.0-9]+)/.exec(theNavigator.userAgent);
	                if (fields !== null) {
	                    isSafariResult = true;
	                    safariVersionResult = extractVersion(fields[1]);
	                }
	            }
	        }

	        return isSafariResult;
	    }

	    function safariVersion() {
	        return isSafari() && safariVersionResult;
	    }

	    var isWebkitResult;
	    var webkitVersionResult;
	    function isWebkit() {
	        if (!defined(isWebkitResult)) {
	            isWebkitResult = false;

	            var fields = / AppleWebKit\/([\.0-9]+)(\+?)/.exec(theNavigator.userAgent);
	            if (fields !== null) {
	                isWebkitResult = true;
	                webkitVersionResult = extractVersion(fields[1]);
	                webkitVersionResult.isNightly = !!fields[2];
	            }
	        }

	        return isWebkitResult;
	    }

	    function webkitVersion() {
	        return isWebkit() && webkitVersionResult;
	    }

	    var isInternetExplorerResult;
	    var internetExplorerVersionResult;
	    function isInternetExplorer() {
	        if (!defined(isInternetExplorerResult)) {
	            isInternetExplorerResult = false;

	            var fields;
	            if (theNavigator.appName === 'Microsoft Internet Explorer') {
	                fields = /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(theNavigator.userAgent);
	                if (fields !== null) {
	                    isInternetExplorerResult = true;
	                    internetExplorerVersionResult = extractVersion(fields[1]);
	                }
	            } else if (theNavigator.appName === 'Netscape') {
	                fields = /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(theNavigator.userAgent);
	                if (fields !== null) {
	                    isInternetExplorerResult = true;
	                    internetExplorerVersionResult = extractVersion(fields[1]);
	                }
	            }
	        }
	        return isInternetExplorerResult;
	    }

	    function internetExplorerVersion() {
	        return isInternetExplorer() && internetExplorerVersionResult;
	    }

	    var isEdgeResult;
	    var edgeVersionResult;
	    function isEdge() {
	        if (!defined(isEdgeResult)) {
	            isEdgeResult = false;
	            var fields = / Edge\/([\.0-9]+)/.exec(theNavigator.userAgent);
	            if (fields !== null) {
	                isEdgeResult = true;
	                edgeVersionResult = extractVersion(fields[1]);
	            }
	        }
	        return isEdgeResult;
	    }

	    function edgeVersion() {
	        return isEdge() && edgeVersionResult;
	    }

	    var isFirefoxResult;
	    var firefoxVersionResult;
	    function isFirefox() {
	        if (!defined(isFirefoxResult)) {
	            isFirefoxResult = false;

	            var fields = /Firefox\/([\.0-9]+)/.exec(theNavigator.userAgent);
	            if (fields !== null) {
	                isFirefoxResult = true;
	                firefoxVersionResult = extractVersion(fields[1]);
	            }
	        }
	        return isFirefoxResult;
	    }

	    var isWindowsResult;
	    function isWindows() {
	        if (!defined(isWindowsResult)) {
	            isWindowsResult = /Windows/i.test(theNavigator.appVersion);
	        }
	        return isWindowsResult;
	    }

	    function firefoxVersion() {
	        return isFirefox() && firefoxVersionResult;
	    }

	    var isNodeJsResult;
	    function isNodeJs() {
	        if (!defined(isNodeJsResult)) {
	            isNodeJsResult = (typeof process === 'undefined' ? 'undefined' : _typeof(process)) === 'object' && Object.prototype.toString.call(process) === '[object process]'; // eslint-disable-line
	        }
	        return isNodeJsResult;
	    }

	    var hasPointerEvents;
	    function supportsPointerEvents() {
	        if (!defined(hasPointerEvents)) {
	            //While navigator.pointerEnabled is deprecated in the W3C specification
	            //we still need to use it if it exists in order to support browsers
	            //that rely on it, such as the Windows WebBrowser control which defines
	            //PointerEvent but sets navigator.pointerEnabled to false.
	            hasPointerEvents = typeof PointerEvent !== 'undefined' && (!defined(theNavigator.pointerEnabled) || theNavigator.pointerEnabled);
	        }
	        return hasPointerEvents;
	    }

	    var imageRenderingValueResult;
	    var supportsImageRenderingPixelatedResult;
	    function supportsImageRenderingPixelated() {
	        if (!defined(supportsImageRenderingPixelatedResult)) {
	            var canvas = document.createElement('canvas');
	            canvas.setAttribute('style', 'image-rendering: -moz-crisp-edges;' + 'image-rendering: pixelated;');
	            //canvas.style.imageRendering will be undefined, null or an empty string on unsupported browsers.
	            var tmp = canvas.style.imageRendering;
	            supportsImageRenderingPixelatedResult = defined(tmp) && tmp !== '';
	            if (supportsImageRenderingPixelatedResult) {
	                imageRenderingValueResult = tmp;
	            }
	        }
	        return supportsImageRenderingPixelatedResult;
	    }

	    function imageRenderingValue() {
	        return supportsImageRenderingPixelated() ? imageRenderingValueResult : undefined;
	    }

	    var typedArrayTypes = [];
	    if (typeof ArrayBuffer !== 'undefined') {
	        typedArrayTypes.push(Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array);

	        if (typeof Uint8ClampedArray !== 'undefined') {
	            typedArrayTypes.push(Uint8ClampedArray);
	        }

	        if (typeof CanvasPixelArray !== 'undefined') {
	            typedArrayTypes.push(CanvasPixelArray);
	        }
	    }

	    /**
	     * A set of functions to detect whether the current browser supports
	     * various features.
	     *
	     * @exports FeatureDetection
	     */
	    var FeatureDetection = {
	        isChrome: isChrome,
	        chromeVersion: chromeVersion,
	        isSafari: isSafari,
	        safariVersion: safariVersion,
	        isWebkit: isWebkit,
	        webkitVersion: webkitVersion,
	        isInternetExplorer: isInternetExplorer,
	        internetExplorerVersion: internetExplorerVersion,
	        isEdge: isEdge,
	        edgeVersion: edgeVersion,
	        isFirefox: isFirefox,
	        firefoxVersion: firefoxVersion,
	        isWindows: isWindows,
	        isNodeJs: isNodeJs,
	        hardwareConcurrency: defaultValue(theNavigator.hardwareConcurrency, 3),
	        supportsPointerEvents: supportsPointerEvents,
	        supportsImageRenderingPixelated: supportsImageRenderingPixelated,
	        imageRenderingValue: imageRenderingValue,
	        typedArrayTypes: typedArrayTypes
	    };

	    /**
	     * Detects whether the current browser supports the full screen standard.
	     *
	     * @returns {Boolean} true if the browser supports the full screen standard, false if not.
	     *
	     * @see Fullscreen
	     * @see {@link http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html|W3C Fullscreen Living Specification}
	     */
	    FeatureDetection.supportsFullscreen = function () {
	        return Fullscreen.supportsFullscreen();
	    };

	    /**
	     * Detects whether the current browser supports typed arrays.
	     *
	     * @returns {Boolean} true if the browser supports typed arrays, false if not.
	     *
	     * @see {@link http://www.khronos.org/registry/typedarray/specs/latest/|Typed Array Specification}
	     */
	    FeatureDetection.supportsTypedArrays = function () {
	        return typeof ArrayBuffer !== 'undefined';
	    };

	    /**
	     * Detects whether the current browser supports Web Workers.
	     *
	     * @returns {Boolean} true if the browsers supports Web Workers, false if not.
	     *
	     * @see {@link http://www.w3.org/TR/workers/}
	     */
	    FeatureDetection.supportsWebWorkers = function () {
	        return typeof Worker !== 'undefined';
	    };

	    /**
	     * Detects whether the current browser supports Web Assembly.
	     *
	     * @returns {Boolean} true if the browsers supports Web Assembly, false if not.
	     *
	     * @see {@link https://developer.mozilla.org/en-US/docs/WebAssembly}
	     */
	    FeatureDetection.supportsWebAssembly = function () {
	        return typeof WebAssembly !== 'undefined' && !FeatureDetection.isEdge();
	    };

	    return FeatureDetection;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4), __webpack_require__(14)], __WEBPACK_AMD_DEFINE_RESULT__ = function (defined, defineProperties) {
	    'use strict';

	    var _supportsFullscreen;
	    var _names = {
	        requestFullscreen: undefined,
	        exitFullscreen: undefined,
	        fullscreenEnabled: undefined,
	        fullscreenElement: undefined,
	        fullscreenchange: undefined,
	        fullscreenerror: undefined
	    };

	    /**
	     * Browser-independent functions for working with the standard fullscreen API.
	     *
	     * @exports Fullscreen
	     *
	     * @see {@link http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html|W3C Fullscreen Living Specification}
	     */
	    var Fullscreen = {};

	    defineProperties(Fullscreen, {
	        /**
	         * The element that is currently fullscreen, if any.  To simply check if the
	         * browser is in fullscreen mode or not, use {@link Fullscreen#fullscreen}.
	         * @memberof Fullscreen
	         * @type {Object}
	         * @readonly
	         */
	        element: {
	            get: function get() {
	                if (!Fullscreen.supportsFullscreen()) {
	                    return undefined;
	                }

	                return document[_names.fullscreenElement];
	            }
	        },

	        /**
	         * The name of the event on the document that is fired when fullscreen is
	         * entered or exited.  This event name is intended for use with addEventListener.
	         * In your event handler, to determine if the browser is in fullscreen mode or not,
	         * use {@link Fullscreen#fullscreen}.
	         * @memberof Fullscreen
	         * @type {String}
	         * @readonly
	         */
	        changeEventName: {
	            get: function get() {
	                if (!Fullscreen.supportsFullscreen()) {
	                    return undefined;
	                }

	                return _names.fullscreenchange;
	            }
	        },

	        /**
	         * The name of the event that is fired when a fullscreen error
	         * occurs.  This event name is intended for use with addEventListener.
	         * @memberof Fullscreen
	         * @type {String}
	         * @readonly
	         */
	        errorEventName: {
	            get: function get() {
	                if (!Fullscreen.supportsFullscreen()) {
	                    return undefined;
	                }

	                return _names.fullscreenerror;
	            }
	        },

	        /**
	         * Determine whether the browser will allow an element to be made fullscreen, or not.
	         * For example, by default, iframes cannot go fullscreen unless the containing page
	         * adds an "allowfullscreen" attribute (or prefixed equivalent).
	         * @memberof Fullscreen
	         * @type {Boolean}
	         * @readonly
	         */
	        enabled: {
	            get: function get() {
	                if (!Fullscreen.supportsFullscreen()) {
	                    return undefined;
	                }

	                return document[_names.fullscreenEnabled];
	            }
	        },

	        /**
	         * Determines if the browser is currently in fullscreen mode.
	         * @memberof Fullscreen
	         * @type {Boolean}
	         * @readonly
	         */
	        fullscreen: {
	            get: function get() {
	                if (!Fullscreen.supportsFullscreen()) {
	                    return undefined;
	                }

	                return Fullscreen.element !== null;
	            }
	        }
	    });

	    /**
	     * Detects whether the browser supports the standard fullscreen API.
	     *
	     * @returns {Boolean} <code>true</code> if the browser supports the standard fullscreen API,
	     * <code>false</code> otherwise.
	     */
	    Fullscreen.supportsFullscreen = function () {
	        if (defined(_supportsFullscreen)) {
	            return _supportsFullscreen;
	        }

	        _supportsFullscreen = false;

	        var body = document.body;
	        if (typeof body.requestFullscreen === 'function') {
	            // go with the unprefixed, standard set of names
	            _names.requestFullscreen = 'requestFullscreen';
	            _names.exitFullscreen = 'exitFullscreen';
	            _names.fullscreenEnabled = 'fullscreenEnabled';
	            _names.fullscreenElement = 'fullscreenElement';
	            _names.fullscreenchange = 'fullscreenchange';
	            _names.fullscreenerror = 'fullscreenerror';
	            _supportsFullscreen = true;
	            return _supportsFullscreen;
	        }

	        //check for the correct combination of prefix plus the various names that browsers use
	        var prefixes = ['webkit', 'moz', 'o', 'ms', 'khtml'];
	        var name;
	        for (var i = 0, len = prefixes.length; i < len; ++i) {
	            var prefix = prefixes[i];

	            // casing of Fullscreen differs across browsers
	            name = prefix + 'RequestFullscreen';
	            if (typeof body[name] === 'function') {
	                _names.requestFullscreen = name;
	                _supportsFullscreen = true;
	            } else {
	                name = prefix + 'RequestFullScreen';
	                if (typeof body[name] === 'function') {
	                    _names.requestFullscreen = name;
	                    _supportsFullscreen = true;
	                }
	            }

	            // disagreement about whether it's "exit" as per spec, or "cancel"
	            name = prefix + 'ExitFullscreen';
	            if (typeof document[name] === 'function') {
	                _names.exitFullscreen = name;
	            } else {
	                name = prefix + 'CancelFullScreen';
	                if (typeof document[name] === 'function') {
	                    _names.exitFullscreen = name;
	                }
	            }

	            // casing of Fullscreen differs across browsers
	            name = prefix + 'FullscreenEnabled';
	            if (document[name] !== undefined) {
	                _names.fullscreenEnabled = name;
	            } else {
	                name = prefix + 'FullScreenEnabled';
	                if (document[name] !== undefined) {
	                    _names.fullscreenEnabled = name;
	                }
	            }

	            // casing of Fullscreen differs across browsers
	            name = prefix + 'FullscreenElement';
	            if (document[name] !== undefined) {
	                _names.fullscreenElement = name;
	            } else {
	                name = prefix + 'FullScreenElement';
	                if (document[name] !== undefined) {
	                    _names.fullscreenElement = name;
	                }
	            }

	            // thankfully, event names are all lowercase per spec
	            name = prefix + 'fullscreenchange';
	            // event names do not have 'on' in the front, but the property on the document does
	            if (document['on' + name] !== undefined) {
	                //except on IE
	                if (prefix === 'ms') {
	                    name = 'MSFullscreenChange';
	                }
	                _names.fullscreenchange = name;
	            }

	            name = prefix + 'fullscreenerror';
	            if (document['on' + name] !== undefined) {
	                //except on IE
	                if (prefix === 'ms') {
	                    name = 'MSFullscreenError';
	                }
	                _names.fullscreenerror = name;
	            }
	        }

	        return _supportsFullscreen;
	    };

	    /**
	     * Asynchronously requests the browser to enter fullscreen mode on the given element.
	     * If fullscreen mode is not supported by the browser, does nothing.
	     *
	     * @param {Object} element The HTML element which will be placed into fullscreen mode.
	     * @param {HMDVRDevice} [vrDevice] The VR device.
	     *
	     * @example
	     * // Put the entire page into fullscreen.
	     * Engine.Fullscreen.requestFullscreen(document.body)
	     *
	     * // Place only the Engine canvas into fullscreen.
	     * Engine.Fullscreen.requestFullscreen(scene.canvas)
	     */
	    Fullscreen.requestFullscreen = function (element, vrDevice) {
	        if (!Fullscreen.supportsFullscreen()) {
	            return;
	        }

	        element[_names.requestFullscreen]({ vrDisplay: vrDevice });
	    };

	    /**
	     * Asynchronously exits fullscreen mode.  If the browser is not currently
	     * in fullscreen, or if fullscreen mode is not supported by the browser, does nothing.
	     */
	    Fullscreen.exitFullscreen = function () {
	        if (!Fullscreen.supportsFullscreen()) {
	            return;
	        }

	        document[_names.exitFullscreen]();
	    };

	    return Fullscreen;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function (defined) {
	    'use strict';

	    var definePropertyWorks = function () {
	        try {
	            return 'x' in Object.defineProperty({}, 'x', {});
	        } catch (e) {
	            return false;
	        }
	    }();

	    /**
	     * Defines properties on an object, using Object.defineProperties if available,
	     * otherwise returns the object unchanged.  This function should be used in
	     * setup code to prevent errors from completely halting JavaScript execution
	     * in legacy browsers.
	     *
	     * @private
	     *
	     * @exports defineProperties
	     */
	    var defineProperties = Object.defineProperties;
	    if (!definePropertyWorks || !defined(defineProperties)) {
	        defineProperties = function defineProperties(o) {
	            return o;
	        };
	    }

	    return defineProperties;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @module  color-interpolate
	 * Pick color from palette by index
	 */

	var parse = __webpack_require__(16);
	var hsl = __webpack_require__(20);
	var lerp = __webpack_require__(22);
	var clamp = __webpack_require__(23);

	module.exports = interpolate;

	function interpolate(palette) {
		palette = palette.map(function (c) {
			c = parse(c);
			if (c.space != 'rgb') {
				if (c.space != 'hsl') throw c.space + ' space is not supported.';
				c.values = hsl.rgb(c.values);
			}
			c.values.push(c.alpha);
			return c.values;
		});

		return function (t) {
			var mix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : lerp;

			t = clamp(t, 0, 1);

			var idx = (palette.length - 1) * t,
			    lIdx = Math.floor(idx),
			    rIdx = Math.ceil(idx);

			t = idx - lIdx;

			var lColor = palette[lIdx],
			    rColor = palette[rIdx];

			var result = lColor.map(function (v, i) {
				v = mix(v, rColor[i], t);
				if (i < 3) v = Math.round(v);
				return v;
			});

			return result;
		};
	}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * @module color-parse
	 */

	'use strict'

	var names = __webpack_require__(17)
	var isObject = __webpack_require__(18)
	var defined = __webpack_require__(19)

	module.exports = parse

	/**
	 * Base hues
	 * http://dev.w3.org/csswg/css-color/#typedef-named-hue
	 */
	//FIXME: use external hue detector
	var baseHues = {
		red: 0,
		orange: 60,
		yellow: 120,
		green: 180,
		blue: 240,
		purple: 300
	}

	/**
	 * Parse color from the string passed
	 *
	 * @return {Object} A space indicator `space`, an array `values` and `alpha`
	 */
	function parse (cstr) {
		var m, parts = [], alpha = 1, space

		if (typeof cstr === 'string') {
			//keyword
			if (names[cstr]) {
				parts = names[cstr].slice()
				space = 'rgb'
			}

			//reserved words
			else if (cstr === 'transparent') {
				alpha = 0
				space = 'rgb'
				parts = [0,0,0]
			}

			//hex
			else if (/^#[A-Fa-f0-9]+$/.test(cstr)) {
				var base = cstr.slice(1)
				var size = base.length
				var isShort = size <= 4
				alpha = 1

				if (isShort) {
					parts = [
						parseInt(base[0] + base[0], 16),
						parseInt(base[1] + base[1], 16),
						parseInt(base[2] + base[2], 16)
					]
					if (size === 4) {
						alpha = parseInt(base[3] + base[3], 16) / 255
					}
				}
				else {
					parts = [
						parseInt(base[0] + base[1], 16),
						parseInt(base[2] + base[3], 16),
						parseInt(base[4] + base[5], 16)
					]
					if (size === 8) {
						alpha = parseInt(base[6] + base[7], 16) / 255
					}
				}

				if (!parts[0]) parts[0] = 0
				if (!parts[1]) parts[1] = 0
				if (!parts[2]) parts[2] = 0

				space = 'rgb'
			}

			//color space
			else if (m = /^((?:rgb|hs[lvb]|hwb|cmyk?|xy[zy]|gray|lab|lchu?v?|[ly]uv|lms)a?)\s*\(([^\)]*)\)/.exec(cstr)) {
				var name = m[1]
				var base = name.replace(/a$/, '')
				space = base
				var size = base === 'cmyk' ? 4 : base === 'gray' ? 1 : 3
				parts = m[2].trim()
					.split(/\s*,\s*/)
					.map(function (x, i) {
						//<percentage>
						if (/%$/.test(x)) {
							//alpha
							if (i === size)	return parseFloat(x) / 100
							//rgb
							if (base === 'rgb') return parseFloat(x) * 255 / 100
							return parseFloat(x)
						}
						//hue
						else if (base[i] === 'h') {
							//<deg>
							if (/deg$/.test(x)) {
								return parseFloat(x)
							}
							//<base-hue>
							else if (baseHues[x] !== undefined) {
								return baseHues[x]
							}
						}
						return parseFloat(x)
					})

				if (name === base) parts.push(1)
				alpha = parts[size] === undefined ? 1 : parts[size]
				parts = parts.slice(0, size)
			}

			//named channels case
			else if (cstr.length > 10 && /[0-9](?:\s|\/)/.test(cstr)) {
				parts = cstr.match(/([0-9]+)/g).map(function (value) {
					return parseFloat(value)
				})

				space = cstr.match(/([a-z])/ig).join('').toLowerCase()
			}
		}

		//numeric case
		else if (typeof cstr === 'number') {
			space = 'rgb'
			parts = [cstr >>> 16, (cstr & 0x00ff00) >>> 8, cstr & 0x0000ff]
		}

		//object case - detects css cases of rgb and hsl
		else if (isObject(cstr)) {
			var r = defined(cstr.r, cstr.red, cstr.R, null)

			if (r !== null) {
				space = 'rgb'
				parts = [
					r,
					defined(cstr.g, cstr.green, cstr.G),
					defined(cstr.b, cstr.blue, cstr.B)
				]
			}
			else {
				space = 'hsl'
				parts = [
					defined(cstr.h, cstr.hue, cstr.H),
					defined(cstr.s, cstr.saturation, cstr.S),
					defined(cstr.l, cstr.lightness, cstr.L, cstr.b, cstr.brightness)
				]
			}

			alpha = defined(cstr.a, cstr.alpha, cstr.opacity, 1)

			if (cstr.opacity != null) alpha /= 100
		}

		//array
		else if (Array.isArray(cstr) || global.ArrayBuffer && ArrayBuffer.isView && ArrayBuffer.isView(cstr)) {
			parts = [cstr[0], cstr[1], cstr[2]]
			space = 'rgb'
			alpha = cstr.length === 4 ? cstr[3] : 1
		}

		return {
			space: space,
			values: parts,
			alpha: alpha
		}
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	'use strict'

	module.exports = {
		"aliceblue": [240, 248, 255],
		"antiquewhite": [250, 235, 215],
		"aqua": [0, 255, 255],
		"aquamarine": [127, 255, 212],
		"azure": [240, 255, 255],
		"beige": [245, 245, 220],
		"bisque": [255, 228, 196],
		"black": [0, 0, 0],
		"blanchedalmond": [255, 235, 205],
		"blue": [0, 0, 255],
		"blueviolet": [138, 43, 226],
		"brown": [165, 42, 42],
		"burlywood": [222, 184, 135],
		"cadetblue": [95, 158, 160],
		"chartreuse": [127, 255, 0],
		"chocolate": [210, 105, 30],
		"coral": [255, 127, 80],
		"cornflowerblue": [100, 149, 237],
		"cornsilk": [255, 248, 220],
		"crimson": [220, 20, 60],
		"cyan": [0, 255, 255],
		"darkblue": [0, 0, 139],
		"darkcyan": [0, 139, 139],
		"darkgoldenrod": [184, 134, 11],
		"darkgray": [169, 169, 169],
		"darkgreen": [0, 100, 0],
		"darkgrey": [169, 169, 169],
		"darkkhaki": [189, 183, 107],
		"darkmagenta": [139, 0, 139],
		"darkolivegreen": [85, 107, 47],
		"darkorange": [255, 140, 0],
		"darkorchid": [153, 50, 204],
		"darkred": [139, 0, 0],
		"darksalmon": [233, 150, 122],
		"darkseagreen": [143, 188, 143],
		"darkslateblue": [72, 61, 139],
		"darkslategray": [47, 79, 79],
		"darkslategrey": [47, 79, 79],
		"darkturquoise": [0, 206, 209],
		"darkviolet": [148, 0, 211],
		"deeppink": [255, 20, 147],
		"deepskyblue": [0, 191, 255],
		"dimgray": [105, 105, 105],
		"dimgrey": [105, 105, 105],
		"dodgerblue": [30, 144, 255],
		"firebrick": [178, 34, 34],
		"floralwhite": [255, 250, 240],
		"forestgreen": [34, 139, 34],
		"fuchsia": [255, 0, 255],
		"gainsboro": [220, 220, 220],
		"ghostwhite": [248, 248, 255],
		"gold": [255, 215, 0],
		"goldenrod": [218, 165, 32],
		"gray": [128, 128, 128],
		"green": [0, 128, 0],
		"greenyellow": [173, 255, 47],
		"grey": [128, 128, 128],
		"honeydew": [240, 255, 240],
		"hotpink": [255, 105, 180],
		"indianred": [205, 92, 92],
		"indigo": [75, 0, 130],
		"ivory": [255, 255, 240],
		"khaki": [240, 230, 140],
		"lavender": [230, 230, 250],
		"lavenderblush": [255, 240, 245],
		"lawngreen": [124, 252, 0],
		"lemonchiffon": [255, 250, 205],
		"lightblue": [173, 216, 230],
		"lightcoral": [240, 128, 128],
		"lightcyan": [224, 255, 255],
		"lightgoldenrodyellow": [250, 250, 210],
		"lightgray": [211, 211, 211],
		"lightgreen": [144, 238, 144],
		"lightgrey": [211, 211, 211],
		"lightpink": [255, 182, 193],
		"lightsalmon": [255, 160, 122],
		"lightseagreen": [32, 178, 170],
		"lightskyblue": [135, 206, 250],
		"lightslategray": [119, 136, 153],
		"lightslategrey": [119, 136, 153],
		"lightsteelblue": [176, 196, 222],
		"lightyellow": [255, 255, 224],
		"lime": [0, 255, 0],
		"limegreen": [50, 205, 50],
		"linen": [250, 240, 230],
		"magenta": [255, 0, 255],
		"maroon": [128, 0, 0],
		"mediumaquamarine": [102, 205, 170],
		"mediumblue": [0, 0, 205],
		"mediumorchid": [186, 85, 211],
		"mediumpurple": [147, 112, 219],
		"mediumseagreen": [60, 179, 113],
		"mediumslateblue": [123, 104, 238],
		"mediumspringgreen": [0, 250, 154],
		"mediumturquoise": [72, 209, 204],
		"mediumvioletred": [199, 21, 133],
		"midnightblue": [25, 25, 112],
		"mintcream": [245, 255, 250],
		"mistyrose": [255, 228, 225],
		"moccasin": [255, 228, 181],
		"navajowhite": [255, 222, 173],
		"navy": [0, 0, 128],
		"oldlace": [253, 245, 230],
		"olive": [128, 128, 0],
		"olivedrab": [107, 142, 35],
		"orange": [255, 165, 0],
		"orangered": [255, 69, 0],
		"orchid": [218, 112, 214],
		"palegoldenrod": [238, 232, 170],
		"palegreen": [152, 251, 152],
		"paleturquoise": [175, 238, 238],
		"palevioletred": [219, 112, 147],
		"papayawhip": [255, 239, 213],
		"peachpuff": [255, 218, 185],
		"peru": [205, 133, 63],
		"pink": [255, 192, 203],
		"plum": [221, 160, 221],
		"powderblue": [176, 224, 230],
		"purple": [128, 0, 128],
		"rebeccapurple": [102, 51, 153],
		"red": [255, 0, 0],
		"rosybrown": [188, 143, 143],
		"royalblue": [65, 105, 225],
		"saddlebrown": [139, 69, 19],
		"salmon": [250, 128, 114],
		"sandybrown": [244, 164, 96],
		"seagreen": [46, 139, 87],
		"seashell": [255, 245, 238],
		"sienna": [160, 82, 45],
		"silver": [192, 192, 192],
		"skyblue": [135, 206, 235],
		"slateblue": [106, 90, 205],
		"slategray": [112, 128, 144],
		"slategrey": [112, 128, 144],
		"snow": [255, 250, 250],
		"springgreen": [0, 255, 127],
		"steelblue": [70, 130, 180],
		"tan": [210, 180, 140],
		"teal": [0, 128, 128],
		"thistle": [216, 191, 216],
		"tomato": [255, 99, 71],
		"turquoise": [64, 224, 208],
		"violet": [238, 130, 238],
		"wheat": [245, 222, 179],
		"white": [255, 255, 255],
		"whitesmoke": [245, 245, 245],
		"yellow": [255, 255, 0],
		"yellowgreen": [154, 205, 50]
	};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

	'use strict';
	var toString = Object.prototype.toString;

	module.exports = function (x) {
		var prototype;
		return toString.call(x) === '[object Object]' && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
	};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

	module.exports = function () {
	    for (var i = 0; i < arguments.length; i++) {
	        if (arguments[i] !== undefined) return arguments[i];
	    }
	};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @module color-space/hsl
	 */
	'use strict'

	var rgb = __webpack_require__(21);

	module.exports = {
		name: 'hsl',
		min: [0,0,0],
		max: [360,100,100],
		channel: ['hue', 'saturation', 'lightness'],
		alias: ['HSL'],

		rgb: function(hsl) {
			var h = hsl[0] / 360,
					s = hsl[1] / 100,
					l = hsl[2] / 100,
					t1, t2, t3, rgb, val;

			if (s === 0) {
				val = l * 255;
				return [val, val, val];
			}

			if (l < 0.5) {
				t2 = l * (1 + s);
			}
			else {
				t2 = l + s - l * s;
			}
			t1 = 2 * l - t2;

			rgb = [0, 0, 0];
			for (var i = 0; i < 3; i++) {
				t3 = h + 1 / 3 * - (i - 1);
				if (t3 < 0) {
					t3++;
				}
				else if (t3 > 1) {
					t3--;
				}

				if (6 * t3 < 1) {
					val = t1 + (t2 - t1) * 6 * t3;
				}
				else if (2 * t3 < 1) {
					val = t2;
				}
				else if (3 * t3 < 2) {
					val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
				}
				else {
					val = t1;
				}

				rgb[i] = val * 255;
			}

			return rgb;
		}
	};


	//extend rgb
	rgb.hsl = function(rgb) {
		var r = rgb[0]/255,
				g = rgb[1]/255,
				b = rgb[2]/255,
				min = Math.min(r, g, b),
				max = Math.max(r, g, b),
				delta = max - min,
				h, s, l;

		if (max === min) {
			h = 0;
		}
		else if (r === max) {
			h = (g - b) / delta;
		}
		else if (g === max) {
			h = 2 + (b - r) / delta;
		}
		else if (b === max) {
			h = 4 + (r - g)/ delta;
		}

		h = Math.min(h * 60, 360);

		if (h < 0) {
			h += 360;
		}

		l = (min + max) / 2;

		if (max === min) {
			s = 0;
		}
		else if (l <= 0.5) {
			s = delta / (max + min);
		}
		else {
			s = delta / (2 - max - min);
		}

		return [h, s * 100, l * 100];
	};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

	/**
	 * RGB space.
	 *
	 * @module  color-space/rgb
	 */
	'use strict'

	module.exports = {
		name: 'rgb',
		min: [0,0,0],
		max: [255,255,255],
		channel: ['red', 'green', 'blue'],
		alias: ['RGB']
	};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

	function lerp(v0, v1, t) {
	    return v0*(1-t)+v1*t
	}
	module.exports = lerp

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	/**
	 * Clamp value.
	 * Detects proper clamp min/max.
	 *
	 * @param {number} a Current value to cut off
	 * @param {number} min One side limit
	 * @param {number} max Other side limit
	 *
	 * @return {number} Clamped value
	 */
	'use strict';
	module.exports = function(a, min, max){
		return max > min ? Math.max(Math.min(a,max),min) : Math.max(Math.min(a,min),max);
	};


/***/ })
/******/ ]);