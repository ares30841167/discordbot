class MusicQueue {
  
  #store;
  #current;
  
  constructor() {
    this.#store = [];
    this.#current = -1;
  }

  AddAudioResource(resource) {
    this.#store.push(resource);
  }

  HasNextResource() {
    if(this.#current + 1 < this.#store.length)
      return true;
    else
      return false;
  }

  GetNextResource() {
    if(this.#current + 1 >= this.#store.length) return;
    return this.#store[++this.#current];
  }

  GetCurrentIndex() {
    return this.#current;
  }

  Clean() {
    this.#store = [];
    this.#current = -1;
  }
}

module.exports = {
  MusicQueue
}