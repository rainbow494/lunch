var assert = require('assert');
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = require('should');

describe('backend:', function() {
	describe('mailHelper.js:', function() {
		it('_getMailBody(accountInfo)', function() {

			var mailHelper = require('../backend/mailHelper.js').mailHelper();
			var accountinfo = {
				name: 'paul',
				account: 3,
				mail: 'test@mail.com'
			};
			return mailHelper._getMailBody([accountinfo]).then(function(data){
				var mailTo = data.to;
				mailTo.should.equal('test@mail.com');	
			})
		});
	});
});