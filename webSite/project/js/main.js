require(['common'], function () {
    require(['api', 'knockout'], function (api, ko) {
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

    // setTimeout(function() {
        var viewModel = new IndexViewModel();
        ko.applyBindings(viewModel);
        viewModel.loadPage();
    // }, 0);
    });
});
