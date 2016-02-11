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

    util.format = function() {
      var s = arguments[0];
      for (var i = 0; i < arguments.length - 1; i++) {       
          var reg = new RegExp("\\{" + i + "\\}", "gm");             
          s = s.replace(reg, arguments[i + 1]);
      }
      return s;
    };

  return util;
});