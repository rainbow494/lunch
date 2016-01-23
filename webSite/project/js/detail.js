require.config({
    baseUrl : 'bower_components',
    paths : {
        jquery : 'jquery/dist/jquery',
        knockout : 'knockout/dist/knockout',
        util : '../project/js/util',
        api : '../project/js/api',
    }
});

require(['jquery', 'knockout', 'util', 'api'], function ($, ko, util, api) {
    var obLunchDetail = ko.observableArray();
    var obAccountName = ko.observable('paul');
    var obInsertDate = ko.observable(util.getToday());
    var obInsertAmount = ko.observable(-1);
    
    var formatDate = function(date)
    {
        return date.split('T')[0];
    };
    
    var updateDetailClickGen = function(id, amount){
        return function(){
            api.updateDetail(id, amount)
            .done(loadPage);
        };
    };
    
    var insertDetailClick = function()
    {
        api.insertDetail(obAccountName(), obInsertDate(), obInsertAmount())
        .done(loadPage);
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
        obInsertDate:obInsertDate,
        obInsertAmount:obInsertAmount,
        insertDetailClick:insertDetailClick,
        updateDetailClickGen:updateDetailClickGen,
        formatDate:formatDate
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