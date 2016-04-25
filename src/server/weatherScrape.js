(function() {
    var CronJob = require('cron').CronJob,
        YQL = require('yql'),
        util = require('./util.js'),
        dbHelper = require('./mongodbExecutor.js').mongdbExecutor(),
        mailHelper = require('./mailHelper.js').mailHelper();

    var weatherScrapeScheduleJob = new CronJob({
        cronTime: '00 30 20 * * *',
        onTick: function() {
            scrapeWeather();
        },
        start: false,
        timeZone: "Asia/Shanghai"
    });
    weatherScrapeScheduleJob.start();

    function scrapeWeather(){
        var query = new YQL('select item.forecast from weather.forecast where woeid in (select woeid from geo.places(1) where text="shanghai")');

        query.exec(function(err, data) {
            // var condition = data.query.results.channel[0].item;
            try {
                var todayWearthReport = data.query.results.channel[0].item.forecast;
                todayWearthReport.dateText = todayWearthReport.date;
                todayWearthReport.date = util.getToday();
                todayWearthReport.high = util.convertF2C(todayWearthReport.high);
                todayWearthReport.low = util.convertF2C(todayWearthReport.low);

                console.log(todayWearthReport);
                dbHelper.weather.insert(todayWearthReport)
                .then(function (result) {
                    console.log(result);
                    return mailHelper.sendWeatherReportToAdmin(todayWearthReport);
                })
                .catch(handleScrapeWeatherException);
            } catch (e) {
                console.log(e);
                handleScrapeWeatherException();
            }
        });
    }

    function handleScrapeWeatherException() {
        console.log('Scrap weatherReport failed!');
        mailHelper.sendNotifyReportToAdmin("Scrap weatherReport failed!");
    }

    console.log('WeatherScrap services start');
    // try {
    // new CronJob('invalid cron pattern', function () {
    // console.log('this should not be printed');
    // })
    // } catch (ex) {
    // console.log("cron pattern not valid");
    // }
})();
