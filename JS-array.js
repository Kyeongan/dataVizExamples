var _ = require('lodash');

var users = [
  {name: 'Jerry', age: '3', city: 'Chicago'},
  {name: 'Martha', age: 42, city: 'Seattle'},
  {name: 'Sheldon', age: 29, city: 'Chicago'},
  {name: 'Maria', age: 3, city: 'Seattle'},
  {name: 'Jerry', age: '3', city: 'Chicago'}
]



for(var i=0 ; i<users.length ; i++ ) {
  console.log(users[i]["name"], users[i]["age"], users[i]["city"]);  
}

console.log(Object.keys(users[0]));

console.log(" ");

var keys = Object.keys(users);
var len = keys.length;

keys.sort();

for (var i=0; i<len; i++) {
 var _k = keys[i];
  console.log(users[_k]);
  
}

_.sortKeysBy(users);
// {a: 1, b: 3, c: 2}

_.sortKeysBy(users, function (value, key) {
    return value;
});