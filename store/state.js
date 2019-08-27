const Trie = require('./trie');

class State {
  constructor() {
    this.stateTrie = new Trie();
  }

  putAccount({ address, accountData }) {
    this.stateTrie.put({ key: address, value: accountData });
  }

  getAccount({ address }) {
    return this.stateTrie.get({ key: address });
  }

  getStateRoot() {
    return this.stateTrie.rootHash;
  }
}

module.exports = State;
