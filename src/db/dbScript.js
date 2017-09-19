/* jshint ignore:start */
// Create Master Collection
db.lunch.ensureIndex({name:1}, {unique:true});

db.lunch.insert({ "role": "user", "admin" : "paul", "account" : 0, "mail" : "paul.huang@transfinder.com","group":"transfinder" });
db.lunch.insert({ "role": "user", "name" : "nick", "account" : 0, "mail" : "weihuan.wang@transfinder.com","group":"transfinder" });
db.lunch.insert({ "role": "user", "name" : "tony", "account" : 0, "mail" : "tony.chen@transfinder.com","group":"transfinder" });
db.lunch.insert({ "role": "user", "name" : "ted", "account" : 0, "mail" : "kai.li@transfinder.com","group":"transfinder" });
db.lunch.insert({ "role": "user", "name" : "leo", "account" : 0, "mail" : "chenjie.deng@transfinder.com","group":"transfinder" });
db.lunch.insert({ "role": "user", "name" : "jacky", "account" : 0, "mail" : "jiaqi.Cai@transfinder.com","group":"transfinder" });
db.lunch.insert({ "role": "user", "name" : "will", "account" : 0, "mail" : "wei.xiao@transfinder.com","group":"transfinder" });
db.lunch.insert({ "role": "user", "name" : "jeffrey", "account" : 0, "mail" : "jeffrey.chen@transfinder.com","group":"transfinder" });
db.lunch.insert({ "role": "user", "name" : "lichen", "account" : 0, "mail" : "chen.li@transfinder.com","group":"transfinder" });
db.lunch.insert({ "role": "user", "name" : "fred", "account" : 0, "mail" : "fred.xu@transfinder.com","group":"transfinder" });
db.lunch.insert({ "role": "user", "name" : "sara", "account" : 0, "mail" : "xu.chu@transfinder.com","group":"transfinder" });
db.lunch.insert({ "role": "user", "name" : "sunny", "account" : 0, "mail" : "siyang.liao@transfinder.com","group":"transfinder" });

// db.detail.remove({});
// db.detail.insert({name:'nick', amount: -15, date:new Date('2018-01-01')});

// db.lunch.insert({ "name" : "yuki", "account" : 0, "mail" : "wang.yuqi@delianac.com","group":"delianac"});
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

db.loadServerScripts(); // call this before load custom function
updateLunchAmount();

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
