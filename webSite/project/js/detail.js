require.config({
    baseUrl : 'bower_components',
    paths : {
        jquery : 'jquery/dist/jquery',
        knockout : 'knockout/dist/knockout',
        api : '../project/js/api'
    }
});

require(['jquery', 'knockout', 'api'], function ($, ko, api) {
    var obLunchDetail = ko.observableArray();
    var obAccountName = ko.observable('paul');
    var updateDetailGen = function(id, amount){
        return function(){
            //console.log(id);
            //console.log(amount);
            api.updateDetail(id, amount)
            .done(loadPage);
        };
    };

    var loadPage = function () {
        obAccountName(getParameterByName('name'));
        api.getDetail(obAccountName())
        .done(function (data) {
            var result = $.parseJSON(data);
            obLunchDetail(result);
        });
    };

    var myViewModel = {
        obLunchDetail:obLunchDetail,
        obAccountName:obAccountName,
        updateDetailGen:updateDetailGen
    };

    loadPage();
    ko.applyBindings(myViewModel);
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}