const Block = require('./block');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }
}

module.exports = Blockchain;
