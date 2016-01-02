require.config({
    baseUrl : 'bower_components',
    paths : {
        jquery : 'jquery/dist/jquery',
        knockout : 'knockout/dist/knockout',
        moment : 'momentjs/moment',
        api : '../project/js/api'
    }
});

require(['jquery', 'knockout', 'moment', 'api'], function ($, ko, moment, api) {
    var obLunchDetail = ko.observableArray();
    var obAccountName = ko.observable('paul');
    var obInsertDate = ko.observable(moment().format("YYYY-MM-DD"));
    var obInsertAmount = ko.observable(0);
    var updateDetailClickGen = function(id, amount){
        return function(){
            //console.log(id);
            //console.log(amount);
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
        updateDetailClickGen:updateDetailClickGen
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