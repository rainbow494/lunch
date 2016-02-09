require.config({
    baseUrl : 'bower_components',
    // shim: {
    //     'bootstrap.min': ['jquery']
    // },
    paths : {
        knockout : 'knockout/dist/knockout',
        'knockout-amd-helpers': 'knockout-amd-helpers/build/knockout-amd-helpers',
        'text': 'text/text',
        jquery : 'jquery/dist/jquery',
        api : '../project/js/api',
        bootstrap : 'bootstrap/dist/js/bootstrap.min'
    }
});

require(['api', 'jquery', 'knockout', 'knockout-amd-helpers', 'text'], function (api, $, ko) {
    
    require(['bootstrap']);
    
    function IndexViewModel(){
        ko.amdTemplateEngine.defaultPath = "../templates";
        this.obLunchAccounts = ko.observableArray();
    }

    IndexViewModel.prototype.loadPage = function () {
        var self = this;
        api.getSummary()
        .done(function (data) {
            var result = $.parseJSON(data);
            self.obLunchAccounts(result);
        });
    };

    // setTimeout(function() {
        var viewModel = new IndexViewModel();
        ko.applyBindings(viewModel);
        viewModel.loadPage();
    // }, 0);
});
