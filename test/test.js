const assert = require("assert");

// es6 left pad
const leftPad = require("@twpm/left-pad");
const res1 = leftPad(1, 5);
assert(res1 === "00001");

const res2 = leftPad(1234, 5);
assert(res2 === "01234");

const res3 = leftPad(12345, 5);
assert(res3 === "12345");

console.log("All passed! 🎉");
