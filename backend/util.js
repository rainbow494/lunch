(function () {
    var moment = require('moment');

    function util() {}

    util.getDefaultStartDate = function () {
        return '2015-01-01';
    };

    util.getToday = function () {
        return moment().format('YYYY-MM-DD');
    };

    util.getWeekStart = function () {
        return moment().day(1).format('YYYY-MM-DD');
    };

    util.getWeekEnd = function () {
        return moment().day(5).format('YYYY-MM-DD');
    };

    util.getZhDate = function () {
        return moment().locale('zh-cn').format('LL');
    };

    util.convertDBDateToDate = function (dbDate) {
        return moment(dbDate).format('YYYY-MM-DD');
    };

    util.getWeekdayOfDate = function (date) {
        var weekdayIdx = moment(date).day();
        return _weekday[weekdayIdx];
    };

    util.convertF2C = function (fahrenheit) {
        // convert fahrenheit to celsius
        return ((fahrenheit - 32) / 1.8).toFixed(1);
    };

    var _weekday = {
        0 : "周日",
        1 : "周一",
        2 : "周二",
        3 : "周三",
        4 : "周四",
        5 : "周五",
        6 : "周六"
    };

    module.exports = util;
})();
