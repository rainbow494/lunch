(function () {
    var fs = require('fs');
    var Handlebars = require('handlebars');
    var juice = require('juice');
    var moment = require('moment');

    var mailTemplate = fs.readFileSync('weeklyReportTemplate.html').toString();
    var mailStyle = fs.readFileSync('mailStyles.css').toString();

    function MailTmpToHtml() {}

    MailTmpToHtml.prototype.CreateMailBody = function (data) {
        data.date = moment().locale('zh-cn').format('LL');

        var hbsMailTemplate = Handlebars.compile(mailTemplate);
        var mailBodyWithOutCSS = hbsMailTemplate(data);

        var mailBody = juice.inlineContent(mailBodyWithOutCSS, mailStyle);

        return mailBody;
    };

    exports.mailTmpToHtml = function () {
        return new MailTmpToHtml();
    };
})();
