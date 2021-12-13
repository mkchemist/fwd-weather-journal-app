function Validator() {
    this.rules = {
        ...Validator.rules
    };
}


Validator.rules = {
    required: function(val) {

    },
    string: function(val) {

    },
    number: function(val) {

    }
};



Validator.extends = function(name, cb) {
    Validator.rules[name] = cb
}

Validator.extends('upperCase', function(val) {

});

let validator = new Validator();
console.log(validator)