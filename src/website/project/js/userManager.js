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
                result.map(function(user) {
                    user.password = '';
                });
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

        UserManagerViewModel.prototype.sendTestMailClickGen = function(name){
            return function(){
                //http://lunch.zuoshachi.com:12333/api/sendReportImmediately?name=paul
                api.sendTestMail(name)
                .done(function() {
                    console.log('Send Test Mail');
                });
            };
        };

        UserManagerViewModel.prototype.setPasswordClickGen = function(username, password){
            var self = this;
            return function(){
                api.setPassword(username, password)
                .done(function() {
                    //self.loadPage.bind(self)();
                    // if updated current user, logout
                });
            };
        };

    // setTimeout(function() {
        var viewModel = new UserManagerViewModel();
        ko.applyBindings(viewModel);
        viewModel.loadPage();
    // }, 0);
    });
});
