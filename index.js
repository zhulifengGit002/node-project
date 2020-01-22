const express = require("express")
const multer  = require('multer')
const bodyParser = require("body-parser")
const cors = require('cors') // 解决跨域
const path = require('path')
const fs = require("fs");
const db = require('./db/db');
const app = express();
const ObjectID = require('mongodb').ObjectID;
//创建application/x-www-form-urlencoded编码解析
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(cors())
//app.use(bodyParser.json())

// 设置跨域访问
// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     next();
// });

//用户注册
app.post('/register', urlencodedParser, function (req, res) {
  var userName = req.body.userName;
  var pwd = req.body.pwd;
  if (!userName) {
      res.json({ code: -1, message: '用户名不能为空' });
  } else if (!pwd) {
      res.json({ code: -1, message: '密码不能为空' });
  } else {
      //存储到数据库
      db.searchUser({ name: userName }, function (result) {
        if (result.length > 0 && result[0].name == userName) {
            res.json({ code: -1, message: '用户已存在，可直接登录' });
        } else {
            // res.json({ code: -1, message: '不存在该用户' });
            db.insertUser({ name: userName, pwd: pwd }, function (insertResult) {
                console.log(insertResult)
                if (insertResult.insertedCount > 0) {
                    res.json({ code: 0, message: '注册成功' });
                } else {
                    res.json({ code: -1, message: '注册失败，请重新注册' });
                }
            })
        }
    });
  }
})

//用户登录
app.post('/login', urlencodedParser, function (req, res) {
  var userName = req.body.userName;
  var pwd = req.body.pwd; 
  console.log(userName)
  if (!userName) {
      res.json({ code: -1, message: '用户名不能为空' });
  } else if (!pwd) {
      res.json({ code: -1, message: '密码不能为空' });
  } else {     
      db.searchUser({ name: userName }, function (result) {
          if (result.length > 0) {
              if (result[0].name == userName && result[0].pwd == pwd) {
                  res.json({ code: 0, message: '登录成功' }); 
              } else {
                  res.json({ code: -1, message: '用户名或密码错误' });
              }
          } else {
              res.json({ code: -1, message: '不存在该用户' });
          }
      });
  }
})

//添加博客文章
app.post('/blog/addPost', urlencodedParser, function(req, res){
    var postTitle = req.body.title||'';
    var postSort = req.body.sort||'';
    var postLabel = req.body.label||'';
    var postContent = req.body.content||'';
    var postDate =  new Date().getTime();
    if (!postTitle) {
        res.json({ code: -1, message: '文章标题不能为空' });
    } else if (!postContent) {
        res.json({ code: -1, message: '文章内容不能为空' });
    } else {
        db.insertBlogPost({ title: postTitle,  sort:postSort, label:postLabel, content:postContent, timestamp:postDate}, function (insertResult) {
            console.log(insertResult)
                if (insertResult.insertedCount > 0) {
                    res.json({ code: 0, message: '添加成功' });
                } else {
                    res.json({ code: -1, message: '添加失败' });
                }
        });
    }
})

//查询博客文章
app.post('/blog/searchPost', urlencodedParser, function (req, res) {
    var title = req.body.title||'';
    var postId = req.body.postId||'';
    var pageSize = req.body.pageSize||'';
    console.log(pageSize)
    if(parseInt(pageSize) === 0){
        var dbData = {}
    }else{
        var dbData = {
            _id: ObjectID(postId)
        }
    }
    console.log(dbData)
    db.searchBlogPost(dbData, function (result) {
        if (result.length > 0) {
            res.json({ code: 0, message: result });
        } else {
            res.json({ code: -1, message: '未查询到' });
        }
    });
    
})

//删除博客文章 不懂为什么使用 timestamp _id 删除失败
app.post('/blog/deletePost', urlencodedParser, function (req, res) {
    var title = req.body.title||'';
    var postId = req.body.postId||'';
    console.log(ObjectID(postId))
    var dbData = {
        _id: ObjectID(postId)
    }
    if(!postId){
        res.json({ code: -1, message: '文章不能为空' });
    }else{
        db.deleteBlogPost(dbData, function (result) {
            console.log(result)
            if (result.deletedCount === 1) {
                res.json({ code: 0, message: '删除文档' });
            } else {
                res.json({ code: -1, message: '删除失败' });
            }
        });
    }
    
})

//自己创建
const uploadFolder = './public/uploads/';
// 通过 filename 属性定制
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, Date.now()+ '-' +  file.originalname);  
    }
});
var upload = multer({ storage: storage })
//var upload = multer({ dest: "public/uploads/" });
//文件上传
app.post('/upload', upload.single('imgFile'), function(req, res, next){
    var file = req.file;
    console.log(file)
    console.log('文件类型：%s', file.mimetype);
    console.log('原始文件名：%s', file.originalname);
    console.log('文件大小：%s', file.size);
    console.log('文件保存路径：%s', file.path);
    var url = 'http://47.104.215.238:5002/public/uploads/' + file.filename
    console.log(url)
    res.send({code: '0', message: '上传成功', url: url});
})

//获取图片
app.get('/public/uploads/*', function (req, res) {
    res.sendFile( __dirname + "/" + req.url );
    console.log("Request for " + req.url + " received.");
})

const server = app.listen(5002, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})