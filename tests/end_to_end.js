/*
Request XML

<GenerateRequest>
  <PxPayUserId>TestAccount</PxPayUserId>
  <PxPayKey>dc339b3126c8fbadf4b30b498ded6a62a17b5f831e3111116bd8e332c730bbc8</PxPayKey>
  <AmountInput>2.06</AmountInput>
  <CurrencyInput>NZD</CurrencyInput>
  <MerchantReference>Test Transaction</MerchantReference>
  <EmailAddress></EmailAddress>
  <TxnData1>28 Grange Rd</TxnData1>
  <TxnData2>Auckland</TxnData2>
  <TxnData3>NZ</TxnData3>
  <TxnType>Purchase</TxnType>
  <TxnId>P777575CA3DDA78C</TxnId>
  <BillingId></BillingId>
  <EnableAddBillCard>0</EnableAddBillCard>
  <UrlSuccess>http://www.mycompany.com/success.cfm</UrlSuccess>
  <UrlFail>http://www.mycompany.com/fail.cfm</UrlFail>
  <Opt>TO=0901142221</Opt>
</GenerateRequest>

        var dpsData = {
            GenerateRequest: [
                { PxPayUserId: details.user },
                { PxPayKey: details.password },
                { TxnType: details.transactionType || 'Purchase' },
                { AmountInput: details.amount },
                { CurrencyInput: details.currency || 'NZD' },
                { MerchentReference: details.reference },
                { TxnData1: details.line1 },
                { TxnData2: details.line2 },
                { TxnData3: details.line3 },
                { EmailAddress: details.email },
                { TxnId: details.transactionId || '' },
                { BillingId: details.billingId },
                { EnableAddBillCard: details.addCard },
                { UrlSuccess: details.successURL },
                { UrlFail: details.failURL }
            ]
        };
*/
var assert = require('assert');

var qconf = require('qconf'),
    config = qconf();
describe('requestGeneration', function() {

  it('request object should return result', function(done) {
    var pxpay = require('../index.js');
    //console.log('rq');
    pxpay.request({
        user: config.get('user'),
        password: config.get('password'),
        amount: '1.00',
        reference: 'Test',
        TxnId: 'test-' + Date.now(),
        addCard: 1,
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
