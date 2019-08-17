const PubNub = require('pubnub');

const credentials = {
  publishKey: 'pub-c-2a9a12fd-bd7e-45ae-9743-23f7909dd90f',
  subscribeKey: 'sub-c-f6ad80a4-c085-11e9-8d65-be5536b78e9a',
  secretKey: 'sec-c-MTE0NDA5NDctNGRkZC00YjFmLTgyOGUtOWRlYTM0YmRiNWRh'
};

const CHANNELS_MAP = {
  TEST: 'TEST',
  BLOCK: 'BLOCK'
};

class PubSub {
  constructor({ blockchain }) {
    this.pubnub = new PubNub(credentials);
    this.blockchain = blockchain;
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
}

module.exports = PubSub;
