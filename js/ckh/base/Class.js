/*  This is NOT:
 *	Prototype JavaScript framework
 *	
 *
 *	This is:
 *	only the CLASS FUNCTIONALITY of the
 *
 *	Prototype JavaScript framework, version 1.7
 *  (c) 2005-2010 Sam Stephenson
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/

var Class = (function() {
	
	var _toString = Object.prototype.toString,
		FUNCTION_CLASS = '[object Function]';
		
	function extend(destination, source) {
		var property;
		for (property in source) {
			destination[property] = source[property];
		}
		return destination;
	}
	
	function $A(iterable) {
		var length, results, i;
		
		if (!iterable) {
			return [];
		}
		
		if ('toArray' in Object(iterable)) {
			return iterable.toArray();
		}
		
		length = iterable.length || 0;
		results = [];
		
		for(i = 0; i < length; i++) {
			results[i] = iterable[i];
		}
		
		return results;
	}
	
	function isFunction(object) {
		return _toString.call(object) === FUNCTION_CLASS;
	}
	
	extend(Object, { extend: extend, isFunction: isFunction });

	var IS_DONTENUM_BUGGY = (function(){
		var p;
		for (p in { toString: 1 }) {
			if (p === 'toString') {
				return false;
			}
		}
		return true;
	}());
	
	function subclass() {}
	function create() {
		var parent = null, properties = $A(arguments), length, i;
		
		if (Object.isFunction(properties[0])) {
			parent = properties.shift();
		}
		
		function klass() {
			this.initialize.apply(this, arguments);
		}
		
		Object.extend(klass, Class.Methods);
		klass.superclass = parent;
		klass.subclasses = [];
		
		if (parent) {
			subclass.prototype = parent.prototype;
			klass.prototype = new subclass();
			parent.subclasses.push(klass);
		}
		
		for (i = 0, length = properties.length; i < length; i++) {
			klass.addMethods(properties[i]);
		}
		
		if (!klass.prototype.initialize) {
			klass.prototype.initialize = function() { };
		}
		
		klass.prototype.constructor = klass;
		return klass;
	}
	
	function addMethods(source) {
		var ancestor = this.superclass && this.superclass.prototype,
		    properties = Object.keys(source), property, value, method, valueFunction, length, i;
		
		if (IS_DONTENUM_BUGGY) {
			if (source.toString !== Object.prototype.toString) {
				properties.push("toString");
			}
			if (source.valueOf !== Object.prototype.valueOf) {
				properties.push("valueOf");
			}
		}
		
		valueFunction = function(m) {
			return function() { return ancestor[m].apply(this, arguments); };
		};
		
		for (i = 0, length = properties.length; i < length; i++) {
			property = properties[i];
			value = source[property];
			
			if (ancestor && Object.isFunction(value) && value.argumentNames()[0] === "$super") {
				method = value;
				value = valueFunction(property).wrap(method);
				
				value.valueOf = method.valueOf.bind(method);
				value.toString = method.toString.bind(method);
			}
			this.prototype[property] = value;
		}
		
		return this;
	}
	
	return {
		create: create,
		Methods: {
			addMethods: addMethods
		}
	};
}());