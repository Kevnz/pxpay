var request = require('request');
var xml = require('xml');
var url = 'https://sec.paymentexpress.com/pxaccess/pxpay.aspx';

var txtTypes = ['Purchase', 'Auth', 'Complete', 'Refund', 'Validate'];
var SUCCESS_STATUS = 1;
var FAIL_STATUS = 0;

module.exports = {
    request: function (details, callback) {
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

        request({
            uri: url,
            method: 'POST',
            body: xml(dpsData)
        }, function (err, res, body) {
        	console.log(body);
            process.nextTick(function () {
                if(err) {
                    process.nextTick(function(){
                        callback(err);
                    });
                } else {
                    var parser = new require('xml2js').Parser({ explicitArray: false});
                    process.nextTick(function(){
                        parser.parseString(body, function (error, result){
                            console.log(result);
                            if(result.$.valid === 1){
                                process.nextTick(function(){ callback(null, result); });
                            } else if (error) {
                                process.nextTick(function(){ callback(error); });
                            } else {
                                process.nextTick(function(){ callback({message: "result did not return correct code", result: result });});
                            }
                        });
                    });
                }

            });
        });
    },
    process: function () {
        
    }
};