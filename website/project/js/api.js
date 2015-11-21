;
require.config({
    baseUrl : 'bower_components/jquery/dist'
});

define(['jquery'], function ($) {
    var api = {};
    var apiUrl = 'http://localhost:3000/api/lunch/';

    var getSummary = function () {
        return $.ajax({
            url : apiUrl + 'summary',
            beforeSend : function (xhr) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
        }).fail(function (err) {
            console.warn(err);
        });
    }

    var updataAccount = function (name, account) {
        return $.ajax({
            type : 'POST',
            url : apiUrl + 'updateAccount',
            data : {
                name : name,
                account : account
            },
            beforeSend : function (xhr) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
        })
        .fail(function (err) {
            console.warn(err);
            return deferred.fail(err);
        });
    }

    api.getSummary = getSummary;

    api.updataAccount = updataAccount;

    return api;
});