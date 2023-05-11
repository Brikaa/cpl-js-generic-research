Omar Adel Abdel Hamid Ahmed Brikaa - 20206043 - S5 - Wed 11:15 - JS (ES6) - brikaaomar@gmail.com

# Variable parameters

## Why it works

No matter how many formal parameters a function has, it will accept any number of actual parameters.
If the number of formal parameters is more than the number of actual parameters,
the rest of the formal parameters will be assigned the value 'undefined'.
If it is less, the rest of the actual parameters will be assigned to the "rest parameter" array
(if a "rest parameter" exists).
Either way, all actual parameters are put in an array-like object called "arguments".
This helps us create functions that accept an arbitrary number of parameters.

## How it is done

### Rest parameters syntax

```js
function logAll(...params) {
  params.forEach((p) => console.log(p));
}
```

### Arguments object

```js
function logAll() {
  for (a of arguments) {
    console.log(a);
  }
}
```

## Built-in examples

`Math.max()` accepts an arbitrary number of parameters and return the their maximum.

# Functions as first-class objects

## Why it works

Functions are considered objects with the special characteristic of being callable.
They can be assigned to variables, passed as arguments to other functions and returned from other functions.
This helps in creating function abstractions that can be specialized by different concrete functions
at different points in time.

## How it is done

Following are three different ways to pass a function we defined to the built-in map function.
These examples return an array with all elements incremented by two:

### Defining a function and using its name

```js
function addTwo(x) {
  return x + 2;
}
[1, 2, 3].map(addTwo);
```

### Anonymous function

```js
[1, 2, 3].map(function (x) {
  return x + 2;
});
```

### Arrow function

```js
[1, 2, 3].map((x) => x + 2);
```

## Built-in examples

Many built-in functions accept other functions as parameters such as the map, forEach and filter.

# Unbounded polymorphism

## Why it works

When accessing an object's property, the object is searched for this property at runtime.
This helps in creating object abstractions that can be specialized
by different concrete objects having certain properties at different points in time.

## How it is done

If there is an object abstraction (variable, function parameter, etc)
and a piece of code accesses a certain property in this abstraction,
then any object with this property can be a specialization of this abstraction.
In fact, any object without this property can be a specialization of this abstraction;
however, the programmer must be aware that accessing the property will return "undefined".

## Built-in example

The `+` operator, when used on objects,
calls the `valueOf()` method (property) of both objects and calls the `+` operator on whatever `valueOf()` returned.
Any object can have any implementation for `valueOf()`.
Following is an example that adds the perimeters of two shapes using the `+` operator:

```js
let square = {
  s: 3,
  valueOf: function () {
    return this.s * 4;
  }
};
let rectangle = {
  l: 2,
  w: 3,
  valueOf: function () {
    return (this.l + this.w) * 2;
  }
};
console.log(square + rectangle); // 22
```

# Dynamic inheritance using the prototype property

## Why it works

Each object has a prototype property whose value can either be another object or null.
When a property is accessed, the JS engine searches not only the object for this property but also
its prototype, and its prototype's prototype, and so on until it reaches an object whose prototype is null.
Hence an inheritance hierarchy is formed using aggregation.
An object's prototype can be replaced at runtime hence changing some of the properties that are available
to the object (dynamic inheritance).

## How it is done

`Object.setPrototypeOf(obj, proto)` changes the prototype of `obj` to `proto`.

## Scarceness of built-in examples

Changing the prototype of an object currently has bad performance in most engines.
Hence it is recommended to instead create a new object with the desired prototype using `Object.create(proto)`.

# The following is a program that demonstrates all of the discussed concepts

```js
class Model {
  // Unlike C++ and Java, in JS, classes are just syntactic sugar that facilitate the creation of objects
  #entities;
  constructor(...initial_entities) {
    // Variable parameters using rest syntax
    this.#entities = initial_entities;
  }

  select(selection_fn) {
    // Subprogram as parameter
    return this.#entities.filter(selection_fn);
  }
}

class Entity {
  toString() {
    return 'Entity';
  }

  delete() {
    // Dynamic inheritance. When used in the child, the child's parent will be DeletedEntity instead of Entity
    Object.setPrototypeOf(this, new DeletedEntity(new Date()));
  }
}

class DeletedEntity {
  constructor(date) {
    this.deletionDate = date;
  }

  recycle() {
    Object.setPrototypeOf(this, new Entity());
  }
}

class User extends Entity {
  constructor(name) {
    super();
    this.name = name;
  }

  toString() {
    return `User called ${this.name}`;
  }
}

class Room extends Entity {
  constructor(number) {
    super();
    this.number = number;
  }

  toString() {
    return `Room ${this.number}`;
  }
}

function logEntities(logging_fn, ...entities) {
  // Subprogram as parameter
  // Variable parameters
  // Also entities could contain Users and/or Rooms (polymorphism)
  entities.forEach((e) => logging_fn(e.toString()));
}

(() => {
  userModel = new Model(new User('Omar'), new User('Adel'), new User('Ahmed'));
  roomModel = new Model(new Room(32), new Room(35), new Room(23));
  logEntities(
    console.log,
    ...userModel.select((u) => u.name.startsWith('A')),
    ...roomModel.select((r) => r.number >= 30)
  );
  const user = userModel.select((u) => u.name === 'Omar')[0];
  user.delete();
  console.log(user.deletionDate);
  console.log('delete' in user); // false because user's parent is now DeletedEntity which does not have 'delete'
  user.recycle();
})();
```
