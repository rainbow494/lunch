require(['common'], function () {
    require(['api', 'knockout','util'], function (api, ko, util) {
        function UserManagerViewModel(){
            ko.amdTemplateEngine.defaultPath = "../templates";
            this.obLunchAccounts = ko.observableArray();

            this.obUser = ko.observable('');
        }

        UserManagerViewModel.prototype.loadPage = function () {
            var self = this;
            api.getSummary()
            .done(function (data) {
                var result = JSON.parse(data);
                self.obLunchAccounts(result);
            });

            api.verifyUserLogin()
            .done(function(result) {
                self.obUser(JSON.parse(result));
            });
        };

        UserManagerViewModel.prototype.updateLunchClickGen = function(id, mail){
            var self = this;
            return function(){
                api.updateAccountMail(id, mail)
                .done(self.loadPage.bind(self)());
            };
        };

    // setTimeout(function() {
        var viewModel = new UserManagerViewModel();
        ko.applyBindings(viewModel);
        viewModel.loadPage();
    // }, 0);
    });
});
