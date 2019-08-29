const Trie = require('./trie');

class State {
  constructor() {
    this.stateTrie = new Trie();
    this.storageTrieMap = {};
  }

  putAccount({ address, accountData }) {
    if (!this.storageTrieMap[address]) {
      this.storageTrieMap[address] = new Trie();
    }

    this.stateTrie.put({
      key: address,
      value: {
        ...accountData,
        storageRoot: this.storageTrieMap[address].rootHash
      }
    });
  }

  getAccount({ address }) {
    return this.stateTrie.get({ key: address });
  }

  getStateRoot() {
    return this.stateTrie.rootHash;
  }
}

module.exports = State;
