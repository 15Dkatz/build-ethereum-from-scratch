const request = require('request');

const BASE_URL = 'http://localhost:3000';

const postTransact = ({ to, value }) => {
  return new Promise((resolve, reject) => {
    request(`${BASE_URL}/account/transact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, value })
    },(error, response, body) => {
      return resolve(JSON.parse(body));
    });
  });
}

const getMine = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      request(`${BASE_URL}/blockchain/mine`, (error, response, body) => {
        return resolve(JSON.parse(body));
      });
    }, 1000);
  });
}

const getAccountBalance = ({ address } = {}) => {
  return new Promise((resolve, reject) => {
    request(
      `${BASE_URL}/account/balance` + (address ? `?address=${address}` : ''),
      (error, response, body) => {
        return resolve(JSON.parse(body));
      }
    );
  });
}

let toAccountData;

postTransact({})
  .then(postTransactResponse => {
    console.log(
      'postTransactResponse (Create Account Transaction)',
      postTransactResponse
    );

    toAccountData = postTransactResponse.transaction.data.accountData;

    return getMine();
  }).then(getMineResponse => {
    console.log('getMineResponse', getMineResponse);

    return postTransact({ to: toAccountData.address, value: 20 });
  })
  .then(postTransactResponse2 => {
    console.log(
      'postTransactResponse2 (Standard Transaction)',
      postTransactResponse2
    );

    return getMine();
  })
  .then(getMineResponse2 => {
    console.log('getMineResponse2', getMineResponse2);

    return getAccountBalance();
  })
  .then(getAccountBalanceResponse => {
    console.log('getAccountBalanceResponse', getAccountBalanceResponse);

    return getAccountBalance({ address: toAccountData.address });
  })
  .then(getAccountBalanceResponse2 => {
    console.log('getAccountBalanceResponse2', getAccountBalanceResponse2);
  });
