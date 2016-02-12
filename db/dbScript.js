/* jshint ignore:start */
// Create Master Collection
db.lunch.ensureIndex({name:1}, {unique:true});
db.lunch.insert({name:'yuki', account: 0});
db.lunch.insert({name:'nick', account: 0});
db.lunch.insert({name:'tony', account: 0});
db.lunch.insert({name:'weipu', account: 0});
db.lunch.insert({name:'chen', account: 0});
db.lunch.insert({name:'paul', account: 0});

// db.lunch.update({name:'yuki'},{$set: {account: 53}});
// db.lunch.update({name:'nick'},{$set: {account: -244.5}});
// db.lunch.update({name:'tony'},{$set: {account: -34.5}});
// db.lunch.update({name:'weipu'},{$set: {account: -49.5}});
// db.lunch.update({name:'chen'},{$set: {account: 29}});
// db.lunch.update({name:'paul'},{$set: {account: 0}});

db.lunch.update({name:'yuki'},{$set: {mail: '86158131@qq.com'}});
db.lunch.update({name:'nick'},{$set: {mail: '372486150@qq.com'}});
db.lunch.update({name:'tony'},{$set: {mail: 'tony.chen@transfinder.com'}});
db.lunch.update({name:'weipu'},{$set: {mail: '94178875@qq.com'}});
db.lunch.update({name:'chen'},{$set: {mail: 'chenhao.gao@transfinder.com'}});
db.lunch.update({name:'paul'},{$set: {mail: 'rainbow494@qq.com'}});

//Todo : add index of table

//db.detail.remove({});
//db.counters.remove({});
// Create Detail Collection
db.counters.ensureIndex({_id:1}, {unique:true});
db.counters.insert({_id: 'detail_seq', seq: 0});

db.system.js.save(
    {
        _id:"getNextSequence",
        value:function (name) {
            var ret = db.counters.findAndModify(
                  {
                    query: { _id: name },
                    update: { $inc: { seq: 1 } },
                    new: true
                  }
           );
           return ret.seq;
        }
    }
);

db.loadServerScripts();

// tzoffset = (new Date()).getTimezoneOffset() * 60000;
// // db.detail.insert({_id: getNextSequence('yuki_detail_seq'), amount: '0', update:(new Date(Date.now() - tzoffset)).toISOString().slice(0,-1).split('T')[0] });
// db.detail.insert({_id: getNextSequence('detail_seq'), name:'yuki', amount: -10, date:new Date('2015-12-01')});
// db.detail.insert({_id: getNextSequence('detail_seq'), name:'yuki', amount: -15, date:new Date('2015-12-02')});

// db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: -12, date:new Date('2015-12-17')});
// db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: -12, date:new Date('2015-12-18')});
// db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: -12, date:new Date('2015-12-19')});
// db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: -30, date:new Date('2015-12-20')});
// db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: -19, date:new Date('2015-12-21')});
// db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: -32, date:new Date('2015-12-22')});
// db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: -22, date:new Date('2015-12-23')});
// db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: -15, date:new Date('2015-12-24')});
// db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: -12, date:new Date('2015-12-26')});
// db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: 200, date:new Date('2015-12-26')});

db.weather.insert({date:new Date('2016-02-01'), high:4, low:0, 'text':'overcast'});
db.weather.insert({date:new Date('2016-02-02'), high:4, low:0, 'text':'sunny'});
db.weather.insert({date:new Date('2016-02-03'), high:7, low:1, 'text':'sunny'});
db.weather.insert({date:new Date('2016-02-04'), high:6, low:1, 'text':'overcast'});
db.weather.insert({date:new Date('2016-02-05'), high:8, low:1, 'text':'sunny'});
db.weather.insert({date:new Date('2016-02-06'), high:6, low:-1, 'text':'cloudy'});
db.weather.insert({date:new Date('2016-02-07'), high:9, low:2, 'text':'sunny'});
db.weather.insert({date:new Date('2016-02-08'), high:13, low:3, 'text':'sunny'});
db.weather.insert({date:new Date('2016-02-09'), high:17, low:8, 'text':'sunny'});
db.weather.insert({date:new Date('2016-02-10'), high:18, low:11, 'text':'cloudy'});
db.weather.insert({date:new Date('2016-02-11'), high:18, low:14, 'text':'rainy'});
db.weather.insert({date:new Date('2016-02-12'), high:20, low:14, 'text':'cloudy'});
db.weather.insert({date:new Date('2016-02-13'), high:19, low:4, 'text':'light rainy'});
db.weather.insert({date:new Date('2016-02-14'), high:6, low:0, 'text':'light rainy'});
// db.weather.insert({date:new Date('2016-02-15'), high:, low:, 'text':''});
// db.weather.insert({date:new Date('2016-02-16'), high:, low:, 'text':''});
// db.weather.insert({date:new Date('2016-02-17'), high:, low:, 'text':''});
// db.weather.insert({date:new Date('2016-02-18'), high:, low:, 'text':''});
// db.weather.insert({date:new Date('2016-02-19'), high:, low:, 'text':''});
// db.weather.insert({date:new Date('2016-02-20'), high:, low:, 'text':''});
// db.weather.insert({date:new Date('2016-02-21'), high:, low:, 'text':''});
// db.weather.insert({date:new Date('2016-02-22'), high:, low:, 'text':''});

//db.detail.remove({ amount: 0 })
//db.detail.update({'_id':14},{$set: {date:new Date('2016-01-18')}});
//db.detail.insert({_id: getNextSequence('detail_seq'), name:'tony', amount: -23.5, date:new Date('2016-01-20')});
//db.detail.find({"name":"tony"})

//db.tmp.remove({});
db.detail.aggregate([{$group:{_id: "$name",totalAmount: { $sum: "$amount" }}},{ $out : "tmp" }]);

// Normal solution : left join, need add if statement to handle unmatched rows.
// db.lunch.find().forEach(function (userAccount) {
    // //print(tojson(userAccount));
    // //print(userAccount.name);
    // var ret = db.tmp.findOne({ _id: userAccount.name }, { totalAmount: 1 });
    
    // if (ret)
    // {
        // print(tojson(ret));
        // userAccount.account = ret.totalAmount;
        // db.lunch.save(userAccount);
    // }
// });

// Better solution : right join, without unmatched rows.
db.tmp.find().forEach(function(ret){
        //print(tojson(ret));
       db.lunch.findAndModify({
            query:{name:ret._id},
            update:{$set :{account:ret.totalAmount}}
       });
});

/* jshint ignore:end */