/* jshint ignore:start */
// Create Master Collection
db.lunch.ensureIndex({name:1}, {unique:true});

db.lunch.insert({ "name" : "nick", "account" : 255.5, "mail" : "weihuan.wang@transfinder.com","group":"transfinder" });
db.lunch.insert({ "name" : "tony", "account" : 103.1, "mail" : "tony.chen@transfinder.com","group":"transfinder" });
db.lunch.insert({ "name" : "weipu", "account" : -35, "mail" : "weipu.zhao@transfinder.com","group":"transfinder" });
db.lunch.insert({ "name" : "paul", "account" : 965.7, "mail" : "rainbow494@qq.com","group":"transfinder" });
db.lunch.insert({ "name" : "ted", "account" : 78.4, "mail" : "kai.li@transfinder.com","group":"transfinder" });
db.lunch.insert({ "name" : "leo", "account" : 68, "mail" : "chenjie.deng@transfinder.com","group":"transfinder" });
db.lunch.insert({ "name" : "jacky", "account" : 118.4, "mail" : "jiaqi.Cai@transfinder.com","group":"transfinder" });
db.lunch.insert({ "name" : "will", "account" : 126.4, "mail" : "wei.xiao@transfinder.com","group":"transfinder" });
db.lunch.insert({ "name" : "test_1", "account" : 0, "mail" : "paul.huang@transfinder.com","group":"transfinder" });


db.lunch.insert({ "name" : "yuki", "account" : 0, "mail" : "wang.yuqi@delianac.com","group":"delianac"});
db.lunch.insert({ "name" : "gan_liangqin", "account" : 0, "mail" : "gan.liangqin@delianac.com","group":"delianac"});
db.lunch.insert({ "name" : "qian_simin", "account" : 0, "mail" : "qian.simin@delianac.com","group":"delianac"});
db.lunch.insert({ "name" : "zhang_yingtao", "account" : 0, "mail" : "zhang.yingtao@delianac.com","group":"delianac"});
db.lunch.insert({ "name" : "yan_lu", "account" : 0, "mail" : "yan.lu@delianac.com","group":"delianac"});

// db.lunch.update({},{$set:{"group":"transfinder"}},{multi:true});
// db.detail.update({},{$set:{"group":"transfinder"}},{multi:true});

db.lunch.find().forEach(function(ret){
        //print(tojson(ret));
       db.lunch.findAndModify({
            query:{name:ret.name},
            update:{
                $set : {
                    username:ret.name,
                    role: 'user'
                }
            }
       });
});
db.lunch.update({'username':'paul'},{$set:{"role": "admin"}});
db.lunch.update({'username':'yuki'},{$set:{"role": "admin"}});


// db.detail.remove({});
// db.detail.insert(name:'nick', amount: -15, date:new Date('2015-12-24')});
// db.detail.insert(name:'nick', amount: -12, date:new Date('2015-12-26')});

db.weather.insert({date:new Date('2016-02-11'), high:18, low:14, 'text':'rainy'});
db.weather.insert({date:new Date('2016-02-12'), high:20, low:14, 'text':'cloudy'});
db.weather.insert({date:new Date('2016-02-13'), high:19, low:4, 'text':'light rainy'});

db.system.js.save(
    {
        _id:"updateLunchAmount",
        value:function (name) {
            db.detail.aggregate([{$group:{_id: "$name",totalAmount: { $sum: "$amount" }}},{ $out : "tmp" }]);
            
            db.tmp.aggregate([{$project:{ _id:"$_id", 
                 totalAmount: {
                    $divide:[
                    {
                        $subtract:[
                              {$multiply:['$totalAmount',100]},
                              {$mod:[{$multiply:['$totalAmount',100]}, 1]}
                        ]
                    },
                    100]
                }
            }},{ $out : "tmp2" }])

            
            // Better solution : right join, without unmatched rows.
            db.tmp2.find().forEach(function(ret){
                    //print(tojson(ret));
                   db.lunch.findAndModify({
                        query:{name:ret._id},
                        update:{$set :{account:ret.totalAmount}}
                   });
            });
        }
    }
);

db.loadServerScripts();

// Upgrade Detail Collection
// db.detail.find().forEach(function(doc){
//     doc._id=ObjectId(); db.detail_new.insert(doc);
// });
// db.detail_new.renameCollection("detail", true);

// Create Detail Collection
// db.counters.remove({});
// db.counters.ensureIndex({_id:1}, {unique:true});
// db.counters.insert({_id: 'detail_seq', seq: 0});
// db.system.js.save(
//     {
//         _id:"getNextSequence",
//         value:function (name) {
//             var ret = db.counters.findAndModify(
//                   {
//                     query: { _id: name },
//                     update: { $inc: { seq: 1 } },
//                     new: true
//                   }
//            );
//            return ret.seq;
//         }
//     }
// );
// tzoffset = (new Date()).getTimezoneOffset() * 60000;
// // db.detail.insert({_id: getNextSequence('yuki_detail_seq'), amount: '0', update:(new Date(Date.now() - tzoffset)).toISOString().slice(0,-1).split('T')[0] });
// db.loadServerScripts();

/* jshint ignore:end */
