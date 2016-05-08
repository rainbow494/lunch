require(['common'], function () {
    require(['jquery', 'util', 'api', 'knockout'], function ($, util, api, ko) {
        function EditViewModel() {
            ko.amdTemplateEngine.defaultPath = "../templates";
            this.obLunchAccounts = ko.observableArray();
            this.obResult = ko.observable();

            this.obUser = ko.observable('');

        }

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

            api.verifyUserLogin()
            .done(function(result) {
                self.obUser(JSON.parse(result));
            });
        };

        var viewModel = new EditViewModel();
        ko.applyBindings(viewModel);
        viewModel.loadPage();
    });
});
