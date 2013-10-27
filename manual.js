var assert = require('assert');
var pxpay = require('./index.js');
var qconf = require('qconf'),
    config = qconf(),
    xpath = require('xpath'),
    dom = require('xmldom').DOMParser;
    
var options ={
            user: config.get('user'),
            password: config.get('password'),
            amount: '1.00',
            reference: 'Test',
            line1: '1 Street Rd',
            line2: 'Some Suburb',
            line3: 'Testville',
            email: 'test@example.com',
            TxnId: 'test-'+Date.now(),
            addCard: 1,
            successURL: 'http://example.com/success',
            failURL: 'http://example.com/fail'
        };
        var rq = pxpay.generateRequest(options);
        console.log(rq);
        var doc = new dom().parseFromString(rq);
        var addBill = xpath.select("/GenerateRequest/EnableAddBillCard/text()", doc).toString();
        assert.equal(addBill, 1, "The Node value should be 1");