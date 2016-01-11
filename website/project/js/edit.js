require.config({
    baseUrl : 'bower_components',
    paths : {
        jquery : 'jquery/dist/jquery',
        knockout : 'knockout/dist/knockout',
        util : '../project/js/util',
        api : '../project/js/api'
    }
});

require(['jquery', 'knockout', 'util', 'api'], function ($, ko, util, api) {

    var obLunchAccounts = ko.observableArray();
    var obResult = ko.observable();

    var updateAllAccountsClick = function () {
        var deferreds = [];
        obLunchAccounts().forEach(function (item) {
            deferreds.push(api.updateAccountByAmount(item.name, item.account));
        });

        // 利用apply数组化参数
        $.when.apply($, deferreds)
        .done(function (data) {
            var result = $.parseJSON(data[0]);
            obResult(result);
            loadPage();
        });
    };

    var insertAllDetailsClick = function () {
        var deferreds = [];
        obLunchAccounts().forEach(function (item) {
            if (item.insertAmount !== 0)
            deferreds.push(api.insertDetail(item.name, item.insertDate, item.insertAmount));
        });

        // 利用apply数组化参数
        $.when.apply($, deferreds)
        .done(function (data) {// jshint ignore:line
            //var result = $.parseJSON(data);
            //console.log(result);
            //obResult(result);
            loadPage();
        });
    };

    var insertDetailClickGen = function (name, date, amount) {
        return function () {
            if (amount !== 0)
                api.insertDetail(name, date, amount).done(loadPage);
        };
    };

    var loadPage = function () {
        api.getSummary()
        .done(function (data) {
            var accounts = $.parseJSON(data);
            accounts = accounts.map(function (account) {
                    account.insertAmount = 0;
                    account.insertDate = util.getToday();
                    return account;
                });
            obLunchAccounts(accounts);
        });
    };

    loadPage();

    var editViewModel = {
        obResult : obResult,
        updateAllAccountsClick : updateAllAccountsClick,
        insertAllDetailsClick : insertAllDetailsClick,
        insertDetailClickGen : insertDetailClickGen,
        obLunchAccounts : obLunchAccounts
    };

    ko.applyBindings(editViewModel);
});
