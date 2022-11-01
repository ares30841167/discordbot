class MusicQueue {
  
  #store;
  #current;
  
  constructor(store = [], current = -1) {
    this.#store = store;
    this.#current = current;
  }

  getStore() {
    return this.#store;
  }

  addAudioResource(resource) {
    this.#store.push(resource);
  }

  replaceCurrentAudioResource(resource) {
    this.#store[this.#current] = resource;
  }

  hasNextResource() {
    if(this.#current + 1 < this.#store.length)
      return true;
    else
      return false;
  }

  getCurrentResource() {
    if(this.#current == -1) return null;
    return this.#store[this.#current];
  }

  getNextResource() {
    if(this.#current + 1 >= this.#store.length) return null;
    return this.#store[++this.#current];
  }

  getCurrentIndex() {
    return this.#current;
  }

  clean() {
    this.#store = [];
    this.#current = -1;
  }
}

module.exports = {
  MusicQueue
}