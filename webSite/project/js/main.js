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

    myViewModel = {
        obLunchAccounts
    };

    var loadPage = function () {
        api.getSummary()
        .done(function (data) {
            var result = $.parseJSON(data);
            obLunchAccounts(result);
        });
    }

    loadPage();

    ko.applyBindings(myViewModel);
});
