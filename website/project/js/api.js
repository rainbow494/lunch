require.config({
    baseUrl : 'bower_components/jquery/dist'
});

define(['jquery'], function ($) {
    var api = {};
    var apiUrl = 'http://<aws.hostname>:<aws.webserver.port>/api/';

    var getSummary = function () {
        return $.ajax({
            url : apiUrl + 'lunch/summary',
            beforeSend : function (xhr) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
        }).fail(function (err) {
            console.warn(err);
        });
    };
    
    var getDetail = function (accountName) {
        return $.ajax({
            url : apiUrl + 'detail/queryDetailByName?name=' + accountName,
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
            url : apiUrl + 'lunch/updateAccount',
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

    var updateDetail = function (id, amount) {
        return $.ajax({
            type : 'POST',
            url : apiUrl + 'lunch/updateDetail',
            data : {
                id : id,
                amount : amount
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
    api.getDetail = getDetail;
    api.updateDetail = updateDetail;

    return api;
});
