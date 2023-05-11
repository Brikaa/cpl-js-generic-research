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
