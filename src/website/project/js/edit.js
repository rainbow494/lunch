require(['common'], function () {
    require(['jquery', 'util', 'api', 'knockout'], function ($, util, api, ko) {
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
                var result = JSON.parse(data[0]);
                self.obResult(result);
                self.loadPage();
            });
        };

        EditViewModel.prototype.insertAllDetailsClick = function () {
            var self = this;

            var tmp = self.obLunchAccounts().filter(function (item) {
                return item.insertAmount !== 0;
            });


            if (tmp.length > 0){
                var details = tmp.map(function (item) {
                    return {
                        name: item.name,
                        date: item.insertDate,
                        amount: item.insertAmount
                    };
                });

                api.insertDetails2(details)
                .done(function (data) {// jshint ignore:line
                    //var result = $.parseJSON(data);
                    self.loadPage();
                });
            }
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
                var accounts = JSON.parse(data);
                accounts = accounts.map(function (account) {
                    account.insertAmount = 0;
                    account.insertDate = util.getFormatToday();
                    return account;
                });
                self.obLunchAccounts(accounts);
            });
        };

        var viewModel = new EditViewModel();
        ko.applyBindings(viewModel);
        viewModel.loadPage();
    });
});
