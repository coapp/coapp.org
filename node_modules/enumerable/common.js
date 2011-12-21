var AnimalType = {
    Dog: 1,
    Cat: 2,
    Fish: 3,
    Goat: 4
};
exports.AnimalType = AnimalType;

var animals = [];
animals.push({ type: AnimalType.Dog, name: "Rover", age: 13, children: [] });
animals.push({ type: AnimalType.Cat, name: "Fluffy", age: 1, children: [] });
animals.push({ type: AnimalType.Dog, name: "Rex", age: 12, children: ["Rover"] });
animals.push({ type: AnimalType.Fish, name: "Goldie", age: 3, children: ["Scales", "Goldie"] });
animals.push({ type: AnimalType.Cat, name: "Fudge", age: 20, children: ["Digby", "Kitty"] });
animals.push({ type: AnimalType.Cat, name: "Digby", age: 2, children: [] });
animals.push({ type: AnimalType.Cat, name: "Kitty", age: 4, children: [] });
animals.push({ type: AnimalType.Dog, name: "Rover", age: 3, children: [] });
animals.push({ type: AnimalType.Fish, name: "Scales", age: 2, children: [] });
animals.push({ type: AnimalType.Fish, name: "Goldie", age: 1, children: [] });

exports.animals = animals;