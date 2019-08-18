const { keccakHash } = require('../util');

class Node {
  constructor() {
    this.value = null;
    this.childMap = {};
  }
}

class Trie {
  constructor() {
    this.head = new Node();
    this.generateRootHash();
  }

  generateRootHash() {
    this.rootHash = keccakHash(this.head);
  }

  get({ key }) {
    let node = this.head;

    for (let character of key) {
      if (node.childMap[character]) {
        node = node.childMap[character];
      }
    }

    return node.value;
  }

  put({ key, value }) {
    let node = this.head;

    for (let character of key) {
      if (!node.childMap[character]) {
        node.childMap[character] = new Node();
      }

      node = node.childMap[character];
    }

    node.value = value;

    this.generateRootHash();
  }
}

module.exports = Trie;
