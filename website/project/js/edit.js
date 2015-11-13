;
(function () {
	
    var obName = ko.observable('paul');
    var obAccount = ko.observable(100);
    var obResult = ko.observable();
	
    var updataAccountClick = function () {
        
        updataAccount();
    }
	
    var updataAccount = function () {
        var url = 'http://localhost:3000/api/lunch/updateAccount';
        $.ajax({
            type: 'POST',
            url : url,
            data: {name: obName(), account: obAccount()},
            beforeSend : function (xhr) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
        })
        .done(function (data) {
			var result = $.parseJSON(data);
            obResult(result);
        });
    }
    
    editViewModel = {
		obName:obName,
        obAccount:obAccount,
        obResult:obResult,
        updataAccountClick:updataAccountClick
    };
    
    ko.applyBindings(editViewModel);
})();
