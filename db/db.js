const mongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://text:db123456789@cluster0-vsvcn.mongodb.net/test?retryWrites=true&w=majority";

//根据条件查询用户是否存在
function searchUser(whereStr, callBack) {
    mongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology:true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db('nodeData');
        dbo.collection('user').find(whereStr).toArray(function (err, result) {
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
        var dbo = db.db('nodeData');
        //插入数据
        dbo.collection('user').insertOne(myobj, function (err, res) {
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
        var dbo = db.db('nodeData');
        dbo.collection('post_blog').find(whereStr).toArray(function (err, result) {
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
        var dbo = db.db('nodeData');
        //插入数据
        dbo.collection('post_blog').insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log('插入文章数据成功');
            callBack(res);
            db.close();
        })
    })
}

//删除文章remove() 方法已经过时了，现在官方推荐使用 deleteOne() 和 deleteMany() 方法。
function deleteBlogPost(whereStr, callBack) {
    mongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology:true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db('nodeData');
        dbo.collection('post_blog').deleteOne(whereStr, function(err, result){
            if (err) throw err;
            console.log('删除文章数据成功', result);
            callBack(result);
            db.close();
        })
    })
}

exports.searchUser = searchUser;
exports.insertUser = insertUser;
exports.searchBlogPost = searchBlogPost;
exports.insertBlogPost = insertBlogPost;
exports.deleteBlogPost = deleteBlogPost;