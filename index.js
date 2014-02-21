var request = require('request');
var xml = require('xml');
var url = 'https://sec.paymentexpress.com/pxaccess/pxpay.aspx';

var txtTypes = ['Purchase', 'Auth', 'Complete', 'Refund', 'Validate'];
var SUCCESS_STATUS = 1;
var FAIL_STATUS = 0;

module.exports = {
    generateRequest: function (details) {
        var dataPayload = [
                { PxPayUserId: details.user },
                { PxPayKey: details.password },
                { TxnType: details.transactionType || 'Purchase' },
                { AmountInput: details.amount },
                { CurrencyInput: details.currency || 'NZD' }
            ];
        if (details.successURL ) {
            dataPayload.push( { UrlSuccess: details.successURL });
        }
        if (details.failURL ) {
            dataPayload.push( {  UrlFail: details.failURL });
        }
        if (details.transactionId) {
            dataPayload.push({ TxnId: details.transactionId });
        }
        if (details.reference) {
            dataPayload.push({ MerchentReference: details.reference });
        }
        if (details.email) {
            dataPayload.push({ EmailAddress: details.email });
        }
        if (details.line1) {
            dataPayload.push({ TxnData1: details.line1 });
        }
        if (details.line2) {
            dataPayload.push({ TxnData2: details.line2 });
        }
        if (details.line3) {
            dataPayload.push({ TxnData3: details.line3 });
        }
        if (details.billingId) {
            dataPayload.push({ BillingId: details.billingId });
        }
        if (details.addCard) {
            dataPayload.push({ EnableAddBillCard: details.addCard });
        }
        if (details.dpsBillingId) {
           dataPayload.push({ DpsBillingId: details.dpsBillingId });
        }
        var dpsData = {
            GenerateRequest: dataPayload
        };
        console.log(dpsData);
        return xml(dpsData);
    },
    request: function (details, callback) {
        var dpsData = this.generateRequest(details);


        request({
            uri: url,
            method: 'POST',
            body: dpsData
        }, function requestCallback (err, res, body) {
            process.nextTick(function requestHandler () {
                if(err) {
                    process.nextTick(function(){
                        callback(err);
                    });
                } else {
                    console.log(body);
                    var parser = new require('xml2js').Parser({ explicitArray: false});
                    process.nextTick(function(){
                        parser.parseString(body, function parserHandler (error, result){
                            console.log(error);
                            if(result.Request.$.valid === '1'){
                                process.nextTick(function(){ callback(null, result.Request); });
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