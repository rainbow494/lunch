require.config({
    baseUrl : 'bower_components',
    paths : {
        jquery : 'jquery/dist/jquery',
        moment : 'momentjs/moment'
    }
});

define(['jquery', 'moment'], function ($, moment) {
    var util = {};
    util.getToday = function()
    {
        return moment().format("YYYY-MM-DD");
    };
    
    return util;
});