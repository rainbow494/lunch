require.config({
    baseUrl: 'bower_components',
    paths: {
        jquery: 'jquery/dist/jquery',
        moment: 'moment/moment'
    }
});

define(['jquery', 'moment'], function($, moment) {
    var util = {};
    util.getFormatToday = function() {
        return moment().format('YYYY/MM/DD');
    };

    util.getShortFormateDate = function(momentDate) {
        return momentDate.format('MM/DD');
    };

    util.getLongFormateDate = function(momentDate) {
        return momentDate.format('YYYY/MM/DD');
    };

    util.covertISOToFormatDate = function(isoDate) {
        return isoDate.split('T')[0];
    };

    util.covertISOToMomentDate = function(isoDate) {
        return moment(util.covertISOToFormatDate(isoDate));
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