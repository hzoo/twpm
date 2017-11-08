const assert = require("assert");

// es6 left pad
const leftPad = require("@twpm/left-pad");
const res1 = leftPad(1, 5);
assert(res1 === "00001");

const res2 = leftPad(1234, 5);
assert(res2 === "01234");

const res3 = leftPad(12345, 5);
assert(res3 === "12345");

const mitt = require("@twpm/mitt");

const events = Object.create(null);
const inst = mitt(events);
let foo = () => {};
inst.on('foo', foo);
assert(events.foo[0] === foo);

console.log("All passed! 🎉");
