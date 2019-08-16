const express = require('express');
const Blockchain = require('../blockchain');
const Block = require('../blockchain/block');

const app = express();
const blockchain = new Blockchain();

app.get('/blockchain', (req, res, next) => {
  const { chain } = blockchain;

  res.json({ chain });
});

app.get('/blockchain/mine', (req, res, next) => {
  const lastBlock = blockchain.chain[blockchain.chain.length-1];
  const block = Block.mineBlock({ lastBlock });

  block.blockHeaders.parentHash = 'foo';

  blockchain.addBlock({ block })
    .then(() => {
      res.json({ block });
    })
    .catch(next);
});

app.use((err, req, res, next) => {
  console.error('Internal server error:', err);

  res.status(500).json({ message: err.message });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening at PORT: ${PORT}`));
