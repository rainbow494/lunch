require.config({
    baseUrl : 'bower_components',
    paths : {
        jquery : 'jquery/dist/jquery',        
        'text': 'text/text',
        knockout : 'knockout/dist/knockout',
        'knockout-amd-helpers': 'knockout-amd-helpers/build/knockout-amd-helpers',
        bootstrap : 'bootstrap/dist/js/bootstrap.min',
        moment: 'moment/moment',
        'moment-recur': 'moment-recur/moment-recur',
        util : '../project/js/util',
        api : '../project/js/api'
    }
});

define(['jquery', 'text', 'knockout', 'knockout-amd-helpers', 'api', 'util'], function () {
	require(['bootstrap'], function () {
	});
});
