require(['common'], function () {require(['util', 'api', 'knockout', '../project/third-part/echarts/echarts.common.min.js', 'jquery', 'moment', 'moment-recur'], function (util, api, ko, echarts, $, moment) {

    var DataRangeTypeAll = 'all';

    function DetailViewModel() {
        ko.amdTemplateEngine.defaultPath = "../templates";
        this.obAccountName = ko.observable('paul');
        this.obLunchDetail = ko.observableArray();
        this.obInsertDate = ko.observable(util.getFormatToday());
        this.obInsertAmount = ko.observable(-1);
        this.obDateRanges = this._getDateRanges();
        this.obSelectedDateRange = ko.observable(this.obDateRanges()[0]);

        this.dataRangeSeleted = this.dataRangeSeleted.bind(this);
        this.loadPage = this.loadPage.bind(this);

        this.obRecharge = ko.computed(function() { return this._computedAmount(-1); }, this);
        this.obPayment =  ko.computed(function() { return this._computedAmount(1); }, this);

        this.myChart = echarts.init($('#main')[0]);


    }

    var DateRange = function(name, startDate, endDate, type) {
        this.displayName = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.type = type || 'range';
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
            new DateRange('全部至今', moment('2015-01-01'), moment(), DataRangeTypeAll)
            ]);
    };

    DetailViewModel.prototype.dataRangeSeleted = function(args, event) { // jshint ignore:line
        this.obSelectedDateRange(args);
        this.loadPage();
    };

    DetailViewModel.prototype.formatDateRange = function(dateRange)
    {
        var displayItem = dateRange.displayName;

        if (dateRange.type === DataRangeTypeAll)
            return displayItem;

        if (dateRange.startDate)
            displayItem += ' ' + util.getShortFormateDate(dateRange.startDate) + ' - ';
        if (dateRange.endDate)
            displayItem += util.getShortFormateDate(dateRange.endDate) + ' ';
        return displayItem;
    };

    DetailViewModel.prototype.convertToWeekDay = function(isoDate)
    {
        var date = util.covertISOToMomentDate(isoDate);
        return moment.weekdaysMin(date.weekday());
    };

    DetailViewModel.prototype.formatDate = function(isoDate)
    {
        var date = util.covertISOToMomentDate(isoDate);
        return util.getShortFormateDate(date);
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

        if (self.obSelectedDateRange().startDate || self.obSelectedDateRange().endDate){
            api.getDetailsByNameAndDateRange(
                self.obAccountName(), 
                util.getLongFormateDate(self.obSelectedDateRange().startDate), 
                util.getLongFormateDate(self.obSelectedDateRange().endDate)
            )
            .done(self._afterLoadDetails.bind(self));
        }
        else{
            api.getDetailsByName(
                self.obAccountName()
                )
            .done(self._afterLoadDetails.bind(self));
        }
    };

    var ChartData = function(date, payment, temperature) {
        this.date = date;
        this.payment = payment;
        this.temperature = temperature;
    };

    DetailViewModel.prototype._afterLoadDetails = function (data) {
        var result = JSON.parse(data);
        this.obLunchDetail(result);

        var series = this._getSeries({
          'startDate' : this._getSeriesStartDate(),  
          'endDate' : this.obSelectedDateRange().endDate,
          'details' : this.obLunchDetail(),
          'weather' : []
        });
        this.loadChart(series, this.myChart);
    };

    DetailViewModel.prototype._getSeriesStartDate = function() {
        var startDate = this.obSelectedDateRange().startDate;

        if (this.obSelectedDateRange().type !== DataRangeTypeAll || 
            this.obLunchDetail().length === 0)
            return startDate;

        var detailStartDate = util.covertISOToMomentDate(this.obLunchDetail()[0].date);

        startDate = moment.max(startDate, detailStartDate);
        startDate = moment.min(startDate, this.obSelectedDateRange().endDate.day(7, 'days'));
        return startDate;
    };

    DetailViewModel.prototype._getSeries = function(option) {
        var details = option.details;

        var startDate = option.startDate;
        var endDate = option.endDate;
        var dates = startDate.recur().every(1).days().endDate(endDate).all();

        var series = dates.map(function(date) {
            var todayPayments = details.filter(function (detail) {
                if (util.covertISOToFormatDate(date.toISOString()) === util.covertISOToFormatDate(detail.date) && detail.amount < 0)
                    return true;
            });

            var payment = 0;
            if (todayPayments.length > 0)
                payment = todayPayments.reduce(function(sum, todayPayments) {
                        return sum + todayPayments.amount;
                }, 0) * -1;

            var temperature = 0;
            return new ChartData(date, payment, temperature);
        });

        return series;
    };

    DetailViewModel.prototype.loadChart = function(series, echart){

        var xAxisData = series.map(function(item) {
            return item.date.format('M/D');
        });

        var seriesPayment = series.map(function(item) {
            return item.payment;
        });

        var seriesTemperature = series.map(function(item) {
            return item.temperature;
        });

        var option = {
            title : {
                text : ""
            },
            tooltip : {
                trigger : 'axis',
                showDelay : 100,
                axisPointer : {
                    type : 'shadow'
                }
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    restore : {},
                    dataView : {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    saveAsImage : {show: true}
                }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true,
            //backgroundColor : '#aaa',
            //containLabel : false,
            //borderWidth : 1
            },
            legend: {
                data:['支出','气温']
            },
            xAxis : [
            {
                type : 'category',
                data : xAxisData,
                // name : 'week day',
                // nameLocation :'middle',
                axisLine: {
                    show:false
                }
            }
            ],
            yAxis : [
            {
                type : 'value',
                name : '支出',
                boundaryGap: ['0', '1'],
                // axisLine: {
                //     show:true
                // }
            },
            {
                type : 'value',
                name : '气温',
                axisLabel : {
                    formatter: '{value} °C'
                },
                // axisLine: {
                //     show:true
                // }
            }],
            series : [
            {
                name:'支出',
                type:'bar',
                data:seriesPayment
            },
            {
                name:'气温',
                type:'line',
                yAxisIndex:1,
                data:seriesTemperature
            }]
        };
        echart.setOption(option);
    };

    setTimeout(function() {
        var viewModel = new DetailViewModel();
        ko.applyBindings(viewModel);
        viewModel.loadPage();

        $(window).resize(function(){
            if (viewModel.myChart)
                viewModel.myChart.resize();
        });
    }, 0);

    
});});