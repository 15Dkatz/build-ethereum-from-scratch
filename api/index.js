const express = require('express');
const request = require('request');
const Blockchain = require('../blockchain');
const Block = require('../blockchain/block');
const PubSub = require('./pubsub');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

app.get('/blockchain', (req, res, next) => {
  const { chain } = blockchain;

  res.json({ chain });
});

app.get('/blockchain/mine', (req, res, next) => {
  const lastBlock = blockchain.chain[blockchain.chain.length-1];
  const block = Block.mineBlock({ lastBlock });

  blockchain.addBlock({ block })
    .then(() => {
      pubsub.broadcastBlock(block);

      res.json({ block });
    })
    .catch(next);
});

app.use((err, req, res, next) => {
  console.error('Internal server error:', err);

  res.status(500).json({ message: err.message });
});

const peer = process.argv.includes('--peer');
const PORT = peer
  ? Math.floor(2000 + Math.random() * 1000)
  : 3000;

if (peer) {
  request('http://localhost:3000/blockchain', (error, response, body) => {
    const { chain } = JSON.parse(body);

    blockchain.replaceChain({ chain })
      .then(() => console.log('Synchronized blockchain with the root node'))
      .catch(error => console.error('Synchronization error:', error.message));
  });
}

app.listen(PORT, () => console.log(`Listening at PORT: ${PORT}`));
