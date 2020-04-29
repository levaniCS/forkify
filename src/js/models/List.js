import uniqid from 'uniqid';

export default class List {
  constructor() {
    this.items = [];
  }

  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient,
    };
    this.items.push(item);

    return item;
  }

  deleteItem(id) {
    /**
     * DIFFERENCE BETWEEN slice And splice
     * [2,3,4] splice(1, 1) --> returns 3, original array is [2, 4] ...  (1,1) - (startIndex, how many elements we want to take)
     * [2,3,4] slice(1, 2) --> returns 3, original array is [2, 3, 4] ... (startIndex, endIndex(not included))
     */
    const index = this.items.findIndex((el) => el.id === id);

    this.items.splice(index, 1); // start index position, delete 1 element ...
  }

  updateCount(id, newCount) {
    this.items.find((el) => el.id === id).count = newCount;
  }
}
