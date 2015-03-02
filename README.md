[![Build Status](https://travis-ci.org/Kevnz/pxpay.png?branch=master)](https://travis-ci.org/Kevnz/pxpay)

pxpay
=====

PxPay implementation for node.js

```
var pxpay = require('pxpay');
pxpay.request({
    user: 'TestAccount',
    password: 'password',
    amount: '1.00',
    reference: 'Test',
    TxnId: 'test-' + Date.now(),
    addCard: 1,
    successURL: 'http://example.com/success',
    failURL: 'http://example.com/fail'
}, function submitcallback (err, result) {

    result.$.valid; //=== 1

});
```