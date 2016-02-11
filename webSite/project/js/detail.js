require(['common'], function () {
    require(['util', 'api', 'knockout', 'moment'], function (util, api, ko, moment) {

        function DetailViewModel() {
            ko.amdTemplateEngine.defaultPath = "../templates";
            this.obAccountName = ko.observable('paul');
            this.obLunchDetail = ko.observableArray();
            this.obInsertDate = ko.observable(util.getToday());
            this.obInsertAmount = ko.observable(-1);
            this.obDateRanges = this._getDateRanges();
            this.obSelectedDateRange = ko.observable(this.obDateRanges()[0]);

            this.dataRangeSeleted = this.dataRangeSeleted.bind(this);
            this.loadPage = this.loadPage.bind(this);

            this.obRecharge = ko.computed(function() { return this._computedAmount(-1); }, this);
            this.obPayment =  ko.computed(function() { return this._computedAmount(1); }, this);  
        }

        var DateRange = function(name, startDate, endDate) {
            this.displayName = name;
            this.startDate = startDate;
            this.endDate = endDate;
        };

        DetailViewModel.prototype._computedAmount = function(reduceCondition) {
            if(this.obLunchDetail().length === 0)
                return '0.00';

            var result = this.obLunchDetail().reduce(function(sum, prevItem) {
                if (prevItem.amount * reduceCondition < 0)
                    return sum + prevItem.amount;
                else
                    return sum;
            }, 0);

            return result.toFixed(2);
        };

        DetailViewModel.prototype._getDateRanges = function(){
            return ko.observableArray([
                new DateRange('本周', moment().day(0), moment().day(6)),
                new DateRange('上周', moment().day(-7), moment().day(-1)),
                new DateRange('本月', moment().startOf('month'), moment().endOf('month')),
                new DateRange('全部记录')
                ]);
        };

        DetailViewModel.prototype.dataRangeSeleted = function(args, event) { // jshint ignore:line
            this.obSelectedDateRange(args);
            this.loadPage();
        };

        DetailViewModel.prototype.formatDateRange = function(dateRange)
        {
            var displayItem = dateRange.displayName;
            if (dateRange.startDate)
                displayItem += ' ' + dateRange.startDate.format('MM/DD') + ' - ';
            if (dateRange.endDate)
                displayItem += dateRange.endDate.format('MM/DD') + ' ';
            return displayItem;
        };

        DetailViewModel.prototype.convertToWeekDay = function(dateString)
        {
            var date = moment(dateString.split('T')[0]);
            return moment.weekdaysMin(date.weekday());
        };

        DetailViewModel.prototype.formatDate = function(dateString)
        {
            var date = moment(dateString.split('T')[0]);
            return date.format('MM/DD');
        };
        
        DetailViewModel.prototype.updateDetailClickGen = function(id, amount){
            var self = this;
            return function(){
                api.updateDetail(id, amount)
                .done(self.loadPage);
            };
        };
        
        DetailViewModel.prototype.insertDetailClick = function()
        {
            var self = this;
            api.insertDetail(self.obAccountName(), self.obInsertDate(), self.obInsertAmount())
            .done(self.loadPage);
        };

        DetailViewModel.prototype.loadPage = function () {
            var self = this;

            var name = util.getParameterByName('name') || self.obAccountName(); 
            self.obAccountName(name);

            if (self.obSelectedDateRange().startDate || self.obSelectedDateRange().endDate)
                api.getDetailsByNameAndDateRange(self.obAccountName(), self.obSelectedDateRange().startDate.format('YYYY-MM-DD'), self.obSelectedDateRange().endDate.format('YYYY-MM-DD'))
            .done(function (data) {
                var result = JSON.parse(data);
                self.obLunchDetail(result);
            });
            else
                api.getDetailsByName(self.obAccountName())
            .done(function (data) {
                var result = JSON.parse(data);
                self.obLunchDetail(result);
            });
            
        };

        // setTimeout(function() {
            var viewModel = new DetailViewModel();
            ko.applyBindings(viewModel);
            viewModel.loadPage();
        // }, 0);
    });
});