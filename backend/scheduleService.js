(function () {
    var CronJob = require('cron').CronJob,
    mailHelper = require('./mailHelper.js').mailHelper();

    var weeklyReportScheduleJob = new CronJob({
            cronTime : '00 30 13 * * 5',
            onTick : function () {
                mailHelper.sendWeeklyReports();
            },
            start : false,
            timeZone : "Asia/Shanghai"
        });
    weeklyReportScheduleJob.start();

    console.log('Schedule services start');
    // try {
    // new CronJob('invalid cron pattern', function () {
    // console.log('this should not be printed');
    // })
    // } catch (ex) {
    // console.log("cron pattern not valid");
    // }
})();
