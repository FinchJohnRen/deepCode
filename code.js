/**
 * 模拟实现 new 操作符
 * @param  {Function} ctor [构造函数]
 * @return {Object|Function|Regex|Date|Error}      [返回结果]
 */
function newOperator(ctor){
	if(typeof ctor !== 'function'){
		throw 'newOperator function the first param must be a function';
	}
	// ES6 new.target 是指向构造函数
	newOperator.target = ctor;
	// 1.创建一个全新的对象，
	// 2.并且执行[[Prototype]]链接
	// 4.通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。
	// 	Object.create(proto, [propertiesObject])
	// 方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。 
	var newObj = Object.create(ctor.prototype);
	// ES5 arguments转成数组 当然也可以用ES6 [...arguments], Aarry.from(arguments);
	// 除去ctor构造函数的其余参数
	var argsArr = [].slice.call(arguments, 1);
	// 3.生成的新对象会绑定到函数调用的`this`。
	// 获取到ctor函数返回结果
	var ctorReturnResult = ctor.apply(newObj, argsArr);
	// 小结4 中这些类型中合并起来只有Object和Function两种类型 typeof null 也是'object'所以要不等于null，排除null
	var isObject = typeof ctorReturnResult === 'object' && ctorReturnResult !== null;
	var isFunction = typeof ctorReturnResult === 'function';
	if(isObject || isFunction){
			return ctorReturnResult;
	}
	// 5.如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，那么`new`表达式中的函数调用会自动返回这个新的对象。
	return newObj;
}

// new 精简版
// function New(func) {
// 	var res = {};
// 	if (func.prototype !== null) {
// 		res.__proto__ = func.prototype
// 	}
// 	var ret = func.apply(res, Array.prototype.slice.call(arguments, 1))
// 	console.log('NEw', ret)
// 	if ((typeof ret === "object" || typeof ret === "function") && ret !== null) {
// 		return ret
// 	}
// 	return res
// }

function newFn(func){
	if (typeof func !== 'function') {
		throw 'error'
	}
	newFn.target = func
	let newObj = Object.create(func.prototype)
	let args = [].slice.call(arguments, 1)
	console.warn(newObj);
	// 取到func函数的返回结果
	let ret = func.apply(newObj, args)
	if ((typeof ret === 'object' || typeof ret === 'function') && ret !== null) {
		return ret
	}
	return newObj
}
console.log('1111111111111111111111111111111',neee);
// New(bar, 'name', '11')

Function.prototype.call2 = function(content = window) {
	content.fn = this;
	let args = [...arguments].slice(1);
	let result = content.fn(...args);
	delete content.fn;
	return result;
}
let foo = {
	value: 1
}


function bar(name, age) {
	console.log(name)
	console.log(age)
	console.log(this.value)
}

bar.call2(foo, 'black', '18') // black 18 1

Function.prototype.call3 = function (context = window, ...args) {
	context.fn = this
	let result = context.fn(...args)
	delete context.fn
	return result
}

bar.call3(foo, 'call3', '26')


Function.prototype.apply2 =  function (context = window, arr = []) {
	// this 指向调用它的实例
	context.fn = this
	let result = context.fn(...arr)
	delete context.fn
	return result
}

bar.apply2(foo)



Function.prototype.bind2 = function(context) {
	console.log('bind')
	var _this = this
	var argsParent = Array.prototype.slice.call(arguments, 1)
	return function() {
		var args = argsParent.concat(Array.prototype.slice.call(arguments)); //转化成数组
		console.log(_this);
			_this.apply(context, args)
	}
}

let bindTest = bar.bind2(foo)


Function.prototype.bind3 = function (context) {
	var _this= this
	var args = [...arguments]
	return function () {
		var newArgs = args.concat([...arguments])
		_this.apply(context, newArgs)
	}
}
function bar3(name, age) {
	console.log(name)
	console.log(age)
	console.log(this.value)
}


bar3.bind3(foo)()
// 柯里化
function curry(fn, args) {
	var length = fn.length;
	var args = args || [];
	return function(){
		console.log(fn);
			newArgs = args.concat(Array.prototype.slice.call(arguments));
			if (newArgs.length < length) {
					return curry.call(this,fn,newArgs);
			}else{
					return fn.apply(this,newArgs);
			}
	}
}

function multiFn(a, b, c) {
	console.log(a * b * c);
	return a * b * c;
}

var multi = curry(multiFn);
multi(2)(3);



// 防抖函数

function debunce(fn, wait = 50, immediate) {
	let timmer
	return function () {
		if (immediate) {
			fn.apply(this, arguments)
		
		}
		if (timmer) {
			clearTimeout(timmer)
		}
		timmer = setTimeout(() => {
			fn.apply(this, arguments)
		}, wait);
	}
}
function testDebunce() {
	console.log('debunce');
}
window.addEventListener('scroll',throttle(testDebunce,500) )


// 节流函数

function throttle(fn, wait) {
	let pre = new Date()
	return function () {
		let now = new Date()
		if (now - pre > wait) {
			// 将返回的function this指向传入的fn函数 执行
			fn.apply(this, arguments)
			pre = new Date()
		}
	}
}


// 深拷贝

function deepCopy (obj) {
	if (typeof obj === 'object') {
		var result = obj.constructor  === Array ?　[]  : {}
		for (let i in obj)  {
			console.log(i);
			result[i] = typeof obj[i] === 'object' ? deepCopy(obj[i]) : obj[i]
		}

	} else {
		var result  = obj
	}
	return result
}

let obj = {'adsf': [1,2,3] , 'obj': 123 }

let test = deepCopy(obj)

// console.log('123',test);


function Animal(){

　　　　this.species = "动物";

　　}

function Cat(name,color){

　　　　this.name = name;

　　　　this.color = color;
　　}

var cat1 = new Cat("大毛","黄色");
console.log(cat1);


// 拷贝继承
function extend(parent, child) {
	let p = parent.prototype
	let c = child.prototype
	for (var i in p ) {
		c[i] = p[i]
	}
}

// 原型继承
function extend2(parent, child) {
	var F = function () {}
	F.prototype = parent.prototype
	child.prototype = new F()
	child.constructor = child
}

/**
 * proxy(target, options)
 */

let proxy  = new Proxy({time: 4456}, {
	// target 目标对象 
	// property 属性
	// 一般情况之下是 proxy 示例
	get: function (target, property, receviver) {
		console.log('receviver',receviver);
		if (property in target) {
			console.log(property + '=> has this property');
			return target[property]
		} else {
			console.log('can not find the property');
			return target[property]
		}
	},
	set: function (target, property, value ,receviver) {
			console.log('123123',property, value);
	}
})
let objPro = Object.create(proxy)
objPro.time = '24h'
console.log(objPro);

// apply 拦截函数调用

let target = function () {
	console.log('i am the target');
}

var handler = {
	apply: function (target,ctx, args) {
		console.log('i am the proxy', target, ctx, args)
		return 'i am the proxy'
	},
	has: function (target, key) {
		console.log('HAS', key);
	}
}

var apply = new Proxy(target, handler)
'test' in apply
apply()
console.log(apply.test)


function debunce(wait = 50, fn) {
	let timmer
	return function () {
		if (timmer) {
			clearTimeout(timmer)
		}
		setTimeout(() => {
			fn.apply(this, arguments)
		}, wait);
	}
}