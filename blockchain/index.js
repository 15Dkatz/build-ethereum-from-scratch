const Block = require('./block');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ block }) {
    return new Promise((resolve, reject) => {
      Block.validateBlock({
        lastBlock: this.chain[this.chain.length-1],
        block
      }).then(() => {
        this.chain.push(block);

        return resolve();
      }).catch(reject);
    });
  }

  replaceChain({ chain }) {
    return new Promise(async (resolve, reject) => {
      for (let i=0; i<chain.length; i++) {
        const block = chain[i];
        const lastBlockIndex = i-1;
        const lastBlock = lastBlockIndex >= 0 ? chain[i-1] : null;

        try {
          await Block.validateBlock({ lastBlock, block });
        } catch (error) {
          return reject(error);
        }

        console.log(`*-- Validated block number: ${block.blockHeaders.number}`);
      }

      this.chain = chain;

      return resolve();
    });
  }
}

module.exports = Blockchain;
