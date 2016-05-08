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

    var updateDetail = function (id, amount, date) {
        return $.ajax({
            type : 'POST',
            url : apiUrl + 'lunch/updateDetail2',
            data : {
                id : id,
                amount : amount,
                date : date
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
            url : apiUrl + 'lunch/insertDetail2',
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

    var getWeathersByDateRange = function (startDate, endDate) {
        return $.ajax({
            url : apiUrl + 'weather/queryWeathersByDate?startdate=' + startDate + '&enddate=' + endDate,
            beforeSend : function (xhr) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
        }).fail(function (err) {
            console.warn(err);
        });
    };

    var insertDetail2 = function (name, date, amount) {
        return $.ajax({
            type : 'POST',
            url : apiUrl + 'lunch/insertDetail2',
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

    var insertDetails2 = function (details) {
        return $.ajax({
            type : 'POST',
            url : apiUrl + 'lunch/insertDetails2',
            data : {
                details : JSON.stringify(details)
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

    var verifyUserLogin = function () {
        return $.ajax({
            type : 'Get',
            url : apiUrl + 'verify',
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
    api.getWeathersByDateRange = getWeathersByDateRange;


    api.updateDetail2 = insertDetail2;
    api.insertDetail2 = insertDetail2;
    api.insertDetails2 = insertDetails2;

    api.verifyUserLogin = verifyUserLogin;
    return api;
});
