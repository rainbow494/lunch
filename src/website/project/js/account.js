
require(
    ['common'],
    function () {
        require([
            'util',
            'api',
            'knockout'
        ],
    function (
        util,
        api,
        ko
        )
    {
        function AccountViewModel() {
            ko.amdTemplateEngine.defaultPath = "../templates";
            this.obUser = ko.observable('');
        }

        AccountViewModel.prototype.loadPage = function () {
            var self = this;

            if (self.obSelectedDateRange().startDate || self.obSelectedDateRange().endDate){
                api.verifyUserLogin(
                    // util.getLongFormateDate(self.obSelectedDateRange().startDate)
                )
                .done(function(result) {
                    self.obUser(result);
                });
            }
        };

        setTimeout(function() {
            var viewModel = new AccountViewModel();
            ko.applyBindings(viewModel);
            viewModel.loadPage();
        }, 0);


});});
