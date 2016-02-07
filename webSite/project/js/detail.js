require.config({
    baseUrl : 'bower_components',
    paths : {
        jquery : 'jquery/dist/jquery',
        knockout : 'knockout/dist/knockout',
        'knockout-amd-helpers': 'knockout-amd-helpers/build/knockout-amd-helpers',
        'text': 'text/text',
        util : '../project/js/util',
        api : '../project/js/api',
    }
});

require(['jquery', 'knockout', 'util', 'api', 'knockout-amd-helpers', 'text'], function ($, ko, util, api) {
    
    function DetailViewModel() {
        ko.amdTemplateEngine.defaultPath = "../templates";
        this.obLunchDetail = ko.observableArray();
        this.obAccountName = ko.observable('paul');
        this.obInsertDate = ko.observable(util.getToday());
        this.obInsertAmount = ko.observable(-1);
    }

    DetailViewModel.prototype.formatDate = function(date)
    {
        return date.split('T')[0];
    };
    
    DetailViewModel.prototype.updateDetailClickGen = function(id, amount){
        var self = this;
        return function(){
            api.updateDetail(id, amount)
            .done(self.loadPage);
        };
    };
    
    DetailViewModel.prototype.insertDetailClick = function()
    {
        var self = this;
        api.insertDetail(self.obAccountName(), self.obInsertDate(), self.obInsertAmount())
        .done(self.loadPage);
    };

    DetailViewModel.prototype.loadPage = function () {
        var self = this;
        self.obAccountName(util.getParameterByName('name'));

        api.getDetail(self.obAccountName())
        .done(function (data) {
            var result = $.parseJSON(data);
            self.obLunchDetail(result);
        });
    };

    // setTimeout(function() {
        var viewModel = new DetailViewModel();
        ko.applyBindings(viewModel);
        viewModel.loadPage();
    // }, 0);
});