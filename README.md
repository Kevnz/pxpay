[![Build Status](https://travis-ci.org/Kevnz/pxpay.png?branch=master)](https://travis-ci.org/Kevnz/pxpay)

## pxpay 

### PxPay implementation for node.js

Node module to use the [PxPay](http://paymentexpress.co.nz/developer-e-commerce-paymentexpress-hosted-pxpay) service from [Payment Express](http://paymentexpress.co.nz/).

#### Install
```bash
$ npm install pxpay --save
```

#### Usage

```javascript
var pxpay = require('pxpay');
pxpay.request({
    user: 'TestAccount',
    password: 'password',
    amount: '1.00',
    reference: 'Test',
    transactionId: 'test-' + Date.now(),
    addCard: 1,
    successURL: 'http://example.com/success',
    failURL: 'http://example.com/fail'
}, function submitcallback (err, result) {

    result.$.valid; //=== 1

});
```
