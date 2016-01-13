(function () {
    var fs = require('fs');
    var Handlebars = require('handlebars');
    var juice = require('juice');

    var mailTemplate = fs.readFileSync('weeklyReportTemplate.html').toString();
    var mailStyle = fs.readFileSync('mailStyles.css').toString();

	var defaultMailBodyData = {
			'date' : '2015-01-01',
            'name' : '',
            'account' :0,
            'details' : [],
			'expense':0,
            'detailLink' : '',
        };
    function MailTmpToHtml() {}

    MailTmpToHtml.prototype.CreateMailBody = function (data) {

        var hbsMailTemplate = Handlebars.compile(mailTemplate);
        var mailBodyWithOutCSS = hbsMailTemplate(data);

        var mailBody = juice.inlineContent(mailBodyWithOutCSS, mailStyle);

        return mailBody;
    };

    exports.mailTmpToHtml = function () {
        return new MailTmpToHtml();
    };
})();
