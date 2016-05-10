define(['jquery'], function ($) {
    var api = {};
    var apiUrl = 'http://<aws.hostname>:<aws.webserver.port>/api/';

    function getRequestOption(url) {
        return {
                url : url,
                beforeSend : function (xhr) {
                    xhr.overrideMimeType('text/plain; charset=x-user-defined');
                }
        };
    }

    function getRequest(url) {
        return $.ajax(
            getRequestOption(url)
        ).fail(function (err) {
            console.warn(err);
        });
    }

    function postRequestOption(url, data) {
        return {
            type : 'POST',
            url : url,
            data : data,
            beforeSend : function (xhr) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
        };
    }

    function postRequest(url, data) {
        return $.ajax(postRequestOption(url, data))
        .fail(function (err) {
            console.warn(err);
            return $.Deferred().reject(err);
        });
    }

    api.getSummary = function () {
        return getRequest(apiUrl + 'lunch/summary2');
    };

    api.getDetailsByName = function (accountName) {
        return getRequest(apiUrl + 'detail/queryDetailsByName?name=' + accountName);
    };

    api.getDetailsByNameAndDateRange = function (accountName, startDate, endDate) {
        return getRequest(apiUrl + 'detail/queryDetailsByNameAndDate?name=' + accountName +
            'startdate=' + startDate + 'enddate=' + endDate);
    };

    api.updateAccountMail = function (id, mail) {
        return postRequest(
            apiUrl + 'lunch/updateAccountMail',
            {
                id : id,
                mail : mail
            }
        );
    };

    api.updateAccountByAmount = function (name, account) {
        return postRequest(
            apiUrl + 'lunch/updateAccountByAmount',
            {
                name : name,
                account : account
            }
        );
    };

    api.updateDetail = function (id, amount, date) {
        return postRequest(
            apiUrl + 'lunch/updateDetail2',
            {
                id : id,
                amount : amount,
                date : date
            }
        );
    };

    api.insertDetail = function (name, date, amount) {
        return postRequest(
            apiUrl + 'lunch/insertDetail2',
            {
                name : name,
                date : date,
                amount : amount
            }
        );
    };

    api.insertDetail2 = function (name, date, amount) {
        return api.insertDetail(name, date, amount);
    };

    api.getWeathersByDateRange = function (startDate, endDate) {
        return getRequest(
            apiUrl + 'weather/queryWeathersByDate?startdate=' + startDate + '&enddate=' + endDate
        );
    };

    api.insertDetails2 = function (details) {
        return postRequest(
            apiUrl + 'lunch/insertDetails2',
            {
                details : JSON.stringify(details)
            }
        );
    };

    api.verifyUserLogin = function () {
        return getRequest(apiUrl + 'verify');
    };

    return api;
});
