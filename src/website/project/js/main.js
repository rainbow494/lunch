require(['common'], function () {
    require(['api', 'knockout','util'], function (api, ko, util) {
        function IndexViewModel(){
            ko.amdTemplateEngine.defaultPath = "../templates";
            this.obLunchAccounts = ko.observableArray();
        }

        IndexViewModel.prototype.loadPage = function () {
            var self = this;
            api.getSummary()
            .done(function (data) {
                var result = JSON.parse(data);
                self.obLunchAccounts(result);
            });
        };

        IndexViewModel.prototype.formatAmount = function(amount) {
            return util.formatAmount(amount);
        };

    // setTimeout(function() {
        var viewModel = new IndexViewModel();
        ko.applyBindings(viewModel);
        viewModel.loadPage();
    // }, 0);
    });
});
