const xml = require('xml')
const Parser = require('xml2js').Parser
const prod = 'https://sec.paymentexpress.com/pxaccess/pxpay.aspx'
const uat = 'https://uat.paymentexpress.com/pxaccess/pxpay.aspx'
const txtTypes = ['Purchase', 'Auth', 'Complete', 'Refund', 'Validate']
const SUCCESS_STATUS = 1
const FAIL_STATUS = 0

module.exports = {
  generateRequest: function(details) {
    const dataPayload = [
      { PxPayUserId: details.user },
      { PxPayKey: details.password },
      { TxnType: details.transactionType || 'Purchase' },
      { AmountInput: details.amount },
      { CurrencyInput: details.currency || 'NZD' },
    ]
    if (details.successURL) {
      dataPayload.push({ UrlSuccess: details.successURL })
    }
    if (details.failURL) {
      dataPayload.push({ UrlFail: details.failURL })
    }
    if (details.TxnId) {
      dataPayload.push({ TxnId: details.TxnId })
    }
    if (details.transactionId) {
      dataPayload.push({ TxnId: details.transactionId })
    }
    if (details.reference) {
      dataPayload.push({ MerchantReference: details.reference })
    }
    if (details.email) {
      dataPayload.push({ EmailAddress: details.email })
    }
    if (details.line1) {
      dataPayload.push({ TxnData1: details.line1 })
    }
    if (details.line2) {
      dataPayload.push({ TxnData2: details.line2 })
    }
    if (details.line3) {
      dataPayload.push({ TxnData3: details.line3 })
    }
    if (details.billingId) {
      dataPayload.push({ BillingId: details.billingId })
    }
    if (details.addCard) {
      dataPayload.push({ EnableAddBillCard: details.addCard })
    }
    if (details.dpsBillingId) {
      dataPayload.push({ DpsBillingId: details.dpsBillingId })
    }
    var dpsData = {
      GenerateRequest: dataPayload,
    }
    return xml(dpsData)
  },
  request: function(details, callback) {
    var rquest = require('request')
    var dpsData = this.generateRequest(details)
    var self = this
    rquest(
      {
        uri: process.env.NODE_ENV === 'production' ? prod : uat,
        method: 'POST',
        body: dpsData,
      },
      function requestCallback(err, res, body) {
        process.nextTick(function() {
          self.process(err, res, body, callback)
        })
      }
    )
  },
  process: function(err, res, body, callback) {
    if (err) {
      process.nextTick(function() {
        callback(err)
      })
    } else {
      var parser = new Parser({ explicitArray: false })

      process.nextTick(function() {
        parser.parseString(body, function parserHandler(error, result) {
          if (error) {
            process.nextTick(function() {
              callback(error)
            })
          } else if (
            !result ||
            !result.Request ||
            !result.Request.$ ||
            !result.Request.$.valid
          ) {
            process.nextTick(function() {
              callback({
                message: 'result did not return correct code',
                result: result,
              })
            })
          } else if (result.Request.$.valid === '1') {
            process.nextTick(function() {
              callback(null, result.Request)
            })
          } else {
            process.nextTick(function() {
              callback({
                message: 'result did not return correct code',
                result: result,
              })
            })
          }
        })
      })
    }
  },
}
