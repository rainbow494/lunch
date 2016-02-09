require.config({
    baseUrl : 'bower_components',
    // shim: {
    //     'bootstrap.min': ['jquery']
    // },
    paths : {
        jquery : 'jquery/dist/jquery',
        knockout : 'knockout/dist/knockout',        
        'knockout-amd-helpers': 'knockout-amd-helpers/build/knockout-amd-helpers',
        'text': 'text/text',
        util : '../project/js/util',
        api : '../project/js/api',
        bootstrap : 'bootstrap/dist/js/bootstrap.min'
    }
});

require(['jquery', 'knockout', 'util', 'api', 'knockout-amd-helpers', 'text'], function ($, ko, util, api) {

    require(['bootstrap']);
    
    function EditViewModel() {
        ko.amdTemplateEngine.defaultPath = "../templates";
        this.obLunchAccounts = ko.observableArray();
        this.obResult = ko.observable();
    }

    EditViewModel.prototype.updateAllAccountsClick = function () {
        var self = this;

        var deferreds = [];
        self.obLunchAccounts().forEach(function (item) {
            deferreds.push(api.updateAccountByAmount(item.name, item.account));
        });

        // 利用apply数组化参数
        $.when.apply($, deferreds)
        .done(function (data) {
            var result = $.parseJSON(data[0]);
            self.obResult(result);
            self.loadPage();
        });
    };

    EditViewModel.prototype.insertAllDetailsClick = function () {
        var self = this;

        var deferreds = [];
        self.obLunchAccounts().forEach(function (item) {
            if (item.insertAmount !== 0)
            deferreds.push(api.insertDetail(item.name, item.insertDate, item.insertAmount));
        });

        // 利用apply数组化参数
        $.when.apply($, deferreds)
        .done(function (data) {// jshint ignore:line
            //var result = $.parseJSON(data);
            //console.log(result);
            //obResult(result);
            self.loadPage();
        });
    };

    EditViewModel.prototype.insertDetailClickGen = function (name, date, amount) {
        var self = this;

        return function () {
            if (amount !== 0)
                api.insertDetail(name, date, amount).done(self.loadPage);
        };
    };

    EditViewModel.prototype.loadPage = function () {
        var self = this;

        api.getSummary()
        .done(function (data) {
            var accounts = $.parseJSON(data);
            accounts = accounts.map(function (account) {
                    account.insertAmount = 0;
                    account.insertDate = util.getToday();
                    return account;
                });
            self.obLunchAccounts(accounts);
        });
    };

    var viewModel = new EditViewModel();
    ko.applyBindings(viewModel);
    viewModel.loadPage();
});
