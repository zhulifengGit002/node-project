const mongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://text:db123456789@cluster0-vsvcn.mongodb.net/test?retryWrites=true&w=majority";

//根据条件查询用户是否存在
function searchUser(whereStr, callBack) {
    mongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology:true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db('node_runoob');
        dbo.collection('site').find(whereStr).toArray(function (err, result) {
            if (err) throw err;
            console.log('所查询的数据', result);
            callBack(result);
            db.close();
        })
    })
}
//插入一条用户数据到数据库
function insertUser(myobj, callBack) {
    mongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology:true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db('node_runoob');
        //插入数据
        dbo.collection('site').insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log('插入数据成功');
            callBack(res);
            db.close();
        })
    })
}
//查询博客文章
function searchBlogPost(whereStr, callBack) {
    mongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology:true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db('node_blogPost');
        dbo.collection('site').find(whereStr).toArray(function (err, result) {
            if (err) throw err;
            console.log('所查询的数据', result);
            callBack(result);
            db.close();
        })
    })
}
//插入博客文章
function insertBlogPost(myobj, callBack) {
    mongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology:true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db('node_blogPost');
        //插入数据
        dbo.collection('site').insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log('插入章数据成功');
            callBack(res);
            db.close();
        })
    })
}

exports.searchUser = searchUser;
exports.insertUser = insertUser;
exports.searchBlogPost = searchBlogPost;
exports.insertBlogPost = insertBlogPost;