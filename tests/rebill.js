var assert = require('assert');
var pxpay = require('../index.js');
var qconf = require('qconf'),
    config = qconf(),
    xpath = require('xpath'),
    dom = require('xmldom').DOMParser;
var DPS_BILLING_ID = '0000060001010';

describe('Request Generation and Rebilling', function() {

    it('request object to send should be properly formatted', function(done) {
        //console.log('test');
        
        var options ={
            user: config.get('user'),
            password: config.get('password'),
            amount: '1.00',
            reference: 'Test',
            TxnId: 'test-'+Date.now(),
            dpsBillingId: DPS_BILLING_ID,
 

        };
        var rq = pxpay.generateRequest(options);
        //console.log(rq);
        var doc = new dom().parseFromString(rq);
        var dpsBillingId = xpath.select("/GenerateRequest/DpsBillingId/text()", doc).toString();
        assert.equal(dpsBillingId, DPS_BILLING_ID, "The Node value should be the correct Id");
        done();
    });
    it('request should have optional parameters', function (done) {
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
        //console.log(rq);
        var doc = new dom().parseFromString(rq);
        var addref = xpath.select("/GenerateRequest/MerchentReference/text()", doc).toString();
        assert.equal(addref, 'Test', "The Node value should be Test");
        done();
    });
  it('rebill request object should return result', function(done) {
    var pxpay = require('../index.js');
    console.log('rq');
    pxpay.request({
        user: config.get('user'),
        password: config.get('password'),
        amount: '1.00',
        reference: 'Test',
        TxnId: 'test-' + Date.now(),
        dpsBillingId: DPS_BILLING_ID,
        successURL: 'http://example.com/success',
        failURL: 'http://example.com/fail'
    }, function submitcallback (err, result) {
        console.log(result);
        console.log('that was the result from px');
        assert.equal(result.$.valid, 1, "result should be valid");
        done();
    });
        
  });


});
 