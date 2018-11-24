let a = {
    value: 1
};

let b = {
    value: 2
};

let c = {
    value: a.value + b.value
};

let d = Object.assign({}, c, b, a);

console.log(d.value);