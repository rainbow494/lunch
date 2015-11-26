;
require.config({
    baseUrl : 'bower_components',
    paths : {
        jquery : 'jquery/dist/jquery',
        knockout : 'knockout/dist/knockout',
        api : '../project/js/api'
    }
});

require(['jquery', 'knockout', 'api'], function ($, ko, api) {

    var obLunchAccounts = ko.observableArray();
    var obAccount = ko.observable();

    var obResult = ko.observable();

    var updateAccountClick = function () {

        var deferreds = []
        obLunchAccounts().forEach(function (item) {
            deferreds.push(api.updateAccount(item.name, item.account));
        })

        // 利用apply数组化参数
        $.when.apply($, deferreds)
        .done(function (data) {
            var result = $.parseJSON(data[0]);
            obResult(result);
            loadPage();
        });
    }

    var loadPage = function () {
        api.getSummary()
        .done(function (data) {
            var result = $.parseJSON(data);
            obLunchAccounts(result);
        });
    }

    loadPage();

    editViewModel = {
        obAccount : obAccount,
        obResult : obResult,
        updateAccountClick : updateAccountClick,
        obLunchAccounts : obLunchAccounts
    };

    ko.applyBindings(editViewModel);
});
