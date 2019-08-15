const { GENESIS_DATA } = require('../config');

class Block {
  constructor({ blockHeaders }) {
    this.blockHeaders = blockHeaders;
  }

  static mineBlock({ lastBlock }) {
    
  }

  static genesis() {
    return new Block(GENESIS_DATA);
  }
}

module.exports = Block;
