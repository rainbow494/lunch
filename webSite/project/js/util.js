require.config({
    baseUrl: 'bower_components',
    paths: {
        jquery: 'jquery/dist/jquery',
        moment: 'momentjs/moment'
    }
});

define(['jquery', 'moment'], function($, moment) {
    var util = {};
    util.getToday = function() {
        return moment().format('YYYY-MM-DD');
    };

    util.getParameterByName = function(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
            results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    return util;
});