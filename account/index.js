const { ec, keccakHash } = require('../util');
const { STARTING_BALANCE } = require('../config');

class Account {
  constructor() {
    this.keyPair = ec.genKeyPair();
    this.address = this.keyPair.getPublic().encode('hex');
    this.balance = STARTING_BALANCE;
  }

  sign(data) {
    return this.keyPair.sign(keccakHash(data));
  }

  toJSON() {
    return {
      address: this.address,
      balance: this.balance
    };
  }

  static verifySignature({ publicKey, data, signature }) {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');

    return keyFromPublic.verify(keccakHash(data), signature);
  }
}

module.exports = Account;
