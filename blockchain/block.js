const { GENESIS_DATA, MINE_RATE } = require('../config');
const { keccakHash } = require('../util');

const HASH_LENGTH = 64;
const MAX_HASH_VALUE = parseInt('f'.repeat(HASH_LENGTH), 16);
const MAX_NONCE_VALUE = 2 ** 64;

class Block {
  constructor({ blockHeaders }) {
    this.blockHeaders = blockHeaders;
  }

  static calculateBlockTargetHash({ lastBlock }) {
    const value = (MAX_HASH_VALUE / lastBlock.blockHeaders.difficulty).toString(16);

    if (value.length > HASH_LENGTH) {
      return 'f'.repeat(HASH_LENGTH);
    }

    return '0'.repeat(HASH_LENGTH - value.length) + value;
  }

  static adjustDifficulty({ lastBlock, timestamp }) {
    const { difficulty } = lastBlock.blockHeaders;

    if ((timestamp - lastBlock.blockHeaders.timestamp) > MINE_RATE) {
      return difficulty - 1;
    }

    if (difficulty < 1) {
      return 1;
    }

    return difficulty + 1;
  }

  static mineBlock({ lastBlock, beneficiary }) {
    const target = Block.calculateBlockTargetHash({ lastBlock });
    let timestamp, truncatedBlockHeaders, header, nonce, underTargetHash;

    do {
      timestamp = Date.now();
      truncatedBlockHeaders = {
        parentHash: keccakHash(lastBlock.blockHeaders),
        beneficiary,
        difficulty: Block.adjustDifficulty({ lastBlock, timestamp }),
        number: lastBlock.blockHeaders.number + 1,
        timestamp
      };
      header = keccakHash(truncatedBlockHeaders);
      nonce = Math.floor(Math.random() * MAX_NONCE_VALUE);
  
      underTargetHash = keccakHash(header + nonce);
    } while (underTargetHash > target);

    return new this({
      blockHeaders: { ...truncatedBlockHeaders, nonce }
    });
  }

  static genesis() {
    return new Block(GENESIS_DATA);
  }

  static validateBlock({ lastBlock, block }) {
    return new Promise((resolve, reject) => {
      if (keccakHash(block) === keccakHash(Block.genesis())) {
        return resolve();
      }

      if (keccakHash(lastBlock.blockHeaders) !== block.blockHeaders.parentHash) {
        return reject(
          new Error("The parent hash must be a hash of the last block's headers")
        );
      }

      if (block.blockHeaders.number !== lastBlock.blockHeaders.number + 1) {
        return reject(new Error('The block must increment the number by 1'));
      }

      if (
        Math.abs(lastBlock.blockHeaders.difficulty - block.blockHeaders.difficulty) > 1
      ) {
        return reject(new Error('The difficulty must only adjust by 1'));
      }

      const target = Block.calculateBlockTargetHash({ lastBlock });
      const { blockHeaders } = block;
      const { nonce } = blockHeaders;
      const truncatedBlockHeaders = { ...blockHeaders };
      delete truncatedBlockHeaders.nonce;
      const header = keccakHash(truncatedBlockHeaders);
      const underTargetHash = keccakHash(header + nonce);

      if (underTargetHash > target) {
        return reject(new Error(
          'The block does not meet the proof of work requirement'
        ));
      }

      return resolve();
    });
  }
}

module.exports = Block;
