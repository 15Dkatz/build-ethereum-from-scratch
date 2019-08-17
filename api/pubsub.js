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
  constructor() {
    this.pubnub = new PubNub(credentials);
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
        console.log('messageObject', messageObject);
      }
    });
  }
}

module.exports = PubSub;

const pubsub = new PubSub();

setTimeout(() => {
  pubsub.publish({
    channel: CHANNELS_MAP.TEST,
    message: 'foo'
  });  
}, 3000);
