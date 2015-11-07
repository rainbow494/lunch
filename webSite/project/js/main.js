;
(function () {
	
    var obLunchAccounts = ko.observableArray();
	
	myViewModel = {
		obLunchAccounts
	};
	
    var loadPage = function () {
        loadData();
	}
	
    var loadData = function () {
        var url = 'http://localhost:3000/api/lunch/summary';
        $.ajax({
            url : url,
            beforeSend : function (xhr) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
			}
		})
        .done(function (data) {
			var result = $.parseJSON(data);
            obLunchAccounts(result);
		});
	}
	
	loadPage();
})();
