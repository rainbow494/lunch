require.config({
    baseUrl : 'bower_components/jquery/dist'
});

define(['jquery'], function ($) {
    var api = {};
    var apiUrl = 'http://<aws.hostname>:<aws.webserver.port>/api/lunch/';

    var getSummary = function () {
        return $.ajax({
            url : apiUrl + 'summary',
            beforeSend : function (xhr) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
        }).fail(function (err) {
            console.warn(err);
        });
    };

    var updateAccount = function (name, account) {
        return $.ajax({
            type : 'POST',
            url : apiUrl + 'updateAccount',
            data : {
                name : name,
                account : account
            },
            beforeSend : function (xhr) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
        })
        .fail(function (err) {
            console.warn(err);
            return $.Deferred().reject(err);
        });
    };

    api.getSummary = getSummary;

    api.updateAccount = updateAccount;

    return api;
});
