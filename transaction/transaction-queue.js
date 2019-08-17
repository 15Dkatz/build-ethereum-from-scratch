class TransactionQueue {
  constructor() {
    this.transactionMap = {};
  }

  add(transaction) {
    this.transactionMap[transaction.id] = transaction;
  }

  getTransactionSeries() {
    return Object.values(this.transactionMap);
  }
}

module.exports = TransactionQueue;
