const PubNub = require('pubnub');
const Transaction = require('../transaction');

const credentials = {
  publishKey: 'pub-c-2a9a12fd-bd7e-45ae-9743-23f7909dd90f',
  subscribeKey: 'sub-c-f6ad80a4-c085-11e9-8d65-be5536b78e9a',
  secretKey: 'sec-c-MTE0NDA5NDctNGRkZC00YjFmLTgyOGUtOWRlYTM0YmRiNWRh'
};

const CHANNELS_MAP = {
  TEST: 'TEST',
  BLOCK: 'BLOCK',
  TRANSACTION: 'TRANSACTION'
};

class PubSub {
  constructor({ blockchain, transactionQueue }) {
    this.pubnub = new PubNub(credentials);
    this.blockchain = blockchain;
    this.transactionQueue = transactionQueue;
    this.subscribeToChannels();
    this.listen();
  }

  subscribeToChannels() {
    this.pubnub.subscribe({
      channels: Object.values(CHANNELS_MAP)
    });
  }

  publish({ channel, message }) {
    this.pubnub.publish({ channel, message });
  }

  listen() {
    this.pubnub.addListener({
      message: messageObject => {
        const { channel, message } = messageObject;
        const parsedMessage = JSON.parse(message);

        console.log('Message received. Channel:', channel);

        switch (channel) {
          case CHANNELS_MAP.BLOCK:
            console.log('block message', message);

            this.blockchain.addBlock({ block: parsedMessage })
              .then(() => console.log('New block accepted'))
              .catch(error => console.error('New block rejected:', error.message));
            break;
          case CHANNELS_MAP.TRANSACTION:
            console.log(`Received transaction: ${parsedMessage.id}`);

            this.transactionQueue.add(new Transaction(parsedMessage));

            break;
          default:
            return;
        }
      }
    });
  }

  broadcastBlock(block) {
    this.publish({
      channel: CHANNELS_MAP.BLOCK,
      message: JSON.stringify(block)
    });
  }

  broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS_MAP.TRANSACTION,
      message: JSON.stringify(transaction)
    });
  }
}

module.exports = PubSub;
