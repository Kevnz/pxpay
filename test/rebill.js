var assert = require('assert')
var proxyquire = require('proxyquire').noPreserveCache()
var xpath = require('xpath')
var Dom = require('xmldom').DOMParser
var DPS_BILLING_ID = '0000000000010'

var returnedRequest =
  '<Request valid="1"><URI>https://sec.paymentexpress.com/pxpay/pxpay.aspx?userid=TestAccount&amp;request=e88cd9f2f6f301c712ae2106ab2b6137d86e954d2163d1042f73cce130b2c 88c06daaa226629644dc741b16deb77ca14ce4c59db84929eb0280837b92bd2ffec 2fae0b9173c066dab48a0b6d2c0f1006d4d26a8c75269196cc540451030958d257c1 86f587ad92cfa7472b101ef72e45cda3bf905862c2bf58fc214870292d6646f7c4ad 02a75e42fc64839fc50cea8c17f65c6a9b83b9c124e2f20844b63538e13a8cff17ec d8f165aee525632fd3661b591626f5fb77725ade21648fed94553f43bfa69acf3557 0ff8fdcbaf8a13a3fa7deb244017e41749e652a3549a5dbe20c6c3a7a66aa5901e3f 87150f7fc</URI></Request>'
var pxpay = proxyquire('../index.js', {
  request: function(opts, callback) {
    callback(null, null, returnedRequest)
  },
})

describe('Request Generation and Rebilling', function() {
  it('request object to send should be properly formatted', function(done) {
    var options = {
      user: 'TestAccount',
      password: 'password',
      amount: '1.00',
      reference: 'Test',
      TxnId: 'test-' + Date.now(),
      dpsBillingId: DPS_BILLING_ID,
    }
    var rq = pxpay.generateRequest(options)
    var doc = new Dom().parseFromString(rq)
    var dpsBillingId = xpath
      .select('/GenerateRequest/DpsBillingId/text()', doc)
      .toString()
    assert.strictEqual(
      dpsBillingId,
      DPS_BILLING_ID,
      'The Node value should be the correct Id'
    )
    done()
  })
  it('request should have optional parameters', function(done) {
    var options = {
      user: 'TestAccount',
      password: 'password',
      amount: '1.00',
      reference: 'Test',
      line1: '1 Street Rd',
      line2: 'Some Suburb',
      line3: 'Testville',
      email: 'test@example.com',
      TxnId: 'test-' + Date.now(),
      addCard: 1,
      successURL: 'http://example.com/success',
      failURL: 'http://example.com/fail',
    }
    var rq = pxpay.generateRequest(options)
    var doc = new Dom().parseFromString(rq)
    var addref = xpath
      .select('/GenerateRequest/MerchantReference/text()', doc)
      .toString()
    assert.strictEqual(addref, 'Test', 'The Node value should be Test')
    done()
  })
  it('rebill request object should return result', function(done) {
    pxpay.request(
      {
        user: 'TestAccount',
        password: 'password',
        amount: '1.00',
        reference: 'Test',
        TxnId: 'test-' + Date.now(),
        dpsBillingId: DPS_BILLING_ID,
        successURL: 'http://example.com/success',
        failURL: 'http://example.com/fail',
      },
      function submitcallback(err, result) {
        assert.strictEqual(err, null)
        assert.strictEqual(result.$.valid, '1', 'result should be valid')
        done()
      }
    )
  })
})
