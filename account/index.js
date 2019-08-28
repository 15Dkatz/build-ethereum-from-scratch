const { ec, keccakHash } = require('../util');
const { STARTING_BALANCE } = require('../config');

class Account {
  constructor({ code } = {}) {
    this.keyPair = ec.genKeyPair();
    this.address = this.keyPair.getPublic().encode('hex');
    this.balance = STARTING_BALANCE;
    this.code = code || [];
    this.generateCodeHash();
  }

  generateCodeHash() {
    this.codeHash = this.code.length > 0
      ? keccakHash(this.address + this.code)
      : null;
  }

  sign(data) {
    return this.keyPair.sign(keccakHash(data));
  }

  toJSON() {
    return {
      address: this.address,
      balance: this.balance,
      code: this.code,
      codeHash: this.codeHash
    };
  }

  static verifySignature({ publicKey, data, signature }) {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');

    return keyFromPublic.verify(keccakHash(data), signature);
  }

  static calculateBalance({ address, state }) {
    return state.getAccount({ address }).balance;
  }
}

module.exports = Account;
