export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const like = { id, title, author, img };
    this.likes.push(like);

    // PERSIST DATA IN Locastorage
    this.persistData();
    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex((el) => el.id === id);
    this.likes.splice(index, 1);

    // PERSIST DATA IN Locastorage
    this.persistData();
  }

  isLiked(id) {
    return this.likes.findIndex((el) => el.id === id) !== -1;
  }

  getNumLikes() {
    return this.likes.length;
  }

  persistData() {
    localStorage.setItem('likes', JSON.stringify(this.likes)); // because we can only store string data in localstorage
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem('likes'));

    // Restore likes from the localStorage
    if (storage) this.likes = storage;
  }
}
