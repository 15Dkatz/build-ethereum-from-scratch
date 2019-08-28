const _ = require('lodash');
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

    return _.cloneDeep(node.value);
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

  static buildTrie({ items }) {
    const trie = new this();

    for (let item of items.sort((a, b) => keccakHash(a) > keccakHash(b))) {
      trie.put({ key: keccakHash(item), value: item });
    }

    return trie;
  }
}

module.exports = Trie;
