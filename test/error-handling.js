var proxyquire = require('proxyquire').noPreserveCache();
var assert = require('assert');
var qconf = require('qconf'),
    config = qconf(),
    xpath = require('xpath'),
    dom = require('xmldom').DOMParser;
var expect = require('chai').expect;

describe('Error Handling', function() {


    var returnedRequest = '<Request valid="0" />';
    var testError = new Error('Test');

  it('request object should return error gracefully', function(done) {
    var pxpay = proxyquire('../index.js', { 'request' : function (opts, callback) {
      callback(testError, null, returnedRequest);
    }});

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
        expect(err).to.not.be.null;
        done();
    });

  });
  it('should handle XML Parsing failure', function(done) {
    var pxpay = proxyquire('../index.js', {
        'xml2js': {
            Parser: function() {
                return {
                    parseString: function(obj, callback) {
                        callback(new Error('Failed Parsing'));
                    }
                }
            }
        }
    });
    pxpay.process(null, {}, '', function submitcallback (err, result) {
        expect(err).to.not.be.null;
        done();
    });

  });
  it('should handle XML Parsing returning no object', function(done) {
    var pxpay = proxyquire('../index.js', {
        'xml2js': {
            Parser: function() {
                return {
                    parseString: function(obj, callback) {
                        callback(null, {});
                    }
                }
            }
        }
    });
    pxpay.process(null, {}, '', function submitcallback (err, result) {
        expect(err).to.not.be.null;
        done();
    });

  });
  it('should handle XML Parsing returning invalid code', function(done) {
    var pxpay = proxyquire('../index.js', {
        'xml2js': {
            Parser: function() {
                return {
                    parseString: function(obj, callback) {
                        callback(null, {
                            Request: {
                                $: {
                                    valid: '0'
                                }
                            }
                        });
                    }
                }
            }
        }
    });
    pxpay.process(null, {}, '', function submitcallback (err, result) {
        expect(err).to.not.be.null;
        done();
    });
  });
});

