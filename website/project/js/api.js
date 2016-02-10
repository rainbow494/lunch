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
    
    var getDetailsByName = function (accountName) {
        return $.ajax({
            url : apiUrl + 'detail/queryDetailsByName?name=' + accountName,
            beforeSend : function (xhr) { 
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
        }).fail(function (err) {
            console.warn(err);
        });
    };

    var getDetailsByNameAndDateRange = function (accountName, startDate, endDate) {
        return $.ajax({
            url : apiUrl + 'detail/queryDetailsByNameAndDate?name=' + accountName + '&startdate=' + startDate + '&enddate=' + endDate,
            beforeSend : function (xhr) { 
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
        }).fail(function (err) {
            console.warn(err);
        });
    };

    var updateAccountByAmount = function (name, account) {
        return $.ajax({
            type : 'POST',
            url : apiUrl + 'lunch/updateAccountByAmount',
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
    
    var insertDetail = function (name, date, amount) {
        return $.ajax({
            type : 'POST',
            url : apiUrl + 'lunch/insertDetail',
            data : {
                name : name,
                date : date,
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
    api.updateAccountByAmount = updateAccountByAmount;
    api.getDetailsByName = getDetailsByName;
    api.getDetailsByNameAndDateRange = getDetailsByNameAndDateRange;
    api.updateDetail = updateDetail;
    api.insertDetail = insertDetail;
    
    return api;
});
