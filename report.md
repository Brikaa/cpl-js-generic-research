Omar Adel Abdel Hamid Ahmed Brikaa - 20206043 - S5 - Wed 11:15 - JS (ES6)

# Variable parameters

## Why it works

No matter how many formal parameters a function has, it will accept any number of actual parameters.
If the number of formal parameters is more than the number of actual parameters,
the rest of the formal parameters will be assigned the value 'undefined'.
If it is less than the number of actual parameters,
the rest of the actual parameters will be assigned to the "rest parameter" array (if a "rest parameter" exists)
In both cases, all actual parameters are put in an array-like object called "arguments".
This helps us create functions that accept arbitrary number of parameters.

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

`Math.max()` accepts an arbitrary number of parameters and return the maximum of them.

```js
Math.max(1, 3, 4, 2, 0); // 4
```

# Functions as first-class objects

## Why it works

Functions are considered objects with a special characteristic of being callable.
They can be assignment to variables, passed as arguments to other functions and returned from other functions.
This helps us form function abstractions that can be specialized by different concrete functions
at different points in time.

## How it is done

Following are three different ways to pass a function to the map function.
These examples return an array with all elements incremented by two.

### Defining a function and using its name

```js
function addTwo(x) {
  return x + 2;
}
[1, 2, 3].map(addTwo);
```

### Anonymously defined function

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

Many built-in functions accept other functions as parameters such as the map function (discussed above), forEach, filter
and more.

# Unbounded polymorphism due to coercion and implicit dynamic typing

## Why it works

When accessing an object's property, the object is searched for this property at runtime.
When accessing a property in a primitive data type, it is coerced into a wrapper object.
This helps us create object abstractions that can be specialized by different concrete objects having certain properties
at different points in time.

## How it works

If there is an object abstraction (variable, function parameter, etc)
and a piece of code accesses a certain property in this abstraction,
then any object with this property can be a specialization of this abstraction.
In fact, any object without this property can be a specialization of this abstraction;
however, the programmer must be aware that accessing the property will return "undefined"

## Built-in example

The + operator, when used on objects that can not be arithmetically added,
calls toString() on both objects and calls the + operator on whatever toString() returns.
Any object can have any implementation for toString().

```js
let obj1 = { toString: () => 'Hello ' };
let obj2 = { toString: () => ' World!' };
obj1 + obj2; // Hello World!
```

# Dynamic inheritance using the prototype property

## Why it works

Each object has a prototype property whose value can be another object or null.
When a property is accessed, the JS engine searches not only the object for this property but also
its prototype, and its prototype's prototype, and so on until it reaches an object whose prototype is null.
Hence an inheritance hierarchy is formed using aggregation.
This prototype object can be replaced at runtime hence changing some of the methods that are available
to the object (dynamic inheritance).

## How it works

`Object.setPrototypeOf(obj, proto)` changes the prototype of `obj` to `proto`.

## Lack of built-in examples

Changing the prototype of an object currently has bad performance in most JavaScript engines.
Hence it is not recommended to use `Object.setPrototypeOf(obj, proto)` and rather create a new object with
the desired prototype using `Object.create(proto)`

# Comprehensive program

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

class DeletedEntity {
  constructor(date) {
    this.deletion_date = date;
  }

  recycle() {
    Object.setPrototypeOf(this, new Entity());
  }
}

class Entity {
  toString() {
    console.log('Entity');
  }

  delete() {
    // Dynamic inheritance. When used in the child, the child's parent will be DeletedEntity instead of Entity
    Object.setPrototypeOf(this, new DeletedEntity(new Date()));
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
  userModel = new Model(new User('Omar'), new User('Adel'), new User('Abdel Hamid'));
  roomModel = new Model(new Room(32), new Room(35), new Room(23));
  logEntities(
    console.log,
    ...userModel.select((u) => u.name.startsWith('A')),
    ...roomModel.select((r) => r.number >= 30)
  );
  const omar = userModel.select((u) => u.name === 'Omar')[0];
  omar.delete();
  console.log(omar.deletion_date);
  console.log('delete' in omar); // false because omar's superclass is now DeletedEntity which does not have 'delete'
  omar.recycle();
})();
```
